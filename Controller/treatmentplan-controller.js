import { validationResult } from "express-validator";
import ResponseMessages from "../config/messages";
import { EntityId } from "../utils/type-def";
import executeSp from "../utils/exeSp";
import handleResponse from "../utils/handleResponse";
import handleError from "../utils/handleError";

const TreatmentPlanController = {
    /**
   *
   * get medical certificate
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
        const { UserId, PatentId } = request.body;

        var params = [
            EntityId({ fieldName: "UserId", value: UserId }),
            EntityId({ fieldName: "PatientId", value: PatentId }),
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
};

export default TreatmentPlanController;
