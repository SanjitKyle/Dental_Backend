import * as prescriptionRepo from '../repository/prescription.repository.js';

/**
 * Generate a unique sequential prescription number: RX-YYYYMMDD-XXXX
 */
const generatePrescriptionNumber = async () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const datePrefix = `${year}${month}${day}`;

    const count = await prescriptionRepo.countTodayPrescriptions(datePrefix);
    const sequence = String(count + 1).padStart(4, '0');
    return `RX-${datePrefix}-${sequence}`;
};

export const createPrescription = async (data, userId) => {
    if (!data.medications || data.medications.length === 0) {
        throw new Error('Prescription must contain at least one medication');
    }

    const prescriptionNumber = await generatePrescriptionNumber();

    const payload = {
        ...data,
        prescriptionNumber,
        createdBy: userId,
        lastUpdatedBy: userId
    };

    return await prescriptionRepo.create(payload);
};

export const getPrescriptionById = async (id) => {
    const prescription = await prescriptionRepo.findById(id);
    if (!prescription) {
        throw new Error('Prescription not found');
    }
    return prescription;
};

export const getPrescriptionByNumber = async (prescriptionNumber) => {
    const prescription = await prescriptionRepo.findByPrescriptionNumber(prescriptionNumber);
    if (!prescription) {
        throw new Error('Prescription not found');
    }
    return prescription;
};

export const getPrescriptionsByPatient = async (patientId, filters = {}) => {
    return await prescriptionRepo.findByPatientId(patientId, filters);
};

export const getPrescriptionsByDoctor = async (doctorId, filters = {}) => {
    return await prescriptionRepo.findByDoctorId(doctorId, filters);
};

export const getPrescriptionsByAppointment = async (appointmentId) => {
    return await prescriptionRepo.findByAppointmentId(appointmentId);
};

export const updatePrescription = async (id, updateData, userId) => {
    const existing = await prescriptionRepo.findById(id);
    if (!existing) {
        throw new Error('Prescription not found');
    }

    if (existing.status === 'cancelled' || existing.status === 'dispensed') {
        throw new Error(`Cannot modify a prescription that is already ${existing.status}`);
    }

    const payload = {
        ...updateData,
        lastUpdatedBy: userId
    };

    return await prescriptionRepo.updateById(id, payload);
};

export const updatePrescriptionStatus = async (id, status, userId) => {
    const validStatuses = ['draft', 'active', 'dispensed', 'cancelled', 'expired'];
    if (!validStatuses.includes(status)) {
        throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    const existing = await prescriptionRepo.findById(id);
    if (!existing) {
        throw new Error('Prescription not found');
    }

    return await prescriptionRepo.updateStatus(id, status, userId);
};

export const deletePrescription = async (id) => {
    const existing = await prescriptionRepo.findById(id);
    if (!existing) {
        throw new Error('Prescription not found');
    }
    return await prescriptionRepo.deleteById(id);
};
