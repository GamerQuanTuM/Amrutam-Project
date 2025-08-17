import { getServerSession } from '@/actions/serverSession';
import BookingClientWrapper from '@/components/bookingclientwrapper'
import { serverAxiosInstance } from '@/lib/serverAxiosInstance';
import { AppointmentResponse } from '@/types/appointment';
import { BookingResponse } from '@/types/booking';
import React from 'react'

interface BookingApiResponse {
  data: {
    data: {
      bookings: BookingResponse[];
    };
  };
}
interface AppointmentApiResponse {
  data: {
    data: {
      appointments: AppointmentResponse[];
    };
  };
}

const Dashboard = async () => {
  const { data: { data: { bookings } } } = (await serverAxiosInstance.get(
    "/appointment/user-bookings"
  )) as BookingApiResponse;


  const { data: { data: { appointments } } } = (await serverAxiosInstance.get(
    "/appointment/user-appointments"
  )) as AppointmentApiResponse;


  const session = await getServerSession();

  return (
    <BookingClientWrapper bookings={bookings} appointments={appointments} session={session} />
  )
}

export default Dashboard