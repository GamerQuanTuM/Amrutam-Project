"use server";


import { serverAxiosInstance } from "@/lib/serverAxiosInstance";
import { User } from "@/types/user";
import { cookies } from "next/headers";

export async function getServerSession(appointments = false):Promise<User | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
        return null;
    }

    try {
        const user = await serverAxiosInstance.get(`/auth/current-user?appointments=${appointments}`);
        return user.data.data as User;
    } catch (error: any) {
        console.error("Error fetching user:", error?.response?.data || error.message);
        throw error;
    }
}