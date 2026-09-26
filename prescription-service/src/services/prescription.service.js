import * as prescriptionRepo from '../repository/prescription.repository.js';
import AppError from '../utils/AppError.js';

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
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const sequence = String(count + 1).padStart(4, '0');
    return `RX-${datePrefix}-${sequence}-${randomSuffix}`;
};

export const createPrescription = async (data, userId) => {
    if (!data.medications || data.medications.length === 0) {
        throw new AppError('Prescription must contain at least one medication', 400);
    }

    const prescriptionNumber = await generatePrescriptionNumber();
    const effectiveUserId = userId || data.createdBy || data.doctorId || 'system';

    const payload = {
        ...data,
        prescriptionNumber,
        createdBy: effectiveUserId,
        lastUpdatedBy: effectiveUserId
    };

    return await prescriptionRepo.create(payload);
};

export const getAllPrescriptions = async (query = {}) => {
    const {
        page = 1,
        limit = 10,
        offset,
        status,
        patientId,
        doctorId,
        appointmentId,
        search
    } = query;

    const filter = {};
    if (status) filter.status = status;
    if (patientId) filter.patientId = patientId;
    if (doctorId) filter.doctorId = doctorId;
    if (appointmentId) filter.appointmentId = appointmentId;
    if (search) {
        filter.$or = [
            { prescriptionNumber: { $regex: search, $options: 'i' } },
            { chiefComplaint: { $regex: search, $options: 'i' } }
        ];
    }

    const parsedPage = Math.max(1, parseInt(page, 10) || 1);
    const parsedLimit = Math.max(1, parseInt(limit, 10) || 10);
    const skip = offset !== undefined
        ? Math.max(0, parseInt(offset, 10) || 0)
        : (parsedPage - 1) * parsedLimit;

    const { prescriptions, total } = await prescriptionRepo.findAll({
        filter,
        skip,
        limit: parsedLimit,
        sort: { createdAt: -1 }
    });

    return {
        prescriptions,
        total,
        page: parsedPage,
        limit: parsedLimit,
        offset: skip,
        totalPages: Math.ceil(total / parsedLimit),
        hasNextPage: skip + parsedLimit < total,
        hasPrevPage: skip > 0 || parsedPage > 1
    };
};

export const getPrescriptionById = async (id) => {
    const prescription = await prescriptionRepo.findById(id);
    if (!prescription) {
        throw new AppError('Prescription not found', 404);
    }
    return prescription;
};

export const getPrescriptionByNumber = async (prescriptionNumber) => {
    const prescription = await prescriptionRepo.findByPrescriptionNumber(prescriptionNumber);
    if (!prescription) {
        throw new AppError('Prescription not found', 404);
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
        throw new AppError('Prescription not found', 404);
    }

    if (existing.status === 'cancelled' || existing.status === 'dispensed') {
        throw new AppError(`Cannot modify a prescription that is already ${existing.status}`, 400);
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
        throw new AppError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`, 400);
    }

    const existing = await prescriptionRepo.findById(id);
    if (!existing) {
        throw new AppError('Prescription not found', 404);
    }

    return await prescriptionRepo.updateStatus(id, status, userId);
};

export const deletePrescription = async (id) => {
    const existing = await prescriptionRepo.findById(id);
    if (!existing) {
        throw new AppError('Prescription not found', 404);
    }
    return await prescriptionRepo.deleteById(id);
};
