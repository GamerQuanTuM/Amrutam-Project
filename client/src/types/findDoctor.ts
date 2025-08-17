export type Specialization =
  | "SKIN_CARE"
  | "DIGESTIVE_ISSUES"
  | "RESPIRATORY_CARE"
  | "JOINT_PAIN"
  | "MENTAL_WELLNESS"
  | "GENERAL_CONSULTATION"
  | "WOMENS_HEALTH"
  | "PEDIATRIC_CARE";

export type Mode = "ONLINE" | "IN_PERSON";

interface User {
  id: string;
  name: string;
  email: string;
}

export interface Slot {
  id: string;
  doctorId: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  lockedBy: string | null;
  lockedAt: string | null;
  lockExpiry: string | null;
}

export interface Doctor {
  id: string;
  userId: string;
  specialization: Specialization;
  mode: Mode;
  bio: string;
  experience: number;
  consultationFee: string;
  createdAt: string;
  updatedAt: string;
  user: User;
  availability: Slot[];
}

export interface FindDoctorsApiResponse {
  message: string;
  data: {
    doctors: Doctor[];
    meta?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface SpecializationOption {
  value: Specialization | "ALL";
  label: string;
}

export interface ModeOption {
  value: Mode | "ALL";
  label: string;
}
