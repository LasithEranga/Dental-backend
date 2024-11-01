import executeSp from "../utils/exeSp.js";
import { validationResult } from "express-validator";
import ResponseMessages from "../config/messages.js";
import axios from 'axios';

const PatientController = {
    /**
     * Get patient by type and id
     *
     * @param {Request} req - Express request object
     * @param {Response} res - Express response object
     * @param {NextFunction} next - Express next function
     * @returns {Promise<void>}
     */
    async getPatient(request, response, next) {
        const { mobile, nic, uniqueId } = request.body;

        try {
            // Input validation
            if (!mobile && !nic && !uniqueId) {
                return response.status(400).json({
                    success: false,
                    message: "At least one search parameter (mobile, nic, or uniqueId) is required"
                });
            }

            const requestBody = {
                Mobile: mobile,
                NIC: nic,
                UniqueId: uniqueId,
            };

            const apiUrl = process.env.PATIENT_URL;
            const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhYmMiLCJpYXQiOjE3MzA0NDkyNjYsImV4cCI6MTczMDQ1Mjg2Nn0.zo2FwOxcpiQ9rHsa_o20J7odiYhEjjQof38GppDj7a4";

            console.log("Request Body:", requestBody);

            const apiResponse = await axios.post(apiUrl, requestBody, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            // Check if the API response contains data
            if (!apiResponse.data) {
                return response.status(404).json({
                    success: false,
                    message: "No patient data found"
                });
            }

            return response.status(200).json({
                success: true,
                data: apiResponse.data
            });

        } catch (error) {
            console.error("Error in getPatient:", error);

            // Handle specific axios errors
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    return response.status(error.response.status).json({
                        success: false,
                        message: error.response.data?.message || "Error from patient API",
                        error: error.response.data
                    });
                } else if (error.request) {
                    // The request was made but no response was received
                    return response.status(503).json({
                        success: false,
                        message: "Unable to reach patient API",
                        error: "Service unavailable"
                    });
                }
            }
            next(error);
        }
    },
};

export default PatientController;
    
  