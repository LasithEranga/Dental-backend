import { validationResult } from "express-validator";
import ResponseMessages from "../config/messages.js";
import { ArrayValue, DateString, EntityId, NormalArrayValue, StringValue } from "../utils/type-def.js";
import executeSp from "../utils/exeSp.js";
import handleResponse from "../utils/handleResponse.js";
import handleError from "../utils/handleError.js";

const TreatmentPlanController = {


    /**
     * Get  AllTreatmentPlan templates
     *
     * @param {Request} req - Express request object
     * @param {Response} res - Express response object
     * @param {NextFunction} next - Express next function
     * @returns {Promise<void>}
     */
    async getAllTreatmentPlan(request, response, next) {
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
                    message: "No treatment plan data found"
                });
            }

            return response.status(200).json({
                success: true,
                data: apiResponse.data
            });

        } catch (error) {
            console.error("Error in get TreamentPlan Template:", error);

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
                        message: "Unable to reach treatmentPlan API",
                        error: "Service unavailable"
                    });
                }
            }
            next(error);
        }
    },


    /**
   *
   * get TreatmentPlan History
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next - middleware
   * @returns
   */
    async getTreatmentPlanHistory(request, response, next) {
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
        const { UserId, PatientId } = request.body;

        var params = [
            EntityId({ fieldName: "UserId", value: UserId }),
            EntityId({ fieldName: "PatientId", value: PatientId }),
        ];

        let treatmentPlanHistoryGetResult = await executeSp({
            spName: `TreatmentPlanHistoryGet`,
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


    /**
   *
   * save TreatmentPlan
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next - middleware
   * @returns
   */
    async saveTreatmentPlan(request, response, next) {
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
        
        const { 
            Id,
            TeethId, 
            TreatmentPlanName, 
            Reason,
            StartDate,
            EstimatedDate,
            Status, 
            PatientId,
            DoctorId, 
            InstituteBranchId,
            InstituteId,
            UniqueId,
            Info,
            UserModified,
            TreatmentData,
            SelectedTeethPath,
            TeethUpSelectedPath,
            TeethSideSelectedPath,
            TeethImageFileName,
            DrawData
    } = request.body;
        console.log('TreatmentData:', TreatmentData);

        var params = [
            EntityId({ fieldName: "Id", value: Id }),
            EntityId({ fieldName: "TeethId", value: TeethId }),
            StringValue({ fieldName: "TreatmentPlanName", value: TreatmentPlanName }),
            StringValue({ fieldName: "Reason", value: Reason }),
            DateString({ fieldName: "StartDate", value: StartDate }),
            DateString({ fieldName: "EstimatedDate", value: EstimatedDate }),
            StringValue({ fieldName: "Status", value: Status }),
            EntityId({ fieldName: "PatientId", value: PatientId }),
            EntityId({ fieldName: "DoctorId", value: DoctorId }),
            EntityId({ fieldName: "InstituteBranchId", value: InstituteBranchId }),
            EntityId({ fieldName: "InstituteId", value: InstituteId }),
            EntityId({ fieldName: "UniqueId", value: UniqueId }),
            EntityId({ fieldName: "UserModified", value: UserModified }),
            StringValue({ fieldName: "Info", value: Info }),
            ArrayValue({ fieldName: "TreatmentData" , value: TreatmentData}),
            StringValue({ fieldName: "SelectedTeethPath", value: SelectedTeethPath }),
            StringValue({ fieldName: "TeethUpSelectedPath", value: TeethUpSelectedPath || '' }),
            StringValue({ fieldName: "TeethSideSelectedPath", value: TeethSideSelectedPath || '' }),
            StringValue({ fieldName: "TeethImageFileName", value: TeethImageFileName || '' }),
            NormalArrayValue({ fieldName: "DrawData", value: DrawData }),
        ];
        console.log('All Validations Passed');
        console.log('Params:', params);
        console.log('treatmentPlanHistoryGetResult:');

        let treatmentPlanHistoryGetResult = await executeSp({
            spName: `TreatmentPlanSave`,
            params: params,
            connection,
        });

        treatmentPlanHistoryGetResult =
        treatmentPlanHistoryGetResult.recordsets[0];
        console.log('treatmentPlanHistoryGetResult:', treatmentPlanHistoryGetResult);

        handleResponse(
            response,
            200,
            "success",
            "Data save Successfully",
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


    /**
   *
   * get Teeth TreatmentPlan History
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next - middleware
   * @returns
   */
    async getTeethTreatmentPlanHistory(request, response, next) {
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
        const { UserId, PatientId,TeethId } = request.body;

        var params = [
            EntityId({ fieldName: "UserId", value: UserId }),
            EntityId({ fieldName: "PatientId", value: PatientId }),
            EntityId({ fieldName: "TeethId", value: TeethId }),
        ];

        let teethTreatmentPlanHistoryGetResult = await executeSp({
            spName: `TeethTreatmentPlanGet`,
            params: params,
            connection,
        });

        teethTreatmentPlanHistoryGetResult =
            teethTreatmentPlanHistoryGetResult.recordsets[0];

        handleResponse(
            response,
            200,
            "success",
            "Data retrieved Successfully",
            teethTreatmentPlanHistoryGetResult
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


    /**
   *
   * get all treatment plans details
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next - middleware
   * @returns
   */
    async getAllTreatmentPlansDetails(request, response, next) {
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
        const { PatientId,Status } = request.body;

        var params = [
            EntityId({ fieldName: "PatientId", value: PatientId }),
            EntityId({ fieldName: "Status", value: Status }),
        ];

        let teethTreatmentPlanHistoryGetResult = await executeSp({
            spName: ` `,
            params: params,
            connection,
        });

        teethTreatmentPlanHistoryGetResult =
            teethTreatmentPlanHistoryGetResult.recordsets[0];

        handleResponse(
            response,
            200,
            "success",
            "Data retrieved Successfully",
            teethTreatmentPlanHistoryGetResult
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

     /**
   *
   * get all treatment plans details
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next - middleware
   * @returns
   */
  
     async getGenericTreatmentPlan(request, response, next) {
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
            const { UserId } = request.body;
    
            var params = [
                EntityId({ fieldName: "UserId", value: UserId }),
            ];
    
            let treatmentPlansResult = await executeSp({
                spName: `GetAllTreatmentPlansWithActivities`,
                params: params,
                connection,
            });
    
            // Process the result
            let treatmentPlans = treatmentPlansResult.recordsets[0];
    
            // Parse Activities from JSON string to object
            treatmentPlans = treatmentPlans.map((plan) => ({
                ...plan,
                Activities: plan.Activities ? JSON.parse(plan.Activities) : [], // Parse or set empty array if null
            }));
    
            handleResponse(
                response,
                200,
                "success",
                "Data retrieved Successfully",
                treatmentPlans
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
    }
        
};

export default TreatmentPlanController;