export type User = {
    id: string;
    email: string;
    name: string;
    role: "USER" | "DOCTOR" | "ADMIN";
    createdAt: string;
    updatedAt: string;
}