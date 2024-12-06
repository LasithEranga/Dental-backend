import express from "express";
import TreatmentController from "../Controller/treatment.controller.js";
import { check } from "express-validator";

const router = express.Router();

router.post(
    "/GetAllTreatment",
    [
        check("mobile").isInt(),
        check("nic").isInt(),
        check("uniqueId").isString(),
    ],
    TreatmentController.getAllTreatment
)

router.post(
    "/GetAllTreatmentDummy",
    [
        check("UserId").isInt().not().isEmpty(),
    ],
    TreatmentController.getAllTreatmentDummy
)

router.post(
    "/GetTreatmentActivities",
    [
        check("UserId").isInt().not().isEmpty(),
        check("TreatmentPlanId").isInt().not().isEmpty(),
    ]
    ,
    TreatmentController.getTreatmentActivities
)


export default router;
