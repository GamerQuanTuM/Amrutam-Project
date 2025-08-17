import { FindDoctorsRequestType, FindDoctorsResponseType } from "../schemas/doctor/findDoctors";
import { FindDoctorsByNameRequestType, FindDoctorsByNameResponseType } from "../schemas/doctor/findDoctorsByName";
import DoctorService from "../services/doctor.service";
import { AuthenticatedHandler } from "../types/validatedHandler.types";
import { InternalServerErrorException } from "../utils/httpException";

class DoctorController {
    private doctorService: DoctorService;

    constructor() {
        this.doctorService = new DoctorService();
    }

    public findDoctors(): AuthenticatedHandler<
        any,
        any,
        FindDoctorsRequestType,
        FindDoctorsResponseType
    > {
        return async (req, res) => {
            const { mode, specialization, page, limit } = req.query;
            const filters = { specialization, mode };
            try {
                const response = await this.doctorService.findDoctors(filters, page, limit);
                res.status(200).json({
                    message: "Doctors found successfully",
                    data: response,
                });
            } catch (error) {
                throw new InternalServerErrorException("Something went wrong")
            }

        };
    }


    public findDoctorsByName(): AuthenticatedHandler<
        any,
        any,
        FindDoctorsByNameRequestType,
        FindDoctorsByNameResponseType
    > {
        return async (req, res) => {
            const { name } = req.query;
            try {
                const response = await this.doctorService.findDoctorsByName(name);
                res.status(200).json({
                    message: "Doctors found successfully",
                    data: response,
                });
            } catch (error) {
                throw new InternalServerErrorException("Something went wrong")
            }

        };
    }
}

export default DoctorController;
