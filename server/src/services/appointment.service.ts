import { prisma } from "../config/prisma"
import { BadRequestException } from "../utils/httpException";
import { redisGet, redisSet } from "../utils/redisCache";

class AppointmentService {
    constructor() { }

    private async checkAppointment(appointmentId: string, userId: string, isReschedule: boolean = false) {
        const appointment = await prisma.appointment.findFirst({
            where: {
                id: appointmentId,
                patientId: userId
            }
        });

        if (!appointment) {
            throw new BadRequestException("You are not authorized to reschedule this appointment");
        }

        // Check 24-hour cancellation window from payment confirmation
        if (!appointment.confirmedAt) {
            throw new BadRequestException("Appointment has not been confirmed yet");
        }

        const cutoffTime = new Date(appointment.confirmedAt.getTime() + 24 * 60 * 60 * 1000);
        if (new Date() > cutoffTime) {
            throw new BadRequestException(`${isReschedule ? "Reschedule" : "Cancellation"} window (24 hours after payment confirmation) has expired`);
        }

        return appointment;
    }

    public async booking(
        userId: string,
        availabilityId: string,
    ) {
        const booking = await prisma.availability.update({
            where: { id: availabilityId },
            data: {
                isBooked: true,
                lockedBy: userId,
                lockedAt: new Date(Date.now()),
                lockExpiry: new Date(Date.now() + 5 * 60 * 1000)
            }
        })

        const transformedBooking = {
            ...booking,
            startTime: booking.startTime.toISOString(),
            endTime: booking.endTime.toISOString(),
            lockedAt: booking.lockedAt?.toISOString() ?? null,
            lockExpiry: booking.lockExpiry?.toISOString() ?? null
        }

        return transformedBooking
    }


    public async confirm(slotId: string, patientId: string, doctorId: string) {
        const [appointment] = await prisma.$transaction([
            prisma.appointment.create({
                data: {
                    patientId,
                    doctorId,
                    slotId,
                    status: "BOOKED",
                    originalSlotId: slotId,
                    rescheduleCount: 0,
                    confirmed: false,
                    bookedAt: new Date(Date.now()),
                    confirmedAt: null
                },

            }),
            prisma.availability.update({
                where: { id: slotId },
                data: {
                    isBooked: true,
                    lockedAt: null,
                    lockExpiry: null,
                    lockedBy: null
                }
            })
        ]);

        const transformedAppointment = {
            ...appointment,
            bookedAt: appointment.bookedAt.toISOString(),
            confirmedAt: appointment.confirmedAt?.toISOString() ?? null,
            createdAt: appointment.createdAt.toISOString(),
            updatedAt: appointment.updatedAt.toISOString(),
        }

        return transformedAppointment;
    }

    // Mocking payment
    public async confirmPayment(appointmentId: string) {
        const appointment = await prisma.appointment.update({
            where: {
                id: appointmentId
            },
            data: {
                confirmed: true,
                confirmedAt: new Date(Date.now()),
                status: "COMPLETED"
            }
        })

        const transformedAppointment = {
            ...appointment,
            createdAt: appointment.createdAt.toISOString(),
            updatedAt: appointment.updatedAt.toISOString(),
            bookedAt: appointment.bookedAt.toISOString(),
            confirmedAt: appointment.confirmedAt?.toISOString() ?? null,
        }



        return transformedAppointment;
    }


    public async cancel(appointmentId: string, userId: string) {
        const appointment = await this.checkAppointment(appointmentId, userId)

        if (appointment.confirmedAt && (appointment.confirmedAt < new Date(Date.now() - 24 * 60 * 60 * 100))) {
            throw new BadRequestException("This appointment was confirmed more than 24 hours ago and can no longer be cancelled.");
        }

        await prisma.$transaction([
            prisma.appointment.update({
                where: { id: appointmentId },
                data: {
                    status: "CANCELLED"
                }
            }),

            prisma.availability.update({
                where: { id: appointment.slotId },
                data: {
                    isBooked: false,
                    lockedAt: null,
                    lockExpiry: null,
                    lockedBy: null
                }
            })
        ])


        return "OK";
    }

    public async reschedule(appointmentId: string, userId: string, newSlotId: string) {
        const appointment = await this.checkAppointment(appointmentId, userId, true);

        if (appointment.rescheduleCount >= 3) {
            throw new BadRequestException("You have reached the maximum number of reschedules");
        }

        if (appointment.confirmedAt && (appointment.confirmedAt < new Date(Date.now() - 24 * 60 * 60 * 100))) {
            throw new BadRequestException("This appointment was confirmed more than 24 hours ago and can no longer be rescheduled.");
        }

        const newSlot = await prisma.availability.findUnique({
            where: { id: newSlotId },
        });

        if (!newSlot) {
            throw new BadRequestException("Slot not found");
        }

        if (newSlot.isBooked) {
            throw new BadRequestException("Slot is already booked");
        }

        const [x, y, updatedAppointment] = await prisma.$transaction([
            // free old slot
            prisma.availability.update({
                where: { id: appointment.slotId },
                data: {
                    isBooked: false,
                    lockedBy: null,
                    lockedAt: null,
                    lockExpiry: null,
                },
            }),

            // mark new slot as booked
            prisma.availability.update({
                where: { id: newSlotId },
                data: {
                    isBooked: true,
                    lockedBy: null,
                    lockedAt: null,
                    lockExpiry: null,
                },
            }),

            // update appointment
            prisma.appointment.update({
                where: { id: appointmentId },
                data: {
                    slotId: newSlotId,
                    bookedAt: newSlot.startTime,
                    rescheduleCount: { increment: 1 },
                },
            }),
        ]);


        const transformedAppointment = {
            ...updatedAppointment,
            createdAt: updatedAppointment.createdAt.toISOString(),
            updatedAt: updatedAppointment.updatedAt.toISOString(),
            bookedAt: updatedAppointment.bookedAt.toISOString(),
            confirmedAt: updatedAppointment.confirmedAt?.toISOString() ?? null,
        };

        return transformedAppointment;
    }


