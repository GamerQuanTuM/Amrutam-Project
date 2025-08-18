"use client"
import React from "react";
import { toast } from "sonner";
import { axiosInstance } from "@/lib/axiosInstance";
import { useRouter } from "next/navigation";

type Props = {
  slotId: string,
  doctorId: string
}

const UpComingBookingButton = ({ slotId, doctorId }: Props) => {

  const router = useRouter()

  const onConfirmSlot = async () => {
    const response = await axiosInstance.post("/appointment/confirm", {
      slotId,
      doctorId
    })

    if (response.data.message) {
      toast.success(response.data.message)
      router.refresh()
    }
  }


  return (
    <button onClick={onConfirmSlot} className="button-class px-4 py-2 text-sm">Confirm Slot</button>
  );
};

export default UpComingBookingButton;
