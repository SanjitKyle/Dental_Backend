import Clinic from '../models/Clinic.model.js';

export const createClinic = async (clinicData) => {
  const clinic = new Clinic(clinicData);
  return await clinic.save();
};

export const findClinicById = async (id) => {
  return await Clinic.findById(id).lean();
};

export const findClinicByEmail = async (ownerEmail) => {
  return await Clinic.findOne({ ownerEmail: ownerEmail.toLowerCase().trim() }).lean();
};

export const updateClinicById = async (id, updateFields) => {
  return await Clinic.findByIdAndUpdate(
    id,
    { $set: updateFields },
    { new: true, runValidators: true }
  ).lean();
};

export const getAllClinicsPaginated = async ({ query, limit = 20, skip = 0 }) => {
  const [clinics, total] = await Promise.all([
    Clinic.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Clinic.countDocuments(query),
  ]);

  return { clinics, total };
};

export const getPlatformStats = async () => {
  const [total, active, trial, pro] = await Promise.all([
    Clinic.countDocuments(),
    Clinic.countDocuments({ isActive: true }),
    Clinic.countDocuments({ 'subscription.plan': 'TRIAL' }),
    Clinic.countDocuments({ 'subscription.plan': 'PRO' }),
  ]);

  return { total, active, trial, pro };
};
