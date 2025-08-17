import { useState } from "react";
import { Doctor, Slot } from "@/types/findDoctor";
import {
  X,
  Calendar,
  Clock,
  DollarSign,
  User,
  Video,
  Building,
  CheckCircle,
} from "lucide-react";
import formatDate from "@/functions/formatDate";

interface BookAppointmentModalProps {
  doctor: Doctor;
  isOpen: boolean;
  onClose: () => void;
  onBookSlot: (slotId: string) => void;
}

export default function BookAppointmentModal({
  doctor,
  isOpen,
  onClose,
  onBookSlot,
}: BookAppointmentModalProps) {

  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isBooking, setIsBooking] = useState(false);

  if (!isOpen) return null;

  const getSpecializationLabel = (specialization: string): string => {
    const specializations: Record<string, string> = {
      SKIN_CARE: "Skin Care",
      DIGESTIVE_ISSUES: "Digestive Issues",
      RESPIRATORY_CARE: "Respiratory Care",
      JOINT_PAIN: "Joint Pain",
      MENTAL_WELLNESS: "Mental Wellness",
      GENERAL_CONSULTATION: "General Consultation",
      WOMENS_HEALTH: "Women's Health",
      PEDIATRIC_CARE: "Pediatric Care",
    };
    return specializations[specialization] || specialization;
  };


  // Group slots by date
  const groupSlotsByDate = (slots: Slot[]) => {
    const grouped: Record<string, Slot[]> = {};

    slots
      .filter((slot) => !slot.isBooked)
      .sort(
        (a, b) =>
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      )
      .forEach((slot) => {
        const dateKey = new Date(slot.startTime).toDateString();
        if (!grouped[dateKey]) {
          grouped[dateKey] = [];
        }
        grouped[dateKey].push(slot);
      });

    return grouped;
  };

  const availableSlots = doctor.availability || [];
  const groupedSlots = groupSlotsByDate(availableSlots);

  const handleBookSlot = async (slotId: string) => {
    setIsBooking(true);
    try {
      await onBookSlot(slotId);
      onClose();
    } catch (error) {
      console.error("Error booking slot:", error);
    } finally {
      setIsBooking(false);
    }
  };

  const handleSlotSelect = (slotId: string) => {
    setSelectedSlot(slotId);
  };

  const confirmBooking = () => {
    if (selectedSlot) {
      handleBookSlot(selectedSlot);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-amber-200">
          <div>
            <h2 className="text-2xl font-bold text-amber-900">
              Book Appointment
            </h2>
            <p className="text-amber-700 text-sm">
              Select an available slot to book your appointment
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-amber-600 hover:text-amber-800 p-1 rounded-lg hover:bg-amber-50 transition-colors"
            disabled={isBooking}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Doctor Info */}
        <div className="p-6 border-b border-amber-100 bg-amber-50/50">
          <div className="flex items-start space-x-4">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-amber-900">
                {doctor.user.name}
              </h3>
              <p className="text-amber-700 mb-2">
                {getSpecializationLabel(doctor.specialization)}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center text-amber-700">
                  <User className="w-4 h-4 mr-2" />
                  <span>{doctor.experience} years exp.</span>
                </div>
                <div className="flex items-center text-amber-700">
                  <DollarSign className="w-4 h-4 mr-2" />
                  <span>
                    Rs {parseFloat(doctor.consultationFee).toFixed(0)}
                  </span>
                </div>
                <div className="flex items-center text-amber-700">
                  {doctor.mode === "ONLINE" ? (
                    <Video className="w-4 h-4 mr-2" />
                  ) : (
                    <Building className="w-4 h-4 mr-2" />
                  )}
                  <span>
                    {doctor.mode === "ONLINE" ? "Online" : "In-Person"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Available Slots */}
        <div className="flex-1 overflow-y-auto max-h-96">
          {Object.keys(groupedSlots).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Calendar className="w-16 h-16 text-amber-400 mb-4" />
              <h3 className="text-lg font-semibold text-amber-900 mb-2">
                No Available Slots
              </h3>
              <p className="text-amber-700 text-center">
                This doctor currently has no available appointment slots. Please
                try again later or contact them directly.
              </p>
            </div>
          ) : (
            <div className="p-6 space-y-6">
              {Object.entries(groupedSlots).map(([dateString, slots]) => (
                <div key={dateString}>
                  <h4 className="text-lg font-semibold text-amber-900 mb-3 flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    {formatDate(slots[0].startTime)}
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {slots.map((slot) => {
                      return (
                        <button
                          key={slot.id}
                          onClick={() => handleSlotSelect(slot.id)}
                          disabled={isBooking}
                          className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                            selectedSlot === slot.id
                              ? "border-amber-500 bg-amber-50 text-amber-900"
                              : "border-amber-200 bg-white text-amber-700 hover:border-amber-300 hover:bg-amber-50"
                          } ${
                            isBooking
                              ? "opacity-50 cursor-not-allowed"
                              : "cursor-pointer"
                          }`}
                        >
                          <div className="flex items-center justify-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {formatDate(slot.startTime).split(", ")[1]} - {formatDate(slot.endTime).split(", ")[1]}
                          </div>
                          {selectedSlot === slot.id && (
                            <div className="flex items-center justify-center mt-1">
                              <CheckCircle className="w-4 h-4 text-amber-600" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {Object.keys(groupedSlots).length > 0 && (
          <div className="p-6 border-t border-amber-200 bg-white">
            <div className="flex items-center justify-between">
              <div className="text-sm text-amber-700">
                {selectedSlot ? (
                  <>
                    Selected:{" "}
                    {formatDate(
                      availableSlots.find((s) => s.id === selectedSlot)
                        ?.startTime || ""
                    )}
                  </>
                ) : (
                  "Please select a time slot"
                )}
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={onClose}
                  disabled={isBooking}
                  className="px-4 py-2 text-amber-700 hover:bg-amber-50 rounded-lg transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmBooking}
                  disabled={!selectedSlot || isBooking}
                  className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isBooking ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Booking...
                    </>
                  ) : (
                    <>
                      <Calendar className="w-4 h-4 mr-2" />
                      Confirm Booking
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
