import findDoctors from "@/actions/findDoctors";
import FindDoctorsComponent from "@/components/findDoctors";
import { FindDoctorsApiResponse } from "@/types/findDoctor";
import React from "react";

export const dynamic = "force-dynamic";

const FindDoctors = async () => {
  const response = (await findDoctors()) as FindDoctorsApiResponse;
  return <FindDoctorsComponent initialResponse={response} />;
};

export default FindDoctors;
