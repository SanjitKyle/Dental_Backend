import * as repository from '../repository/index.js';
import AppError from '../utils/AppError.js';

// Helper: Calculate line item totals, subtotal, taxAmount, and totalAmount
const calculateFinancials = (items = [], taxPercent = 0) => {
    let subtotal = 0;

    const computedItems = items.map((item) => {
        const qty = Math.max(1, Number(item.qty) || 1);
        const rate = Math.max(0, Number(item.rate) || 0);
        const discount = Math.min(100, Math.max(0, Number(item.discount) || 0));

        const itemTotal = qty * rate * (1 - discount / 100);
        subtotal += itemTotal;

        return {
            description: item.description,
            qty,
            rate,
            discount,
            amount: Math.round(itemTotal * 100) / 100
        };
    });

    subtotal = Math.round(subtotal * 100) / 100;
    const taxRate = Math.max(0, Number(taxPercent) || 0);
    const taxAmount = Math.round((subtotal * (taxRate / 100)) * 100) / 100;
    const totalAmount = Math.round((subtotal + taxAmount) * 100) / 100;

    return {
        items: computedItems,
        subtotal,
        taxPercent: taxRate,
        taxAmount,
        totalAmount
    };
};

export const createInvoice = async (data) => {
    if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
        throw new AppError('Invoice must contain at least one line item', 400);
    }

    const financials = calculateFinancials(data.items, data.taxPercent);

    const invoicePayload = {
        ...data,
        ...financials,
        status: data.status || 'Pending',
        paymentDate: data.status === 'Paid' ? (data.paymentDate || new Date()) : undefined
    };

    return await repository.createInvoice(invoicePayload);
};

export const getInvoices = async ({ query = {}, skip = 0, limit = 10 }) => {
    return await repository.getInvoices({ query, skip, limit });
};

export const getInvoiceById = async (id) => {
    const invoice = await repository.getInvoiceById(id);
    if (!invoice) {
        throw new AppError('Invoice not found with that ID', 404);
    }
    return invoice;
};

export const updateInvoice = async (id, data) => {
    const existing = await repository.getInvoiceById(id);
    if (!existing) {
        throw new AppError('Invoice not found with that ID', 404);
    }

    let updatedPayload = { ...data };

    // If items or taxPercent were modified, recalculate financials
    if (data.items || data.taxPercent !== undefined) {
        const itemsToUse = data.items || existing.items;
        const taxToUse = data.taxPercent !== undefined ? data.taxPercent : existing.taxPercent;
        const financials = calculateFinancials(itemsToUse, taxToUse);
        updatedPayload = { ...updatedPayload, ...financials };
    }

    // Status transition: If changing to Paid and no paymentDate set, auto-record current time
    if (data.status === 'Paid' && !data.paymentDate && !existing.paymentDate) {
        updatedPayload.paymentDate = new Date();
    }

    const updated = await repository.updateInvoice(id, updatedPayload);
    return updated;
};

export const deleteInvoice = async (id) => {
    const deleted = await repository.deleteInvoice(id);
    if (!deleted) {
        throw new AppError('Invoice not found with that ID', 404);
    }
    return deleted;
};