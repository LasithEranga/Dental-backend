import { validationResult } from "express-validator";
import { EntityId, StringValue } from "../utils/type-def.js";
import executeSp from "../utils/exeSp.js";
import handleResponse from "../utils/handleResponse.js";
import handleError from "../utils/handleError.js";

const TeethController = {
    /**
     *
     *
     * @param {request} request object
     * @param {response} response object
     * @param {next} next - middleware
     * @returns
     */
    async saveTeeth(request, response, next) {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
        return response.status(422).json({
            error: true,
            message: ResponseMessages.Teeth.VALIDATION_ERROR,
            data: errors,
        });
        }

        try {
        let connection = request.app.locals.db;

        const { Id, TeethNumber, TeethName, UserType, Category, UniqueId, Info } =
            request.body;

        const params = [
            EntityId({ fieldName: "Id", value: Id }),
            StringValue({ fieldName: "TeethNumber", value: TeethNumber }),
            StringValue({ fieldName: "TeethName", value: TeethName }),
            StringValue({ fieldName: "UserType", value: UserType }),
            StringValue({ fieldName: "Category", value: Category }),
            EntityId({ fieldName: "UniqueId", value: UniqueId }),
            StringValue({ fieldName: "Info", value: Info }),
        ];

        let teethGetResult = await executeSp({
            spName: `TeethSave`,
            params: params,
            connection,
        });

        console.log(teethGetResult);

        teethGetResult = teethGetResult.recordsets[0];
        console.log("after", teethGetResult);

        handleResponse(
            response,
            200,
            "success",
            "Teeth Data save Successfully",
            teethGetResult
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
     *
     * @param {request} request object
     * @param {response} response object
     * @param {next} next - middleware
     * @returns
     */
    async getMissingTeeth(request, response, next) {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
        return response.status(422).json({
            error: true,
            message: ResponseMessages.Teeth.VALIDATION_ERROR,
            data: errors,
        });
        }

        try {
        let connection = request.app.locals.db;

        const { PatientId } = request.body;

        const params = [EntityId({ fieldName: "PatientId", value: PatientId })];

        let missingTeethGetResult = await executeSp({
            spName: `MissingTeethGet`,
            params: params,
            connection,
        });

        console.log(missingTeethGetResult);

        missingTeethGetResult = missingTeethGetResult.recordsets[0];
        console.log("after", missingTeethGetResult);

        handleResponse(
            response,
            200,
            "success",
            "MissingTeeth Data retrieve Successfully",
            missingTeethGetResult
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
     *
        @param {request} request object
        * @param {response} response object
        * @param {next} next - middleware
        * @returns
        */
    async getAllTreatmentTeeth(request, response, next) {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
        return response.status(422).json({
            error: true,
            message: ResponseMessages.Teeth.VALIDATION_ERROR,
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

        let missingTeethGetResult = await executeSp({
            spName: `TeethTreatmentGet`,
            params: params,
            connection,
        });

        console.log(missingTeethGetResult);

        missingTeethGetResult = missingTeethGetResult.recordsets[0];
        console.log("after", missingTeethGetResult);

        handleResponse(
            response,
            200,
            "success",
            "Teeth Data retrieve Successfully",
            missingTeethGetResult
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
   * get last tooth Treatment Details
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next - middleware
   * @returns
   */
    async getlastTreatmentTeethData(request, response, next) {
        console.log("GetlastTreatmentTeethData");
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
            spName: `GetlastTreatmentToothData`,
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
     *
     * @param {request} request object
     * @param {response} response object
     * @param {next} next - middleware
     * @returns
     */
        async getAllTreatmentplanCompleteTooth(request, response, next) {
            const errors = validationResult(request);
            if (!errors.isEmpty()) {
            return response.status(422).json({
                error: true,
                message: ResponseMessages.Teeth.VALIDATION_ERROR,
                data: errors,
            });
            }
    
            try {
            let connection = request.app.locals.db;
    
            const { PatientId } = request.body;
    
            const params = [EntityId({ fieldName: "PatientId", value: PatientId })];
    
            let missingTeethGetResult = await executeSp({
                spName: `AllTreatmentPlanCompletedToothGet`,
                params: params,
                connection,
            });
    
            console.log(missingTeethGetResult);
    
            missingTeethGetResult = missingTeethGetResult.recordsets[0];
            console.log("after", missingTeethGetResult);
    
            handleResponse(
                response,
                200,
                "success",
                "Treatmentplan Complete Tooth Data retrieve Successfully",
                missingTeethGetResult
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



export default TeethController;
