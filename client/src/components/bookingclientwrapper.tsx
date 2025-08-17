"use client"
import Appointments from "@/components/appointments";
import QuickActions from "@/components/quickactions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UpComingBookings from "@/components/upcomingbookings";
import { useReschedule } from "@/hooks/useReschedule";
import { AppointmentResponse } from "@/types/appointment";
import { BookingResponse } from "@/types/booking";
import { User } from "@/types/user";
import BookAppointmentModal from "./bookappointmentmodal";
import { axiosInstance } from "@/lib/axiosInstance";
import { toast } from "sonner";

type Props = {
    bookings: BookingResponse[];
    appointments: AppointmentResponse[];
    session: User | null;
    healthStats: {
        bookedAppointments: number;
        completedAppointments: number;
        cancelledAppointments: number;
        totalAppointments: number;
    }
}

function BookingClientWrapper({ bookings, appointments, session, healthStats }: Props) {

    const { isModalOpen, closeModal, selectedDoctor, appointmentId } = useReschedule();

    const cardContent = [
        {
            title: "Total Appointments",
            value: healthStats.totalAppointments,
            color: "text-amber-900",
        },
        {
            title: "Completed",
            value: healthStats.completedAppointments,
            color: "text-green-600",
        },
        {
            title: "Booked",
            value: healthStats.bookedAppointments,
            color: "text-blue-600",
        },
        {
            title: "Cancelled",
            value: healthStats.cancelledAppointments,
            color: "text-red-600",
        },
    ];

    const triggerContent = [
        {
            value: "upcoming",
            title: "Upcoming Bookings",
        },
        {
            value: "history",
            title: "Appointment History",
        },
        {
            value: "quick-actions",
            title: "Quick Actions",
        },
    ];

    const handleRescheduleModal = async (newSlotId: string) => {
        try {
            const { data } = await axiosInstance.put("/appointment/reschedule", {
                appointmentId,
                newSlotId
            })

            if (data) {
                closeModal()
                toast.success(data.message)
                window.location.reload()
            }
        } catch (error) {
            console.log(error)
            toast.error("Error rescheduling appointment.")
            closeModal()
        }

    }

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-4 md:p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-amber-900 mb-2">
                            Welcome back, {session?.name}!
                        </h1>
                        <p className="text-amber-700">
                            Manage your health appointments and track your wellness journey
                        </p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {cardContent.map((card, index) => (
                            <Card
                                key={index}
                                className="bg-white/80 backdrop-blur-sm border-amber-200"
                            >
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-medium text-amber-700">
                                        {card.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className={`text-2xl font-bold ${card.color}`}>
                                        {card.value}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Main Content */}
                    <Tabs defaultValue="upcoming" className="space-y-4">
                        <TabsList className="bg-white/80 backdrop-blur-sm border-amber-200">
                            {triggerContent.map((trigger) => (
                                <TabsTrigger
                                    key={trigger.value}
                                    value={trigger.value}
                                    className="data-[state=active]:bg-amber-500 data-[state=active]:text-white"
                                >
                                    {trigger.title}
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        <UpComingBookings upComingBookings={bookings} />

                        <Appointments recentAppointments={appointments} />

                        <QuickActions />
                    </Tabs>
                </div>
            </div>

            {selectedDoctor && (
                <BookAppointmentModal
                    doctor={selectedDoctor}
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    onBookSlot={handleRescheduleModal}
                />
            )}
        </>
    );
}

export default BookingClientWrapper;
