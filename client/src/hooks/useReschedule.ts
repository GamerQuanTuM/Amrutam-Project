import { Doctor } from "@/types/findDoctor";
import { create } from "zustand";

interface RescheduleState {
    isModalOpen: boolean;
    appointmentId: null | string;
    selectedDoctor: Doctor | null;
    openModal: (doctor: Doctor, appointmentId: null | string) => void;
    closeModal: () => void;
    setSelectedDoctor: (doctor: Doctor | null) => void;
}

export const useReschedule = create<RescheduleState>((set) => ({
    isModalOpen: false,
    selectedDoctor: null,
    appointmentId: null,
    openModal: (doctor, appointmentId) =>
        set({
            appointmentId,
            isModalOpen: true,
            selectedDoctor: doctor,
        }),

    closeModal: () =>
        set({
            appointmentId: null,
            isModalOpen: false,
            selectedDoctor: null,
        }),

    setSelectedDoctor: (doctor) => set({ selectedDoctor: doctor }),
}));