    public async getBookingsOfUser(userId: string) {
        const bookings = await prisma.availability.findMany({
            where: {
                isBooked: true,
                lockedBy: userId
            },
            orderBy: {
                startTime: "asc"
            },
            include: {
                doctor: {
                    select: {
                        specialization: true,
                        mode: true,
                        id: true,
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                role: true
                            },
                        },
                    },
                },
            }
        })

        const transformedBookings = bookings.map((booking) => ({
            ...booking,
            startTime: booking.startTime.toISOString(),
            endTime: booking.endTime.toISOString(),
            lockedAt: booking.lockedAt?.toISOString() ?? null,
            lockExpiry: booking.lockExpiry?.toISOString() ?? null
        }))

        const result = {
            bookings: transformedBookings,
        }

        return result;
    }

    public async getAppointmentsOfUser(userId: string) {
        const appointments = await prisma.appointment.findMany({
            where: {
                patientId: userId,
            },
            orderBy: {
                bookedAt: "desc",
            },
            include: {
                doctor: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                role: true
                            },
                        },
                        availability: true
                    },
                },
            }
        })

        const transformedAppointments = appointments.map((appointment) => ({
            ...appointment,
            bookedAt: appointment.bookedAt.toISOString(),
            confirmedAt: appointment.confirmedAt?.toISOString() ?? null,
            createdAt: appointment.createdAt.toISOString(),
            updatedAt: appointment.updatedAt.toISOString(),
            doctor: {
                ...appointment.doctor,
                availability: appointment.doctor.availability.map(availability => ({
                    ...availability,
                    startTime: availability.startTime.toISOString(),
                    endTime: availability.endTime.toISOString(),
                    lockedAt: availability.lockedAt?.toISOString() ?? null,
                    lockExpiry: availability.lockExpiry?.toISOString() ?? null
                }))
            }
        }));

        return {
            appointments: transformedAppointments,
        };
    }

    public async getAvailableSlots(page: string = "1", limit: string = "10") {

        const cacheKey = `availableSlots:${page}:${limit}`

        const cachedResult = await redisGet(cacheKey);
        if (cachedResult) {
            console.log('Cache hit for available slots query');
            return cachedResult;
        }
        const numPage = parseInt(page);
        const numLimit = parseInt(limit);
        const skip = (numPage - 1) * numLimit;

        const [slots, total] = await prisma.$transaction([
            prisma.availability.findMany({
                where: {
                    isBooked: false,
                    OR: [
                        { lockedBy: null },
                        { lockExpiry: { lt: new Date() } },
                    ],
                },
                skip: skip,
                take: numLimit,
                orderBy: {
                    startTime: "asc"

                }
            }),

            prisma.availability.count({
                where: {
                    isBooked: false,
                    OR: [
                        { lockedBy: null },
                        { lockExpiry: { lt: new Date() } },
                    ],
                },
            })
        ])

        const transformedSlots = slots.map(slot => ({
            ...slot,
            startTime: slot.startTime.toISOString(),
            endTime: slot.endTime.toISOString(),
            lockedAt: slot.lockedAt?.toISOString() ?? null,
            lockExpiry: slot.lockExpiry?.toISOString() ?? null,
        }))

        const result = {
            slots: transformedSlots,
            meta: {
                page: numPage,
                limit: numLimit,
                total: total,
                totalPages: Math.ceil(total / numLimit),
            }
        }

        await redisSet(cacheKey, result, 300);
        console.log('Cached Available Slots query result');
        return result
    }

    public async userAppointmentCount(userId: string) {
        const counts = await prisma.appointment.groupBy({
            by: ["status"],
            _count: { _all: true },
            where: { patientId: userId },
        });

        const bookedAppointments = counts.find(c => c.status === "BOOKED")?._count._all ?? 0;
        const completedAppointments = counts.find(c => c.status === "COMPLETED")?._count._all ?? 0;
        const cancelledAppointments = counts.find(c => c.status === "CANCELLED")?._count._all ?? 0;

        const totalAppointments = bookedAppointments + completedAppointments + cancelledAppointments;

        return {
            bookedAppointments,
            completedAppointments,
            cancelledAppointments,
            totalAppointments
        }
    }
}

export default AppointmentService;