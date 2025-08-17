"use server";

import { serverAxiosInstance } from "@/lib/serverAxiosInstance";
import { Mode, Specialization } from "@/types/findDoctor";

const findDoctors = async (specialization?: Specialization, mode?: Mode, page?: number, limit = 6) => {
  try {
    const params: Record<string, string> = {};

    if (specialization) params.specialization = specialization;
    if (mode) params.mode = mode;
    if (page) params.page = page.toString();
    if (limit) params.limit = limit.toString()

    const { data } = await serverAxiosInstance.get("/doctor/find", { params });

    return data;
  } catch (error) {
    console.log(error)
    throw new Error("Something went wrong");
  }
};

export default findDoctors;
