import express from "express";
import TreatmentPlanController from "../Controller/treatmentplan.controller.js";
import { check } from "express-validator";

const router = express.Router();

router.post(
    "/GetTreatmentPlanHistory",
    [
        check("UserId").isInt().not().isEmpty(),
        check("PatientId").isInt().not().isEmpty(),
    ]
    ,
    TreatmentPlanController.getTreatmentPlanHistory
)


router.post(
    "/TreatmentPlanSave",
    [
        check("Id").isInt().not().isEmpty(),
        check("TeethId").isInt().not().isEmpty(),
        check("TreatmentPlanName").isString().not().isEmpty(),
        check("Reason").isString().not().isEmpty(),
        check("StartDate").isDate().not().isEmpty(),
        check("EstimatedDate").isDate().not().isEmpty(),
        check("Status").isString().not().isEmpty(),
        check("PatientId").isInt().not().isEmpty(),
        check("DoctorId").isInt().not().isEmpty(),
        check("InstituteBranchId").isInt().not().isEmpty(),
        check("InstituteId").isInt().not().isEmpty(),
        check("UniqueId").isInt().not().isEmpty(),
        check("UserModified").isInt().not().isEmpty(),
        check("Info").isString().not().isEmpty(),
    ]
    ,
    TreatmentPlanController.saveTreatmentPlan
)

export default router;
