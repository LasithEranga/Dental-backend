import { validationResult } from "express-validator";
import { EntityId, StringValue } from "../utils/type-def.js";
import executeSp from "../utils/exeSp.js";
import handleResponse from "../utils/handleResponse.js";
import handleError from "../utils/handleError.js";


const TeethController = {

    /**
   *
   * get medical certificate
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
        
        const { 
            Id, 
            TeethNumber,
            TeethName,
            UserType,
            Category,
            UniqueId,
            Info, 
        } = request.body;

        const params = [
            EntityId({ fieldName: "Id", value: Id }),
            StringValue({ fieldName: "TeethNumber" , value: TeethNumber}),
            StringValue({ fieldName: "TeethName" , value: TeethName}),
            StringValue({ fieldName: "UserType" , value: UserType}),
            StringValue({ fieldName: "Category" , value: Category}),
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
        console.log("after",teethGetResult);

        handleResponse(
            response,
            200,
            "success",
            "Teeth Data save Successfully",
            teethGetResult
        );


        }catch(error){
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
        
        const { 
            PatientId 
        } = request.body;

        const params = [
            EntityId({ fieldName: "PatientId", value: PatientId })
        ]; 

        let missingTeethGetResult = await executeSp({
            spName: `MissingTeethGet`,
            params: params,
            connection,
        });

        console.log(missingTeethGetResult);
        
        missingTeethGetResult = missingTeethGetResult.recordsets[0];
        console.log("after",missingTeethGetResult);

        handleResponse(
            response,
            200,
            "success",
            "Teeth Data save Successfully",
            missingTeethGetResult
        );


        }catch(error){
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
}

export default TeethController;