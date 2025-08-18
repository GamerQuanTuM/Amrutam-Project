"use client"
import React from 'react'
import { toast } from 'sonner'
import { axiosInstance } from '@/lib/axiosInstance'
import { Doctor } from '@/types/findDoctor'
import { useReschedule } from '@/hooks/useReschedule'
import { useRouter } from 'next/navigation'

const CreateAppointment = ({ appointmentId, status, doctor }: { appointmentId: string, status: "BOOKED" | "COMPLETED" | "CANCELLED", doctor: Doctor }) => {

    const { openModal:openRescheduleModal} = useReschedule()

    const router = useRouter()


    const onCreateAppointment = async () => {
        try {
            const response = await axiosInstance.put(`/appointment/make-payment/${appointmentId}`)

            if (response.data.message) {
                toast.success(response.data.message)
                router.refresh()
            }
        } catch (error) {
            toast.error("Error creating appointment")
            console.log(error)
        }

    }


    const onCancelAppointment = async () => {
        try {
            const response = await axiosInstance.put(`/appointment/cancel/${appointmentId}`)

            if (response.data.message) {
                toast.success(response.data.message)
                router.refresh()
            }
        } catch (error) {
            toast.error("Something went wrong")
            console.log(error)
        }

    }

    return (
        <>
            {status === "BOOKED" ? <button onClick={onCreateAppointment} className="button-class px-4 py-2 text-sm">Pay to Confirm</button> : (status === "COMPLETED" ? <>
                <button onClick={() => {openRescheduleModal(doctor, appointmentId)}} className="button-class px-4 py-2 text-sm">Reschedule</button>
                <button onClick={onCancelAppointment} className="button-outline-class px-4 py-1.5 text-sm">Cancel</button>
            </> : <></>)}
        </>
    )
}

export default CreateAppointment