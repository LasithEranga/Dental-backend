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

export default router;
