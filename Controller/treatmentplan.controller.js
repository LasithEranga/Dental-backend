import { validationResult } from "express-validator";
import ResponseMessages from "../config/messages.js";
import sql from "mssql";
import { ArrayValue, DateString, EntityId, StringValue, TableValueParameters } from "../utils/type-def.js";
import executeSp from "../utils/exeSp.js";
import handleResponse from "../utils/handleResponse.js";
import handleError from "../utils/handleError.js";

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
   * get medical certificate
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
            TreatmentData
        } = request.body;

        const TreatmentDataList = [];

        // Populate TreatmentDataList from request body
        TreatmentData.forEach((treatment) => {
            TreatmentDataList.push([
                treatment.StartDate,
                treatment.EndDate,
                treatment.TreatmentStatus,
                treatment.SelectedTeethPath,
                treatment.TeethUpSelectedPath,
                treatment.TeethSideSelectedPath,
                treatment.TeethImageFileName,
                treatment.DrawData,
                treatment.CDTCode,
                treatment.Info
            ]);
        });
 
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
            // ArrayValue({ fieldName: "TreatmentData" , value: TreatmentData}),
            TableValueParameters({
                tableName: "TreatmentData",
                columns: [
                    { columnName: "StartDate", type: sql.DateTime },
                    { columnName: "EndDate", type: sql.DateTime },
                    { columnName: "TreatmentStatus", type: sql.NVarChar(30) },
                    { columnName: "SelectedTeethPath", type: sql.NVarChar(sql.MAX) },
                    { columnName: "TeethUpSelectedPath", type: sql.NVarChar(sql.MAX) },
                    { columnName: "TeethSideSelectedPath", type: sql.NVarChar(sql.MAX) },
                    { columnName: "TeethImageFileName", type: sql.NVarChar(255) },
                    { columnName: "DrawData", type: sql.NVarChar(500) },
                    { columnName: "CDTCode", type: sql.NVarChar(10) },
                    { columnName: "Info", type: sql.NVarChar(200) }
                ],
                
                values: TreatmentDataList,
              }), 
        ];

        let treatmentPlanHistoryGetResult = await executeSp({
            spName: `TreatmentPlanSave`,
            params: params,
            connection,
        });

        treatmentPlanHistoryGetResult =
            treatmentPlanHistoryGetResult.recordsets[0];

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
};

export default TreatmentPlanController;
