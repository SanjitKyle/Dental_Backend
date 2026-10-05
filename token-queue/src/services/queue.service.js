import * as queueRepo from '../repository/queue.repository.js';
import * as patientClient from '../clients/patientService.client.js';
import AppError from '../utils/AppError.js';

/**
 * Issue a new Queue Token:
 * - If patientId is provided -> Verifies patient via HTTP call to patient-service.
 * - If patientId is NOT provided -> Calls patient-service via HTTP (POST /api/patients)
 *   to create the patient, receives patient._id, and assigns it to the token.
 */
export const issueToken = async (payload, issuedByUserId, authToken = null) => {
  const {
    patientId,
    patientName,
    phone,
    email,
    age,
    gender,
    blood_group,
    address,
    doctorId,
    doctorName,
    service,
    roomNumber,
    priority = 'NORMAL',
    notes,
  } = payload;

  if (!doctorId || !doctorName) {
    throw new AppError('Doctor ID and Doctor Name are required', 400);
  }

  let finalPatientId = patientId;
  let snapshot = {
    name: patientName || 'Patient',
    phone: phone ? String(phone) : '',
    age: age ? Number(age) : undefined,
    gender: gender || 'Male',
  };

  // 1. Service-to-Service Communication with patient-service
  if (finalPatientId) {
    // 1A. patientId is supplied -> Verify patient exists in patient-service
    try {
      const existingPatient = await patientClient.getPatientById(finalPatientId, authToken);
      if (existingPatient) {
        snapshot.name = existingPatient.full_name || existingPatient.name || snapshot.name;
        snapshot.phone = existingPatient.phone ? String(existingPatient.phone) : snapshot.phone;
        snapshot.age = existingPatient.age ? Number(existingPatient.age) : snapshot.age;
        snapshot.gender = existingPatient.gender || snapshot.gender;
      }
    } catch (err) {
      console.warn(`[token-queue] Warning fetching patient ${finalPatientId}:`, err.message);
      // Fallback: Proceed with provided details if service is in transient state
    }
  } else {
    // 1B. Walk-in patient without patientId -> Auto-register in patient-service via HTTP
    const cleanName = patientName ? String(patientName).trim() : '';
    const cleanPhone = phone ? String(phone).trim() : '';

    if (!cleanName || !cleanPhone) {
      throw new AppError(
        'Please provide either patientId OR both patientName and contact phone number',
        400
      );
    }

    try {
      const newPatientPayload = {
        full_name: cleanName,
        phone: cleanPhone,
        email: email ? String(email).trim().toLowerCase() : `walkin_${Date.now()}@clinic.local`,
        age: age ? String(age) : undefined,
        gender: gender || 'Male',
        blood_group: blood_group || undefined,
        address: address || '',
        note: notes || 'Registered via Queue Token Walk-in',
      };

      const createdPatient = await patientClient.createPatient(newPatientPayload, authToken);
      finalPatientId = createdPatient._id || createdPatient.id;
      snapshot.name = createdPatient.full_name || cleanName;
      snapshot.phone = createdPatient.phone ? String(createdPatient.phone) : cleanPhone;
    } catch (err) {
      console.error('[token-queue] Failed to auto-register patient via patient-service:', err.message);
      throw new AppError(
        `Failed to create patient record in patient-service: ${err.message}`,
        502
      );
    }
  }

  // 2. Generate Daily Sequence Token Number
  const today = new Date().toISOString().split('T')[0];
  const todaysCount = await queueRepo.countTokensForDateAndDoctor(today, doctorId);
  const nextTokenNumber = todaysCount + 1;

  const prefix = priority.toUpperCase() === 'EMERGENCY' ? 'EM' : priority.toUpperCase() === 'URGENT' ? 'UR' : 'T';
  const tokenCode = `${prefix}-${String(nextTokenNumber).padStart(2, '0')}`;

  // 3. Save Queue Token in Database
  const tokenRecord = await queueRepo.createToken({
    tokenNumber: nextTokenNumber,
    tokenCode,
    queueDate: today,
    patientId: String(finalPatientId),
    patientSnapshot: snapshot,
    doctorId,
    doctorName,
    service: service || 'General Consultation',
    roomNumber: roomNumber || 'Chair 1',
    priority: priority.toUpperCase(),
    notes: notes || '',
    issuedBy: issuedByUserId || null,
  });

  return tokenRecord;
};

/**
 * Get active live queue for doctor / chair
 */
export const getLiveQueue = async ({ doctorId, date }) => {
  const queueDate = date || new Date().toISOString().split('T')[0];
  const statusList = ['WAITING', 'IN_CONSULTATION'];

  return await queueRepo.getLiveQueue({
    queueDate,
    doctorId,
    statusList,
  });
};

/**
 * Update token status (e.g. WAITING -> IN_CONSULTATION -> COMPLETED)
 */
export const changeTokenStatus = async (tokenId, newStatus) => {
  const validStatuses = ['WAITING', 'IN_CONSULTATION', 'COMPLETED', 'SKIPPED', 'CANCELLED'];
  if (!validStatuses.includes(newStatus)) {
    throw new AppError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`, 400);
  }

  const updateFields = { status: newStatus };

  if (newStatus === 'IN_CONSULTATION') {
    updateFields.consultationStartTime = new Date();
  } else if (newStatus === 'COMPLETED' || newStatus === 'SKIPPED' || newStatus === 'CANCELLED') {
    updateFields.consultationEndTime = new Date();
  }

  const updatedToken = await queueRepo.updateTokenStatus(tokenId, updateFields);
  if (!updatedToken) {
    throw new AppError(`Token not found with ID: ${tokenId}`, 404);
  }

  return updatedToken;
};

/**
 * List tokens with pagination and filters
 */
export const getTokens = async ({ page = 1, limit = 20, doctorId, status, date }) => {
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.max(1, parseInt(limit, 10) || 20);
  const skip = (pageNum - 1) * limitNum;

  const query = {};
  if (date) query.queueDate = date;
  if (doctorId) query.doctorId = doctorId;
  if (status && status !== 'ALL') query.status = status;

  const { tokens, total } = await queueRepo.getAllTokensPaginated({
    query,
    limit: limitNum,
    skip,
  });

  return {
    tokens,
    total,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(total / limitNum),
  };
};
