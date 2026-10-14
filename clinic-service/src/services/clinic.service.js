import * as clinicRepo from '../repository/clinic.repository.js';
import AppError from '../utils/AppError.js';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://127.0.0.1:5001/api/auth';

/**
 * Register a new Dental Clinic:
 * 1. Verifies ownerEmail doesn't already own a clinic.
 * 2. Creates the Clinic document in clinic-service.
 * 3. Creates the Clinic Admin user account in auth-service with role: 'clinic_admin' and clinicId.
 */
export const registerNewClinic = async (payload) => {
  const {
    clinicName,
    ownerName,
    ownerEmail,
    password,
    phone,
    city,
    state,
    address,
  } = payload;

  if (!clinicName || !ownerName || !ownerEmail || !password || !phone) {
    throw new AppError('Clinic name, doctor name, email, phone, and password are required', 400);
  }

  const cleanEmail = ownerEmail.toLowerCase().trim();

  // Check if clinic already registered with this email
  const existingClinic = await clinicRepo.findClinicByEmail(cleanEmail);
  if (existingClinic) {
    throw new AppError('A clinic is already registered under this email address', 409);
  }

  // 1. Create Clinic Document
  const newClinic = await clinicRepo.createClinic({
    name: clinicName.trim(),
    ownerName: ownerName.trim(),
    ownerEmail: cleanEmail,
    phone: String(phone).trim(),
    address: {
      street: address || '',
      city: city || '',
      state: state || '',
    },
    subscription: {
      plan: 'TRIAL',
      status: 'ACTIVE',
      trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14-day free trial
    },
  });

  // 2. Inter-Service Call: Register Clinic Owner in auth-service
  let authUserId = null;
  try {
    const authRes = await axios.post(`${AUTH_SERVICE_URL}/register`, {
      name: ownerName.trim(),
      email: cleanEmail,
      password: password,
      role: 'clinic_admin',
      clinicId: String(newClinic._id),
      clinicName: newClinic.name,
    }, { timeout: 7000 });

    if (authRes.data?.data) {
      authUserId = authRes.data.data._id || authRes.data.data.id;
    }
  } catch (err) {
    console.error('[clinic-service] Error creating auth-service account:', err.message);
    // Note: In case auth-service fails, we can log and proceed or rollback
  }

  if (authUserId) {
    await clinicRepo.updateClinicById(newClinic._id, { ownerUserId: String(authUserId) });
  }

  return await clinicRepo.findClinicById(newClinic._id);
};

export const getClinicProfile = async (clinicId) => {
  const clinic = await clinicRepo.findClinicById(clinicId);
  if (!clinic) {
    throw new AppError('Clinic not found', 404);
  }
  return clinic;
};

export const updateClinicProfile = async (clinicId, updateData) => {
  // Prevent direct mutation of subscription via general update
  delete updateData.subscription;
  delete updateData.ownerUserId;

  const updated = await clinicRepo.updateClinicById(clinicId, updateData);
  if (!updated) {
    throw new AppError('Clinic not found', 404);
  }
  return updated;
};

/**
 * Super-Admin endpoints
 */
export const listAllClinics = async ({ page = 1, limit = 20, plan, status, search }) => {
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.max(1, parseInt(limit, 10) || 20);
  const skip = (pageNum - 1) * limitNum;

  const query = {};
  if (plan && plan !== 'ALL') query['subscription.plan'] = plan;
  if (status && status !== 'ALL') query['subscription.status'] = status;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { ownerEmail: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
    ];
  }

  const { clinics, total } = await clinicRepo.getAllClinicsPaginated({
    query,
    limit: limitNum,
    skip,
  });

  return {
    clinics,
    total,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(total / limitNum),
  };
};

export const toggleClinicStatus = async (clinicId, isActive) => {
  const updated = await clinicRepo.updateClinicById(clinicId, { isActive });
  if (!updated) {
    throw new AppError('Clinic not found', 404);
  }
  return updated;
};

export const getPlatformMetrics = async () => {
  return await clinicRepo.getPlatformStats();
};
