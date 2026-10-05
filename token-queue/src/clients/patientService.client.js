import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const PATIENT_SERVICE_URL = process.env.PATIENT_SERVICE_URL || 'http://127.0.0.1:5002/api/patients';

/**
 * Fetch patient profile from patient-service over HTTP
 */
export const getPatientById = async (patientId, authToken = null) => {
  try {
    const headers = {};
    if (authToken) {
      headers['Authorization'] = authToken.startsWith('Bearer ') ? authToken : `Bearer ${authToken}`;
    }

    const response = await axios.get(`${PATIENT_SERVICE_URL}/${patientId}`, {
      headers,
      timeout: 5000,
    });

    if (response.data?.success && response.data?.data) {
      return response.data.data;
    }
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      return null;
    }
    console.error(`[patientServiceClient] Error fetching patient ${patientId}:`, error.message);
    throw new Error(error.response?.data?.message || 'Failed to communicate with patient-service');
  }
};

/**
 * Register a new walk-in patient directly in patient-service over HTTP
 */
export const createPatient = async (patientData, authToken = null) => {
  try {
    const headers = { 'Content-Type': 'application/json' };
    if (authToken) {
      headers['Authorization'] = authToken.startsWith('Bearer ') ? authToken : `Bearer ${authToken}`;
    }

    const response = await axios.post(`${PATIENT_SERVICE_URL}`, patientData, {
      headers,
      timeout: 5000,
    });

    if (response.data?.success && response.data?.data) {
      return response.data.data;
    }
    return response.data;
  } catch (error) {
    console.error('[patientServiceClient] Error creating patient in patient-service:', error.message);
    throw new Error(
      error.response?.data?.message || 'Failed to auto-register walk-in patient in patient-service'
    );
  }
};
