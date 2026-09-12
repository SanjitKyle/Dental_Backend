import Enquiry from '../models/enquiry.model.js';

export const create = async (enquiryData) => {
    const enquiry = new Enquiry(enquiryData);
    return await enquiry.save();
};

export const findById = async (id) => {
    return await Enquiry.findById(id);
};

export const findAll = async (filters = {}, options = {}) => {
    const { skip = 0, limit = 50, sort = { createdAt: -1 } } = options;
    return await Enquiry.find(filters).sort(sort).skip(skip).limit(limit);
};

export const countDocuments = async (filters = {}) => {
    return await Enquiry.countDocuments(filters);
};

export const updateById = async (id, updateData) => {
    return await Enquiry.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
    );
};

export const addFollowUp = async (id, followUpData, newStatus, userId) => {
    const update = {
        $push: { followUps: followUpData },
        $set: {
            lastUpdatedBy: userId || 'system',
            updatedAt: new Date()
        }
    };

    if (newStatus) {
        update.$set.status = newStatus;
    }

    return await Enquiry.findByIdAndUpdate(id, update, { new: true });
};

export const updateStatus = async (id, status, userId) => {
    const updateData = {
        status,
        lastUpdatedBy: userId || 'system'
    };



    return await Enquiry.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
    );
};



export const deleteById = async (id) => {
    return await Enquiry.findByIdAndDelete(id);
};
