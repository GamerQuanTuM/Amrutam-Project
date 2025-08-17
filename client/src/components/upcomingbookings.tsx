import React from "react";
import { TabsContent } from "./ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Calendar, Clock } from "lucide-react";
import { BookingResponse } from "@/types/booking";
import formatDate from "@/functions/formatDate";
import specializations from "@/constants/specialization";
import UpComingBookingButton from "./upcomingbookingbutton";

const UpComingBookings = ({
  upComingBookings,
}: {
  upComingBookings: BookingResponse[];
}) => {
  return (
    <TabsContent value="upcoming" className="space-y-4">
      <h2 className="text-xl font-semibold text-amber-900 mb-4">
        Your Upcoming bookings
      </h2>
      {upComingBookings.map((booking) => {
        const start = formatDate(booking.startTime);
        const end = formatDate(booking.endTime);
        return (
          <Card
            key={booking.id}
            className="bg-white/80 backdrop-blur-sm border-amber-200"
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg text-amber-900">
                    {booking.doctor.user.name}
                  </CardTitle>
                  <CardDescription className="text-amber-700">
                    {specializations.map((specialization) =>
                      specialization.value === booking.doctor.specialization
                        ? specialization.label
                        : ""
                    )}
                  </CardDescription>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    booking.doctor.mode === "ONLINE"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {booking.doctor.mode}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 text-sm text-amber-700">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{start.split(", ")[0]}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  {start.split(", ")[1]} - {end.split(", ")[1]}
                </div>
              </div>
              <div className="mt-4 flex space-x-2">
                <UpComingBookingButton slotId={booking.id} doctorId={booking.doctorId}/>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </TabsContent>
  );
};

export default UpComingBookings;
