import express from "express";
import TreatmentPlanController from "../Controller/treatmentplan.controller";
import { check } from "express-validator";

const router = express.Router();

router.post(
    "TreatmentPlanGet",
    [
        check("UserId").isInt().not().isEmpty(),
        check("PatientId").isInt().not().isEmpty(),
    ]
    ,
    TreatmentPlanController.getTreatmentPlanHistory
)