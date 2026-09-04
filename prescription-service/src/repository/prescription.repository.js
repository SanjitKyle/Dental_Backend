import Prescription from '../models/prescription.model.js';

export const create = async (prescriptionData) => {
    const prescription = new Prescription(prescriptionData);
    return await prescription.save();
};

export const findById = async (id) => {
    return await Prescription.findById(id);
};

export const findByPrescriptionNumber = async (prescriptionNumber) => {
    return await Prescription.findOne({ prescriptionNumber });
};

export const findByPatientId = async (patientId, filters = {}) => {
    const query = { patientId, ...filters };
    return await Prescription.find(query).sort({ createdAt: -1 });
};

export const findByDoctorId = async (doctorId, filters = {}) => {
    const query = { doctorId, ...filters };
    return await Prescription.find(query).sort({ createdAt: -1 });
};

export const findByAppointmentId = async (appointmentId) => {
    return await Prescription.find({ appointmentId }).sort({ createdAt: -1 });
};

export const updateById = async (id, updateData) => {
    return await Prescription.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
    );
};

export const updateStatus = async (id, status, lastUpdatedBy) => {
    return await Prescription.findByIdAndUpdate(
        id,
        {
            $set: {
                status,
                lastUpdatedBy,
                updatedAt: new Date()
            }
        },
        { new: true, runValidators: true }
    );
};

export const countTodayPrescriptions = async (datePrefix) => {
    const regex = new RegExp(`^RX-${datePrefix}-`);
    return await Prescription.countDocuments({ prescriptionNumber: regex });
};

export const deleteById = async (id) => {
    return await Prescription.findByIdAndDelete(id);
};
