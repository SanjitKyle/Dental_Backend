import * as clinicService from '../services/clinic.service.js';

export const registerClinic = async (req, res, next) => {
  try {
    const clinic = await clinicService.registerNewClinic(req.body);
    res.status(201).json({
      success: true,
      message: 'Clinic registered successfully with 14-day Free Trial',
      data: clinic,
    });
  } catch (err) {
    next(err);
  }
};

export const getMyClinic = async (req, res, next) => {
  try {
    const clinicId = req.clinicId || req.params.id;
    if (!clinicId) {
      return res.status(400).json({ success: false, message: 'Clinic ID not found in token' });
    }

    const clinic = await clinicService.getClinicProfile(clinicId);
    res.status(200).json({
      success: true,
      data: clinic,
    });
  } catch (err) {
    next(err);
  }
};

export const updateMyClinic = async (req, res, next) => {
  try {
    const clinicId = req.clinicId || req.params.id;
    const updated = await clinicService.updateClinicProfile(clinicId, req.body);
    res.status(200).json({
      success: true,
      message: 'Clinic profile & letterhead updated successfully',
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};

// Super-Admin controllers
export const listClinics = async (req, res, next) => {
  try {
    const { page, limit, plan, status, search } = req.query;
    const result = await clinicService.listAllClinics({ page, limit, plan, status, search });
    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (err) {
    next(err);
  }
};

export const setClinicActiveStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    const updated = await clinicService.toggleClinicStatus(id, isActive);
    res.status(200).json({
      success: true,
      message: `Clinic status set to ${isActive ? 'ACTIVE' : 'SUSPENDED'}`,
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};

export const getMetrics = async (req, res, next) => {
  try {
    const metrics = await clinicService.getPlatformMetrics();
    res.status(200).json({
      success: true,
      data: metrics,
    });
  } catch (err) {
    next(err);
  }
};
