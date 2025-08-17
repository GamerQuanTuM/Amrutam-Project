import AppointmentService from "../services/appointment.service";
import { AuthUser } from "../types/authUser.types";
import { AuthenticatedHandler } from "../types/validatedHandler.types";
import { InternalServerErrorException, UnauthorizedException } from "../utils/httpException";
import { BookingRequestType, BookingResponseType } from "../schemas/appointment/booking";
import { CancelRequestType, CancelResponseType } from "../schemas/appointment/cancel";
import { ConfirmRequestType, ConfirmResponseType } from "../schemas/appointment/confirm";
import { MakePaymentRequestType, MakePaymentResponseType } from "../schemas/appointment/makePayment";
import { RescheduleRequestType, RescheduleResponseType } from "../schemas/appointment/reschedule";
import { UserAppointmentsResponseType } from "../schemas/appointment/userAppointments";
import { AvailableSlotsRequestType, AvailableSlotsResponseType } from "../schemas/appointment/availableSlots";
import { UserBookingsResponseType } from "../schemas/appointment/userBookings";
import { UserAppointmentResponseType } from "../schemas/appointment/userAppointmentCount";

class AppointmentController {
    private appointmentService: AppointmentService
    constructor() {
        this.appointmentService = new AppointmentService()
    }

    private checkUserId(user: AuthUser | undefined) {
        if (!user) {
            throw new UnauthorizedException("Unauthorized")
        }

        return user.id
    }

    public booking(): AuthenticatedHandler<BookingRequestType, any, any, BookingResponseType> {
        return async (req, res) => {
            try {
                const { slotId } = req.body;
                const userId = this.checkUserId(req.user)
                const response = await this.appointmentService.booking(userId, slotId);
                res.status(201).json({
                    message: "Booking successful",
                    data: response,
                });
            } catch (error) {
                throw new InternalServerErrorException("Something went wrong")
            }

        }
    }

    public confirm(): AuthenticatedHandler<ConfirmRequestType, any, any, ConfirmResponseType> {
        return async (req, res) => {
            try {
                const { doctorId, slotId } = req.body;
                const userId = this.checkUserId(req.user)
                const response = await this.appointmentService.confirm(slotId, userId, doctorId);
                res.status(201).json({
                    message: "Appointment booked successfully",
                    data: response,
                });
            } catch (error) {
                throw new InternalServerErrorException("Something went wrong")
            }

        }
    }
    public makePayment(): AuthenticatedHandler<any, MakePaymentRequestType, any, MakePaymentResponseType> {
        return async (req, res) => {

            try {
                const { appointmentId } = req.params;
                const response = await this.appointmentService.confirmPayment(appointmentId);
                res.status(200).json({
                    message: "Appointment confirmed successfully",
                    data: response,
                });
            } catch (error) {
                throw new InternalServerErrorException("Something went wrong")
            }

        }
    }

    public cancel(): AuthenticatedHandler<any, CancelRequestType, any, CancelResponseType> {
        return async (req, res) => {
            try {
                const { appointmentId } = req.params;
                const userId = this.checkUserId(req.user)
                const response = await this.appointmentService.cancel(appointmentId, userId);
                res.status(200).json({
                    message: "Appointment cancelled successfully",
                    data: response,
                });
            } catch (error) {
                throw new InternalServerErrorException("Something went wrong")
            }

        }
    }

    public reschedule(): AuthenticatedHandler<RescheduleRequestType, any, any, RescheduleResponseType> {
        return async (req, res) => {

            try {
                const { appointmentId, newSlotId } = req.body;
                const userId = this.checkUserId(req.user)
                const response = await this.appointmentService.reschedule(appointmentId, userId, newSlotId);
                res.status(200).json({
                    message: "Appointment rescheduled successfully",
                    data: response,
                });
            } catch (error) {
                throw new InternalServerErrorException("Something went wrong")
            }

        }
    }

    public getBookingsOfUser(): AuthenticatedHandler<any, any, any, UserBookingsResponseType> {
        return async (req, res) => {
            try {
                const userId = this.checkUserId(req.user)
                const response = await this.appointmentService.getBookingsOfUser(userId);
                res.status(200).json({
                    message: "Bookings fetched successfully",
                    data: response,
                });
            } catch (error) {
                throw new InternalServerErrorException("Something went wrong")
            }

        }
    }

    public getAppointmentsOfUser(): AuthenticatedHandler<any, any, any, UserAppointmentsResponseType> {
        return async (req, res) => {
            try {
                const userId = this.checkUserId(req.user)
                const response = await this.appointmentService.getAppointmentsOfUser(userId);
                res.status(200).json({
                    message: "Appointments fetched successfully",
                    data: response,
                });
            } catch (error) {
                throw new InternalServerErrorException("Something went wrong")
            }

        }
    }

    public getAvailableSlots(): AuthenticatedHandler<any, any, AvailableSlotsRequestType, AvailableSlotsResponseType> {
        return async (req, res) => {
            try {
                const { limit, page } = req.query;
                const response = await this.appointmentService.getAvailableSlots(page, limit);
                res.status(200).json({
                    message: "Available slots fetched successfully",
                    data: response,
                });
            } catch (error) {
                throw new InternalServerErrorException("Something went wrong")
            }

        }
    }

    public getUserAppointmentCount(): AuthenticatedHandler<any, any, any,UserAppointmentResponseType> {
        return async (req, res) => {
            try {
                const userId = this.checkUserId(req.user)
                const response = await this.appointmentService.userAppointmentCount(userId);
                res.status(200).json({
                    message: "Appointments of user fetched successfully",
                    data: response,
                });
            } catch (err) {
                throw new InternalServerErrorException("Something went wrong")
            }
        }
    }

}

export default AppointmentController