export interface BookingResponse {
    id:         string;
    doctorId:   string;
    startTime:  string;
    endTime:    string;
    isBooked:   boolean;
    lockedBy:   string;
    lockedAt:   string;
    lockExpiry: string;
    doctor:     Doctor;
}

interface Doctor {
    specialization: string;
    mode:           string;
    id:             string;
    user:           User;
}

interface User {
    id:    string;
    name:  string;
    email: string;
    role:  string;
}
