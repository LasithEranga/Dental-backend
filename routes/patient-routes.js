import express from 'express';
import {getPatient} from '../Controller/patient-controller.js'// Ensure the file extension is correct (.js)

const router = express.Router();

router.post("/getPatients", getPatient);

export default router;
