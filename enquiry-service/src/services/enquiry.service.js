import * as enquiryRepo from '../repository/enquiry.repository.js';
import axios from 'axios';

export const createEnquiry = async (data, userId) => {
    if (!data.name || !data.phone) {
        throw new Error('Name and phone number are required');
    }

    const payload = {
        ...data,
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
        throw new Error('Enquiry not found');
    }
    return enquiry;
};

export const updateEnquiry = async (id, updateData, userId,token) => {
    const existing = await enquiryRepo.findById(id);
    if (!existing) {
        throw new Error('Enquiry not found');
    }

    const {status}=updateData;
   
        if (status === 'Converted') {
            const patientsData = {
                full_name: existing.name,
                gender: existing.gender || 'Other',
                phone: Number(existing.phone) || undefined,
                email: existing.email || undefined,
                address: existing.address || undefined
            };

            const patientServiceUrl = process.env.PATIENT_SERVICE_URL || 'https://dentalbackend.kyleinfotech.co.in/api/patients';
            try {
                await axios.post(patientServiceUrl, patientsData, {
                    headers: {
                        authorization: `Bearer ${token}`
                    }
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
    try {
        const getExisting = await enquiryRepo.findById(enquiryId);
        if (!getExisting) {
            throw new Error('Enquiry not found');
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
            throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
        }

        if (status === 'Converted') {
            const patientsData = {
                full_name: getExisting.name,
                gender: getExisting.gender || 'Other',
                phone: Number(getExisting.phone) || undefined,
                email: getExisting.email || undefined,
                address: getExisting.address || undefined
            };

            const patientServiceUrl = process.env.PATIENT_SERVICE_URL || 'https://dentalbackend.kyleinfotech.co.in/api/patients';
            try {
                await axios.post(patientServiceUrl, patientsData, {
                    headers: {
                        authorization: `Bearer ${token}`
                    }
                });
            } catch (patientErr) {
                console.warn('Patient creation during status conversion failed:', patientErr.message);
            }
        }

        const updated = await enquiryRepo.updateStatus(enquiryId, status, userId);
        if (!updated) {
            throw new Error('Status could not be updated');
        }
        return updated;
    } catch (error) {
        throw error;
    }
};

export const convertEnquiry = async (id, conversionData = {}, userId, token) => {
    const existing = await enquiryRepo.findById(id);
    if (!existing) {
        throw new Error('Enquiry not found');
    }

    const { convertedPatientId, convertedAppointmentId, createPatient = false } = conversionData;
    let finalPatientId = convertedPatientId || existing.convertedPatientId;

    // Optional auto-creation in patient-service
    if (createPatient && !finalPatientId && token) {
        try {
            const patientServiceUrl = process.env.PATIENT_SERVICE_URL || 'https://patient-service-8t30.onrender.com';
            const response = await axios.post(`${patientServiceUrl}/api/patients`, {
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
        throw new Error('Enquiry not found');
    }
    return await enquiryRepo.deleteById(id);
};
