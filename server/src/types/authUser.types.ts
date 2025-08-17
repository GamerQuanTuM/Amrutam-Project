export type AuthUser = {
  id: string;
  email: string;
  role: "ADMIN" | "USER" | "DOCTOR";
}
