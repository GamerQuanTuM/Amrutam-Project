import { Router } from "express";
import { validateRequest } from "../utils/validateRequest";
import { authenticated } from "../middlewares/authenticated";
import AppointmentController from "../controllers/appointment.controller";
import { bookingRequest } from "../schemas/appointment/booking";
import { confirmRequest } from "../schemas/appointment/confirm";
import { makePaymentRequest } from "../schemas/appointment/makePayment";
import { cancelRequest } from "../schemas/appointment/cancel";
import { rescheduleRequest } from "../schemas/appointment/reschedule";
import { availableSlotsRequest } from "../schemas/appointment/availableSlots";

const router = Router();
const appointmentController = new AppointmentController();

router.post('/booking',
    authenticated,
    validateRequest({
        body: bookingRequest
    }),
    appointmentController.booking()
);


router.post('/confirm',
    authenticated,
    validateRequest({
        body: confirmRequest
    }),
    appointmentController.confirm()
);

router.put('/make-payment/:appointmentId',
    authenticated,
    validateRequest({
        params: makePaymentRequest
    }),
    appointmentController.makePayment()
);

router.put('/cancel/:appointmentId',
    authenticated,
    validateRequest({
        params: cancelRequest
    }),
    appointmentController.cancel()
);
router.put('/reschedule',
    authenticated,
    validateRequest({
        body: rescheduleRequest
    }),
    appointmentController.reschedule()
);

router.get("/user-bookings",
    authenticated,
    appointmentController.getBookingsOfUser()
)
router.get("/user-appointments",
    authenticated,
    appointmentController.getAppointmentsOfUser()
)

router.get("/available-slots",
    authenticated,
    validateRequest({
        query:availableSlotsRequest
    }),
    appointmentController.getAvailableSlots()
)





export default router;