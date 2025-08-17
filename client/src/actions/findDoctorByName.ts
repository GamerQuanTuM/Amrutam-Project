// actions/findDoctorByName.ts
"use server";

import { serverAxiosInstance } from "@/lib/serverAxiosInstance";

const findDoctorByName = async (name: string) => {
    try {
        const { data } = await serverAxiosInstance.get("/doctor/find/name", { params: { name } });
        return {
            message: data.message || "Doctors found successfully",
            data: {
                doctors: data.data || [],
                meta: {
                    page: 1,
                    limit: data.doctors?.length || data.data?.length || 0,
                    total: data.doctors?.length || data.data?.length || 1,
                    totalPages: 1
                }
            }
        };
    } catch (error) {
        console.log(error)
        throw new Error("Something went wrong");
    }
};

export default findDoctorByName;