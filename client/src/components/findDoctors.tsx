"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FindDoctorsApiResponse,
  Slot,
  Specialization,
  Mode,
  Doctor,
} from "@/types/findDoctor";
import {
  Building,
  Calendar,
  Clock,
  DollarSign,
  Filter,
  MapPin,
  Search,
  Stethoscope,
  User,
  Video,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import findDoctors from "@/actions/findDoctors";
import findDoctorByName from "@/actions/findDoctorByName";
import BookAppointmentModal from "@/components/bookappointmentmodal";
import { axiosInstance } from "@/lib/axiosInstance";
import { toast } from "sonner";
import specializations from "@/constants/specialization";
import modes from "@/constants/mode";
import formatDate from "@/functions/formatDate";

export default function FindDoctorsComponent({
  initialResponse,
}: {
  initialResponse: FindDoctorsApiResponse;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Modal state
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get initial values from URL search params
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>(
    searchParams.get("specialization") || "ALL"
  );
  const [selectedMode, setSelectedMode] = useState<string>(
    searchParams.get("mode") || "ALL"
  );
  const [currentPage, setCurrentPage] = useState<number>(
    parseInt(searchParams.get("page") || "1")
  );
  const [searchTerm, setSearchTerm] = useState<string>(
    searchParams.get("name") || ""
  );

  // Use the response from server action or initial response
  const [response, setResponse] =
    useState<FindDoctorsApiResponse>(initialResponse);

  // Track if current results are from name search
  const [isNameSearch, setIsNameSearch] = useState<boolean>(
    !!searchParams.get("name")
  );


  const getSpecializationLabel = (value: Specialization | "ALL"): string => {
    const found = specializations.find((s) => s.value === value);
    return found ? found.label : value;
  };


  const getNextAvailableSlot = (availability: Slot[]): string => {
    if (!availability || availability.length === 0) return "No availability";

    const availableSlots = availability.filter((slot) => !slot.isBooked);
    if (availableSlots.length === 0) return "No available slots";

    // Sort by start time and get the earliest
    availableSlots.sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );
    return formatDate(availableSlots[0].startTime);
  };

  // Update URL with search params
  const updateURL = (params: Record<string, string>) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());

    // Handle each parameter
    Object.entries(params).forEach(([key, value]) => {
      if (value && value !== "ALL") {
        newSearchParams.set(key, value);
      } else {
        newSearchParams.delete(key);
      }
    });

    // Always reset to page 1 when changing filters (except when changing page directly)
    if (!params.page) {
      newSearchParams.delete("page");
      setCurrentPage(1);
    }

    const newURL = `${window.location.pathname}?${newSearchParams.toString()}`;
    router.push(newURL, { scroll: false });
  };

  // Handle name search
  const handleNameSearch = async (name: string) => {
    if (!name.trim()) {
      // If search term is empty, fetch all doctors with current filters
      setIsNameSearch(false);
      fetchDoctors(selectedSpecialization, selectedMode, 1);
      const params: Record<string, string> = {};
      if (selectedSpecialization !== "ALL")
        params.specialization = selectedSpecialization;
      if (selectedMode !== "ALL") params.mode = selectedMode;
      updateURL(params);
      return;
    }

    startTransition(async () => {
      try {
        // Clear filters when doing a name search
        setSelectedSpecialization("ALL");
        setSelectedMode("ALL");

        const result = await findDoctorByName(name);
        setResponse(result);
        setIsNameSearch(true);

        // Only keep the name in URL params when searching by name
        updateURL({
          name,
          specialization: "",
          mode: "",
          page: "",
        });
      } catch (error) {
        console.error("Error searching doctors by name:", error);
      }
    });
  };

  // Fetch doctors with server action
  const fetchDoctors = async (
    specialization?: string,
    mode?: string,
    page?: number
  ) => {
    startTransition(async () => {
      try {
        const result = await findDoctors(
          specialization === "ALL"
            ? undefined
            : (specialization as Specialization),
          mode === "ALL" ? undefined : (mode as Mode),
          page || 1
        );
        setResponse(result);
        setIsNameSearch(false);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    });
  };

  // Handle filter changes
  const handleSpecializationChange = (specialization: string) => {
    setSelectedSpecialization(specialization);
    // Clear search input when using filters
    setSearchTerm("");
    setIsNameSearch(false);
    updateURL({ specialization, name: "" });
    fetchDoctors(specialization, selectedMode, 1);
  };

  const handleModeChange = (mode: string) => {
    setSelectedMode(mode);
    // Clear search input when using filters
    setSearchTerm("");
    setIsNameSearch(false);
    updateURL({ mode, name: "" });
    fetchDoctors(selectedSpecialization, mode, 1);
  };

  // Handle page changes (only for filter-based results)
  const handlePageChange = (page: number) => {
    if (isNameSearch) return; // No pagination for name search results

    setCurrentPage(page);
    updateURL({ page: page.toString() });
    fetchDoctors(selectedSpecialization, selectedMode, page);

    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Clear name search and return to filter results
  const clearNameSearch = () => {
    setSearchTerm("");
    setIsNameSearch(false);

    // Reset to default filters
    setSelectedSpecialization("ALL");
    setSelectedMode("ALL");

    fetchDoctors("ALL", "ALL", 1);

    // Clear all search params
    updateURL({
      name: "",
      specialization: "",
      mode: "",
      page: "",
    });
  };

  // Handle search input changes
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Debounce the search or handle on Enter key
    if (value.trim() === "") {
      clearNameSearch();
    }
  };

  // Handle search on Enter key
  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleNameSearch(searchTerm);
    }
  };

  // Modal handlers
  const openBookingModal = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsModalOpen(true);
  };

  const closeBookingModal = () => {
    setSelectedDoctor(null);
    setIsModalOpen(false);
  };

 const handleBookSlot = async (slotId: string) => {
  try {
    const { data } = await axiosInstance.post("/appointment/booking", {
      slotId,
    });

    if (data) {
      // Close the modal first
      closeBookingModal();
      
      // Refetch the current view based on whether it's a name search or filter search
      if (isNameSearch && searchTerm) {
        // Refetch name search results
        const result = await findDoctorByName(searchTerm);
        setResponse(result);
      } else {
        // Refetch filter-based results with current page
        const result = await findDoctors(
          selectedSpecialization === "ALL" ? undefined : selectedSpecialization as Specialization,
          selectedMode === "ALL" ? undefined : selectedMode as Mode,
          currentPage
        );
        setResponse(result);

        toast.success("Slot booked successfully!")
      }
    }
  } catch (error) {
    console.error("Error booking appointment:", error);
    toast.error("Error booking appointment.");
    closeBookingModal();
  }
};

  const generatePageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;
    const totalPages = response?.data?.meta?.totalPages || 1;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  // Get current data from API response
  const { doctors } = response?.data;
  const { page, limit, total, totalPages } = (response?.data?.meta &&
    response?.data?.meta) || {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  };

  return (
    <div className="min-h-screen theme-bg p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-amber-900 mb-2">
            Find Doctors
          </h1>
          <p className="text-amber-700">
            Connect with qualified healthcare professionals for your medical
            needs
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="bg-white/80 backdrop-blur-sm border-amber-200 mb-8">
          <CardHeader>
            <CardTitle className="text-amber-900 flex items-center pb-3">
              <Filter className="w-5 h-5 mr-2" />
              Search & Filter Doctors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-amber-600" />
                <input
                  type="text"
                  placeholder="Search doctors by name..."
                  value={searchTerm}
                  onChange={handleSearchInputChange}
                  onKeyPress={handleSearchKeyPress}
                  className="input-border-class pr-10"
                  disabled={isPending}
                />
                {searchTerm && (
                  <button
                    onClick={clearNameSearch}
                    className="absolute right-3 top-3 w-4 h-4 text-amber-600 hover:text-amber-800"
                    disabled={isPending}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Specialization Filter */}
              <div className="relative">
                <Stethoscope className="absolute left-3 top-3 w-4 h-4 text-amber-600" />
                <select
                  value={selectedSpecialization}
                  onChange={(e) => handleSpecializationChange(e.target.value)}
                  className="input-border-class appearance-none"
                  disabled={isPending}
                >
                  {specializations.map((spec) => (
                    <option key={spec.value} value={spec.value}>
                      {spec.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Mode Filter */}
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-amber-600" />
                <select
                  value={selectedMode}
                  onChange={(e) => handleModeChange(e.target.value)}
                  className="input-border-class appearance-none"
                  disabled={isPending}
                >
                  {modes.map((mode) => (
                    <option key={mode.value} value={mode.value}>
                      {mode.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Search Button for Mobile */}
            <div className="mt-4 md:hidden">
              <button
                onClick={() => handleNameSearch(searchTerm)}
                disabled={isPending || !searchTerm.trim()}
                className="button-class w-full py-2 px-4 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Search className="w-4 h-4 mr-2" />
                Search by Name
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Search Results Info */}
        {isNameSearch && searchTerm && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center justify-between">
              <p className="text-amber-800 font-medium">
                Search results for: "{searchTerm}"
              </p>
              <button
                onClick={clearNameSearch}
                className="text-amber-600 hover:text-amber-800 text-sm underline"
              >
                Clear search
              </button>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="mb-6 flex justify-between items-center">
          <p className="text-amber-700 font-medium">
            {isNameSearch ? (
              <>
                Showing {total} doctor{total !== 1 ? "s" : ""} found
              </>
            ) : (
              <>
                Showing {(page - 1) * limit + 1}-{Math.min(page * limit, total)}{" "}
                of {total} doctor{total !== 1 ? "s" : ""} matching your criteria
              </>
            )}
          </p>
          {!isNameSearch && totalPages > 1 && (
            <p className="text-amber-600 text-sm">
              Page {page} of {totalPages}
            </p>
          )}
        </div>

        {/* Doctors Grid */}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 ${
            isPending ? "opacity-50" : ""
          }`}
        >
          {doctors.map((doctor) => (
            <Card
              key={doctor.id}
              className="bg-white/80 backdrop-blur-sm border-amber-200 hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="flex items-start space-x-4">
                  <div className="flex-1">
                    <CardTitle className="text-lg text-amber-900">
                      {doctor.user.name}
                    </CardTitle>
                    <CardDescription className="text-amber-700">
                      {getSpecializationLabel(doctor.specialization)}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-amber-800">{doctor.bio}</p>

                {/* Doctor Details */}
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-amber-700">
                    <User className="w-4 h-4 mr-2" />
                    <span>{doctor.experience} years experience</span>
                  </div>

                  <div className="flex items-center text-sm text-amber-700">
                    <DollarSign className="w-4 h-4 mr-2" />
                    <span>
                      Rs {parseFloat(doctor.consultationFee).toFixed(0)}{" "}
                      consultation fee
                    </span>
                  </div>

                  <div className="flex items-center text-sm text-amber-700">
                    {doctor.mode === "ONLINE" ? (
                      <Video className="w-4 h-4 mr-2" />
                    ) : (
                      <Building className="w-4 h-4 mr-2" />
                    )}
                    <span>
                      {doctor.mode === "ONLINE"
                        ? "Online Consultation"
                        : "In-Person Visit"}
                    </span>
                  </div>

                  <div className="flex items-center text-sm text-amber-700">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>
                      Next available:{" "}
                      {getNextAvailableSlot(doctor.availability)}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 pt-4">
                  <button
                    onClick={() => openBookingModal(doctor)}
                    className="button-class flex-1 py-2 px-4 text-sm"
                    disabled={isPending}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Appointment
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination - Only show for filter-based results */}
        {!isNameSearch && totalPages > 1 && (
          <Card className="bg-white/80 backdrop-blur-sm border-amber-200">
            <CardContent className="py-4">
              <div className="flex items-center justify-center space-x-2">
                {/* Previous Button */}
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1 || isPending}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === 1 || isPending
                      ? "text-amber-400 cursor-not-allowed"
                      : "text-amber-600 hover:bg-amber-50 cursor-pointer"
                  }`}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </button>

                {/* Page Numbers */}
                <div className="flex items-center space-x-1">
                  {generatePageNumbers().map((pageNum, index) => (
                    <button
                      key={index}
                      onClick={() =>
                        typeof pageNum === "number" && handlePageChange(pageNum)
                      }
                      disabled={pageNum === "..." || isPending}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        pageNum === currentPage
                          ? "button-class"
                          : pageNum === "..."
                          ? "text-amber-400 cursor-default"
                          : isPending
                          ? "text-amber-400 cursor-not-allowed"
                          : "text-amber-600 hover:bg-amber-50 cursor-pointer"
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>

                {/* Next Button */}
                <button
                  onClick={() =>
                    handlePageChange(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages || isPending}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === totalPages || isPending
                      ? "text-amber-400 cursor-not-allowed"
                      : "text-amber-600 hover:bg-amber-50 cursor-pointer"
                  }`}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>

              {/* Results Summary */}
              <div className="text-center mt-4 text-sm text-amber-600">
                Showing {(page - 1) * limit + 1} to{" "}
                {Math.min(page * limit, total)} of {total} results
              </div>
            </CardContent>
          </Card>
        )}

        {/* No Results */}
        {doctors.length === 0 && !isPending && (
          <div className="flex-col-center py-12">
            <Stethoscope className="w-16 h-16 text-amber-400 mb-4" />
            <h3 className="text-xl font-semibold text-amber-900 mb-2">
              No doctors found
            </h3>
            <p className="text-amber-700 text-center max-w-md">
              {isNameSearch
                ? `No doctors found with the name "${searchTerm}". Try searching with a different name.`
                : "Try adjusting your search criteria or filters to find more doctors that match your needs."}
            </p>
          </div>
        )}

        {/* Booking Modal */}
        {selectedDoctor && (
          <BookAppointmentModal
            doctor={selectedDoctor}
            isOpen={isModalOpen}
            onClose={closeBookingModal}
            onBookSlot={handleBookSlot}
          />
        )}
      </div>
    </div>
  );
}
