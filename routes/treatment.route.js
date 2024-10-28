import express from "express";
import TreatmentPlanController from "../Controller/treatment.controller.js";
import { check } from "express-validator";

const router = express.Router();

router.post(
    "/GetTreatmentActivities",
    [
        check("UserId").isInt().not().isEmpty(),
        check("TreatmentPlanId").isInt().not().isEmpty(),
    ]
    ,
    TreatmentPlanController.getTreatmentActivities
)


export default router;
