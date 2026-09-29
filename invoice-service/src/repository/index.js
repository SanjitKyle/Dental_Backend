import Invoice from '../model/index.js';

export const createInvoice = async (data) => {
    return await Invoice.create(data);
};

export const getInvoices = async ({ query = {}, skip = 0, limit = 10 }) => {
    const [invoices, total] = await Promise.all([
        Invoice.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        Invoice.countDocuments(query)
    ]);

    return { invoices, total };
};

export const getInvoiceById = async (id) => {
    return await Invoice.findById(id).lean();
};

export const updateInvoice = async (id, data) => {
    return await Invoice.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true
    }).lean();
};

export const deleteInvoice = async (id) => {
    return await Invoice.findByIdAndDelete(id).lean();
};