import { validationResult } from "express-validator";
import ResponseMessages from "../config/messages.js";
import { ArrayValue, DateString, EntityId, StringValue } from "../utils/type-def.js";
import executeSp from "../utils/exeSp.js";
import handleResponse from "../utils/handleResponse.js";
import handleError from "../utils/handleError.js";

const TreatmentController = {

/**
     * Get  AllTreatment templates
     *
     * @param {Request} req - Express request object
     * @param {Response} res - Express response object
     * @param {NextFunction} next - Express next function
     * @returns {Promise<void>}
     */
    async getAllTreatment(request, response, next) {
        const { mobile, nic, uniqueId } = request.body;
        console.log("Request Body:", request.body);

        try {
            // Input validation
            if (!mobile && !nic && !uniqueId) {
                console.log("At least one search parameter (mobile, nic, or uniqueId) is required");
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

            const apiUrl = process.env.MEDICA_BASIC_URL;
            const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhYmMiLCJpYXQiOjE3MzA3OTMzMjUsImV4cCI6MTczMDc5NjkyNX0.aK1htixkHhcsgc-E8MWjSr1qNRPyvpBD_bj9faoy5f4"


            console.log("Request Body:", requestBody);

            const apiResponse = await axios.post(`${apiUrl}/TREATMNET`, requestBody, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            // Check if the API response contains data
            if (!apiResponse.data) {
                return response.status(404).json({
                    success: false,
                    message: "No Treatment define data found"
                });
            }

            return response.status(200).json({
                success: true,
                data: apiResponse.data
            });

        } catch (error) {
            console.error("Error in get all Treament:", error);

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
                        message: "Unable to reach treatment API",
                        error: "Service unavailable"
                    });
                }
            }
            next(error);
        }
    },


    /**
   *
   * get Treatment Activities
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next - middleware
   * @returns
   */
    async getTreatmentActivities(request, response, next) {
        console.log("getTreatmentActivities");
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
        return response.status(422).json({
            error: true,
            message: ResponseMessages.TreatmentPlan.VALIDATION_ERROR,
            data: errors,
        });
        }

        try {
        let connection = request.app.locals.db;
        const { UserId, TreatmentPlanId } = request.body;

        var params = [
            EntityId({ fieldName: "UserId", value: UserId }),
            EntityId({ fieldName: "TreatmentPlanId", value: TreatmentPlanId }),
        ];

        let treatmentPlanHistoryGetResult = await executeSp({
            spName: `TreatementGet`,
            params: params,
            connection,
        });

        treatmentPlanHistoryGetResult =
            treatmentPlanHistoryGetResult.recordsets[0];

        handleResponse(
            response,
            200,
            "success",
            "Data retrieved Successfully",
            treatmentPlanHistoryGetResult
        );
        } catch (error) {
        handleError(
            response,
            500,
            "error",
            error.message,
            "Something went wrong"
        );
        next(error);
        }
    },
};

export default TreatmentController;