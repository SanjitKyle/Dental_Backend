import axios from 'axios';

const PATIENT_SERVICE_URL = process.env.PATIENT_SERVICE_URL || 'http://127.0.0.1:5002/api/patients';
const DOCTOR_SERVICE_URL = process.env.DOCTOR_SERVICE_URL || 'http://127.0.0.1:5003/api/doctors';

/**
 * Enriches invoice(s) with Patient and Doctor profiles from their respective microservices.
 * Optimized with batching to avoid N+1 network requests and fault-tolerant against service timeouts.
 */
export const enrichInvoicesWithProfiles = async (invoices, authToken = '') => {
    if (!invoices) return invoices;
    const isArray = Array.isArray(invoices);
    const invoiceList = isArray ? invoices : [invoices];

    if (invoiceList.length === 0) return invoices;

    const headers = authToken
        ? { Authorization: authToken.startsWith('Bearer ') ? authToken : `Bearer ${authToken}` }
        : {};
        // 

    // 1. Collect unique IDs across the invoice batch
    const patientIds = [...new Set(invoiceList.map(inv => inv.patientId).filter(Boolean))];
    const doctorIds = [...new Set(invoiceList.map(inv => inv.doctorId).filter(Boolean))];

    // 2. Fetch unique profiles concurrently
    const patientPromises = patientIds.map(async (id) => {
        try {
            const res = await axios.get(`${PATIENT_SERVICE_URL}/${id}`, { headers, timeout: 3500 });
            return { id, data: res.data?.data || null };
        } catch {
            return { id, data: null };
        }
    });

    const doctorPromises = doctorIds.map(async (id) => {
        try {
            const res = await axios.get(`${DOCTOR_SERVICE_URL}/${id}`, { headers, timeout: 3500 });
            return { id, data: res.data?.data || null };
        } catch {
            return { id, data: null };
        }
    });

    const [patientResults, doctorResults] = await Promise.all([
        Promise.all(patientPromises),
        Promise.all(doctorPromises)
    ]);

    // 3. Build O(1) lookup maps
    const patientMap = new Map();
    patientResults.forEach(r => { if (r.data) patientMap.set(String(r.id), r.data); });

    const doctorMap = new Map();
    doctorResults.forEach(r => { if (r.data) doctorMap.set(String(r.id), r.data); });

    // 4. Attach profiles to each invoice
    const enrichedList = invoiceList.map((inv) => {
        const plainInv = typeof inv.toObject === 'function' ? inv.toObject() : { ...inv };
        return {
            ...plainInv,
            patient: patientMap.get(String(plainInv.patientId)) || null,
            doctor: doctorMap.get(String(plainInv.doctorId)) || null
        };
    });

    return isArray ? enrichedList : enrichedList[0];
};

export default enrichInvoicesWithProfiles;
