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
import { AppointmentResponse } from "@/types/appointment";
import formatDate from "@/functions/formatDate";
import specializations from "@/constants/specialization";
import CreatAppointment from "./createappointment";


const Appointments = ({
  recentAppointments,
}: { recentAppointments: AppointmentResponse[] }) => {

  return (
    <TabsContent value="history" className="space-y-4">
      <h2 className="text-xl font-semibold text-amber-900 mb-4">
        Appointment History
      </h2>
      {recentAppointments.map((appointment) => {
        return (
          <Card
            key={appointment.id}
            className="bg-white/80 backdrop-blur-sm border-amber-200"
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg text-amber-900">
                    {appointment.doctor.user.name}
                  </CardTitle>
                  <CardDescription className="text-amber-700">
                    {specializations.map((specialization) =>
                      specialization.value === appointment.doctor.specialization
                        ? specialization.label
                        : ""
                    )}
                  </CardDescription>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {appointment.status}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 text-sm text-amber-700 mb-3">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{formatDate(appointment.bookedAt).split(", ")[0]}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{formatDate(appointment.bookedAt).split(", ")[1]}</span>
                </div>
              </div>
              <div className="mt-4 flex space-x-2">
                <CreatAppointment appointmentId={appointment.id} status={appointment.status} doctor={appointment.doctor} />
              </div>
            </CardContent>
          </Card>
        )
      })}
    </TabsContent>
  );
};

export default Appointments;
