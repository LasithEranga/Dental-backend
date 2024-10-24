import express from 'express';
import { getPatientDetails } from '../Services/patient-services.js'; 


// Method to get patients by serviceFeeTypeId
export const getPatient = async (req, res) => {
    console.log(req.body);
    try {
        const {  mobile, nic,uniqueId } = req.body;
        console.log('mobile:', mobile);
        console.log('nic:', nic);
        console.log('uniqueId:', uniqueId);
        
        
        // Call the service function to fetch patient details
        const patientDetails = await getPatientDetails( mobile, nic, uniqueId);
        
        // Send the response back to the client
        return res.status(200).json(patientDetails);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching patient details', error: error.message });
    }
};
