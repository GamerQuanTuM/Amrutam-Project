import { Router } from "express";
import { validateRequest } from "../utils/validateRequest";
import { authenticated } from "../middlewares/authenticated";
import DoctorController from "../controllers/doctor.controller";
import { findDoctorsRequest } from "../schemas/doctor/findDoctors";
import { findDoctorsByNameRequest } from "../schemas/doctor/findDoctorsByName";

const router = Router();
const doctorController = new DoctorController();

router.get('/find',
    authenticated,
    validateRequest({
        query: findDoctorsRequest
    }),
    doctorController.findDoctors()
);

router.get('/find/name',
    authenticated,
    validateRequest({
        query: findDoctorsByNameRequest
    }),
    doctorController.findDoctorsByName()
);
export default router;