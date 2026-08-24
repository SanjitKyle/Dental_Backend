// repository entry point for appointment-service

import { appointMent } from "../models/index.js"

export const createAppointment=async(data)=>{
    try{
        const response=await appointMent.create(data);
        return response;

    }catch(error)
    {
        throw error;
    }
}

export const getAppointments = async (query = {}) => {
    try {
        const response = await appointMent.find(query);
        return response;
    } catch (error) {
        throw error;
    }
}

export const getAppointmentById = async (id) => {
    try {
        const response = await appointMent.findById(id);
        return response;
    } catch (error) {
        throw error;
    }
}

export const updateAppointment = async (id, data) => {
    try {
        const response = await appointMent.findByIdAndUpdate(
            id, 
            { $set: data }, 
            { new: true, runValidators: true }
        );
            return response;
    } catch (error) {
        throw error;
    }
}

export const deleteAppointment = async (id) => {
    try {
        const response = await appointMent.findByIdAndDelete(id);
        return response;
    } catch (error) {
        throw error;
    }
}