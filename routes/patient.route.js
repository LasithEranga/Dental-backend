import express from "express";
import PatientController from "../Controller/patient.controller.js"; // Ensure the file extension is correct (.js)
import { check } from "express-validator";

const router = express.Router();

router.post(
  "/getPatients",
  [
    check("mobile").isInt(),
    check("nic").isInt(),
    check("uniqueId").isString(),
    check("token").isString(),
  ],
  PatientController.getPatient
);

export default router;
