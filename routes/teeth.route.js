import express from "express";
import TeethController from "../Controller/teeth.controller.js";
import { check } from "express-validator";

const router = express.Router();

router.post(
    "/saveTeeth"
    ,
    [
        check("Id").isInt().not().isEmpty(),
        check("TeethNumber").isString().not().isEmpty(),
        check("TeethName").isString().not().isEmpty(),
        check("UserType").isString().not().isEmpty(),
        check("Category").isString().not().isEmpty(),
        check("UniqueId").isInt().not().isEmpty(),
        check("Info").isString().not().isEmpty(),
    ]
    ,
    TeethController.saveTeeth
); 


router.post(
    "/getMissingTeeth"
    ,
    [
        check("PatientId").isInt().not().isEmpty() 
    ]
    ,
    TeethController.getMissingTeeth
); 


router.post(
    "/getAllTreatmentTeeth"
    ,
    [
        check("UserId").isInt().not().isEmpty(),
        check("PatientId").isInt().not().isEmpty(), 
    ]
    ,
    TeethController.getAllTreatmentTeeth
); 



export default router;