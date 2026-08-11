import * as DoctorService from '../services/doctor.service.js';

// Create a new Doctor Profile
export const createDoctor = async (req, res) => {
    try {
        const doctorData = req.body;
        const newDoctor = await DoctorService.createDoctor(doctorData);
        res.status(201).json({ message: "Doctor profile created successfully", data: newDoctor });
    } catch (error) {
        console.error("Error creating doctor:", error);
        res.status(500).json({ message: "Failed to create doctor profile", error: error.message });
    }
};

// Get all Doctors (with optional filtering by specialization or status)
export const getAllDoctors = async (req, res) => {
    try {
        const query = req.query; // e.g. ?specialization=Orthodontist
        const doctors = await DoctorService.getAllDoctors(query);
        res.status(200).json({ data: doctors });
    } catch (error) {
        console.error("Error fetching doctors:", error);
        res.status(500).json({ message: "Failed to fetch doctors", error: error.message });
    }
};

// Get a specific Doctor Profile by ID (Internal DB _id)
export const getDoctorById = async (req, res) => {
    try {
        const doctor = await DoctorService.getDoctorById(req.params.id);
        if (!doctor) return res.status(404).json({ message: "Doctor not found" });
        res.status(200).json({ data: doctor });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch doctor", error: error.message });
    }
};

// Get Doctor Full Profile (Merging Doctor DB + Auth DB using Service-to-Service call)
export const getDoctorFullProfile = async (req, res) => {
    try {
        const fullProfile = await DoctorService.getDoctorFullProfile(req.params.userId);
        res.status(200).json({ data: fullProfile });
    } catch (error) {
        console.error("Error fetching full profile:", error);
        if (error.message === "Doctor professional profile not found") {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: "Failed to fetch full profile", error: error.message });
    }
};

// Update Doctor Profile
export const updateDoctor = async (req, res) => {
    try {
        const updatedDoctor = await DoctorService.updateDoctor(req.params.id, req.body);
        if (!updatedDoctor) return res.status(404).json({ message: "Doctor not found" });
        res.status(200).json({ message: "Doctor updated successfully", data: updatedDoctor });
    } catch (error) {
        res.status(500).json({ message: "Failed to update doctor", error: error.message });
    }
};

// Delete Doctor
export const deleteDoctor = async (req, res) => {
    try {
        const deletedDoctor = await DoctorService.deleteDoctor(req.params.id);
        if (!deletedDoctor) return res.status(404).json({ message: "Doctor not found" });
        res.status(200).json({ message: "Doctor deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete doctor", error: error.message });
    }
};
