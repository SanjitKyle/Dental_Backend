import * as enquiryRepo from '../repository/enquiry.repository.js';
import AppError from '../utils/AppError.js';
import axios from 'axios';

export const createEnquiry = async (data, userId = null) => {
    if (!data.name || !data.name.trim()) {
        throw new AppError('Name is required', 400);
    }
    if (!data.phone || !data.phone.trim()) {
        throw new AppError('Phone number is required', 400);
    }

    const payload = {
        name: data.name.trim(),
        phone: data.phone.trim(),
        email: data.email ? data.email.trim().toLowerCase() : undefined,
        gender: data.gender || undefined,
        address: data.address || undefined,
        serviceRequested: data.serviceRequested || 'General Consultation',
        preferredDoctorId: data.preferredDoctorId || null,
        preferredDoctorName: data.preferredDoctorName || null,
        preferredDate: data.preferredDate || null,
        preferredTime: data.preferredTime || null,
        message: data.message || '',
        source: data.source || 'Website',
        status: 'New',
        priority: data.priority || 'Medium',
        createdBy: userId || 'public',
        lastUpdatedBy: userId || 'public'
    };

    return await enquiryRepo.create(payload);
};

export const getEnquiries = async (query = {}) => {
    const {
        status,
        source,
        priority,
        search,
        startDate,
        endDate,
        assignedTo,
        page = 1,
        limit = 50,
        sortBy = 'createdAt',
        order = 'desc'
    } = query;

    const filters = {};

    if (status) {
        filters.status = status;
    }
    if (source) {
        filters.source = source;
    }
    if (priority) {
        filters.priority = priority;
    }
    if (assignedTo) {
        filters['assignedTo.userId'] = assignedTo;
    }

    if (startDate || endDate) {
        filters.createdAt = {};
        if (startDate) filters.createdAt.$gte = new Date(startDate);
        if (endDate) filters.createdAt.$lte = new Date(endDate);
    }

    if (search) {
        filters.$or = [
            { name: { $regex: search, $options: 'i' } },
            { phone: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { serviceRequested: { $regex: search, $options: 'i' } }
        ];
    }

    const parsedPage = Math.max(1, parseInt(page, 10));
    const parsedLimit = Math.max(1, Math.min(100, parseInt(limit, 10)));
    const skip = (parsedPage - 1) * parsedLimit;
    const sort = { [sortBy]: order === 'asc' ? 1 : -1 };

    const [enquiries, total] = await Promise.all([
        enquiryRepo.findAll(filters, { skip, limit: parsedLimit, sort }),
        enquiryRepo.countDocuments(filters)
    ]);

    return {
        enquiries,
        pagination: {
            total,
            page: parsedPage,
            limit: parsedLimit,
            totalPages: Math.ceil(total / parsedLimit)
        }
    };
};

export const getEnquiryById = async (id) => {
    const enquiry = await enquiryRepo.findById(id);
    if (!enquiry) {
        throw new AppError('Enquiry not found', 404);
    }
    return enquiry;
};

export const updateEnquiry = async (id, updateData, userId, token) => {
    const existing = await enquiryRepo.findById(id);
    if (!existing) {
        throw new AppError('Enquiry not found', 404);
    }

    const { status } = updateData;

    if (status === 'Converted') {
        const patientsData = {
            full_name: existing.name,
            gender: existing.gender || 'Other',
            phone: Number(existing.phone) || undefined,
            email: existing.email || undefined,
            address: existing.address || undefined
        };

        const patientServiceUrl = process.env.PATIENT_SERVICE_URL || 'http://127.0.0.1:5001/api/patients';
        try {
            await axios.post(patientServiceUrl, patientsData, {
                headers: { authorization: `Bearer ${token}` }
            });
        } catch (patientErr) {
            console.warn('Patient creation during status conversion failed:', patientErr.message);
        }
    }

    const payload = {
        ...updateData,
        lastUpdatedBy: userId || 'system'
    };

    return await enquiryRepo.updateById(id, payload);
};

export const updateStatus = async (enquiryId, status, userId, token) => {
    const getExisting = await enquiryRepo.findById(enquiryId);
    if (!getExisting) {
        throw new AppError('Enquiry not found', 404);
    }

    const validStatuses = [
        'New',
        'Contacted',
        'Follow-up Needed',
        'Appointment Booked',
        'Converted',
        'Lost',
        'Closed'
    ];

    if (!validStatuses.includes(status)) {
        throw new AppError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`, 400);
    }

    if (status === 'Converted') {
        const patientsData = {
            full_name: getExisting.name,
            gender: getExisting.gender || 'Other',
            phone: Number(getExisting.phone) || undefined,
            email: getExisting.email || undefined,
            address: getExisting.address || undefined
        };

        const patientServiceUrl = process.env.PATIENT_SERVICE_URL || 'http://127.0.0.1:5001/api/patients';
        try {
            await axios.post(patientServiceUrl, patientsData, {
                headers: { authorization: `Bearer ${token}` }
            });
        } catch (patientErr) {
            console.warn('Patient creation during status conversion failed:', patientErr.message);
        }
    }

    const updated = await enquiryRepo.updateStatus(enquiryId, status, userId);
    if (!updated) {
        throw new AppError('Status could not be updated', 400);
    }
    return updated;
};

export const convertEnquiry = async (id, conversionData = {}, userId, token) => {
    const existing = await enquiryRepo.findById(id);
    if (!existing) {
        throw new AppError('Enquiry not found', 404);
    }

    const { convertedPatientId, convertedAppointmentId, createPatient = false } = conversionData;
    let finalPatientId = convertedPatientId || existing.convertedPatientId;

    if (createPatient && !finalPatientId && token) {
        try {
            const patientServiceUrl = process.env.PATIENT_SERVICE_URL || 'http://127.0.0.1:5001/api/patients';
            const response = await axios.post(patientServiceUrl, {
                full_name: existing.name,
                phone: Number(existing.phone) || undefined,
                email: existing.email,
                note: `Converted from lead: ${existing.serviceRequested || ''} - ${existing.message || ''}`
            }, {
                headers: { authorization: `Bearer ${token}` }
            });

            if (response.data?.data?._id || response.data?.data?.id) {
                finalPatientId = response.data.data._id || response.data.data.id;
            }
        } catch (err) {
            console.warn('Patient creation from lead returned an error:', err.message);
        }
    }

    const updatePayload = {
        status: 'Converted',
        convertedPatientId: finalPatientId,
        convertedAppointmentId: convertedAppointmentId || existing.convertedAppointmentId,
        lastUpdatedBy: userId || 'system'
    };

    return await enquiryRepo.updateById(id, updatePayload);
};

export const deleteEnquiry = async (id) => {
    const existing = await enquiryRepo.findById(id);
    if (!existing) {
        throw new AppError('Enquiry not found', 404);
    }
    return await enquiryRepo.deleteById(id);
};
