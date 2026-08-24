// services entry point for appointment-service
import * as repository from "../repository/index.js"
export const createAppointment=async(data)=>{
    try{
        const response=await repository.createAppointment(data);
        return response;

    }catch(error)
    {
        throw error;
    }
}

export const getAppointments = async (query = {}) => {
    try {
        const response = await repository.getAppointments(query);
        return response;
    } catch (error) {
        throw error;
    }
}

export const getAppointmentById = async (id) => {
    try {
        const response = await repository.getAppointmentById(id);
        return response;
    } catch (error) {
        throw error;
    }
}

export const updateAppointment = async (id, data) => {
    try {
        const response = await repository.updateAppointment(id, data);
        return response;
    } catch (error) {
        throw error;
    }
}

export const deleteAppointment = async (id) => {
    try {
        const response = await repository.deleteAppointment(id);
        return response;
    } catch (error) {
        throw error;
    }
}