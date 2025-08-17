import { Doctor } from "./findDoctor";

export interface AppointmentResponse {
    id: string;
    patientId: string;
    doctorId: string;
    slotId: string;
    status: "COMPLETED" | "CANCELLED" | "BOOKED"
    confirmed: boolean;
    bookedAt: string;
    confirmedAt: string | null;
    originalSlotId: string;
    rescheduleCount: number;
    createdAt: string;
    upstringdAt: string;
    doctor: Doctor;
}

