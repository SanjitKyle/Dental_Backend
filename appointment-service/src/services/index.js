import * as repository from "../repository/index.js";
import AppError from "../utils/AppError.js";

export const createAppointment = async (data) => {
    return await repository.createAppointment(data);
};

export const getAppointments = async ({ query = {}, skip = 0, limit = 10 }) => {
    return await repository.getAppointments({ query, skip, limit });
};

export const getAppointmentById = async (id) => {
    const appointment = await repository.getAppointmentById(id);
    if (!appointment) {
        throw new AppError("Appointment not found", 404);
    }
    return appointment;
};

export const updateAppointment = async (id, data) => {
    const updated = await repository.updateAppointment(id, data);
    if (!updated) {
        throw new AppError("Appointment not found", 404);
    }
    return updated;
};

export const deleteAppointment = async (id) => {
    const deleted = await repository.deleteAppointment(id);
    if (!deleted) {
        throw new AppError("Appointment not found", 404);
    }
    return deleted;
};