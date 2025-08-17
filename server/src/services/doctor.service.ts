import { Mode, Specialization } from "../../prisma/src/prisma/generated/prisma";
import { prisma } from "../config/prisma";

class DoctorService {
    constructor() { }

    public async findDoctors(
        filters?: {
            specialization?: Specialization,
            mode?: Mode
        },
        page: string = "1",
        limit: string = "10"
    ) {
        const { specialization, mode } = filters || {};
        let numPage = parseInt(page)
        let numLimit = parseInt(limit)
        const skip = (numPage - 1) * numLimit;


        const doctors = await prisma.doctor.findMany({
            where: {
                ...specialization ? { specialization } : {},
                ...mode ? { mode } : {},
            },
            include: {
                user: {
                    select: { id: true, name: true, email: true },
                },
                availability: {
                    where: {
                        isBooked: false,
                        OR: [
                            { lockedBy: null },
                            { lockExpiry: { lt: new Date() } },
                        ],
                    },
                    orderBy: { startTime: "asc" },
                },
            },
        });

        // Sort doctors by earliest slot
        const sortedDoctors = doctors.sort((a, b) => {
            const slotA = a.availability[0]?.startTime?.getTime() ?? Infinity;
            const slotB = b.availability[0]?.startTime?.getTime() ?? Infinity;
            return slotA - slotB;
        });

        // Paginate after sorting
        const paginatedDoctors = sortedDoctors.slice(skip, Number(skip) + numLimit);

        const transformedDoctors = paginatedDoctors.map(doctor => ({
            ...doctor,
            availability: doctor.availability.map(slot => ({
                ...slot,
                startTime: slot.startTime.toISOString(),
                endTime: slot.endTime.toISOString(),
                lockedAt: slot.lockedAt?.toISOString() ?? null,
                lockExpiry: slot.lockExpiry?.toISOString() ?? null
            }))
        }));

        const result = {
            doctors: transformedDoctors,
            meta: {
                page: numPage,
                limit: numLimit,
                total: doctors.length,
                totalPages: Math.ceil(doctors.length / numLimit),
            },
        };

        return result;
    }

    public async findDoctorsByName(name: string) {
        // Normalize the name for consistent caching and searching
        let normalizedName = name.trim();

        // Handle "Dr" prefix variations
        if (normalizedName.match(/^Dr\.?\s*/i)) {
            // Remove any existing Dr/Dr. prefix and surrounding whitespace
            normalizedName = normalizedName.replace(/^Dr\.?\s*/i, '').trim();
            // Add properly formatted prefix
            normalizedName = `Dr. ${normalizedName}`;
        } else {
            // Add prefix if not present
            normalizedName = `Dr. ${normalizedName}`;
        }


        const doctors = await prisma.doctor.findMany({
            where: {
                user: {
                    name: {
                        contains: normalizedName,
                        mode: "insensitive"
                    },
                    role: "DOCTOR"
                }
            },
            include: {
                user: {
                    select: { id: true, name: true, email: true },
                },
                availability: {
                    where: {
                        isBooked: false,
                        OR: [
                            { lockedBy: null },
                            { lockExpiry: { lt: new Date() } },
                        ],
                    },
                    orderBy: { startTime: "asc" },
                },
            },
        });

        const result = doctors.map((doctor) => ({
            ...doctor,
            availability: doctor.availability.map(slot => ({
                ...slot,
                startTime: slot.startTime.toISOString(),
                endTime: slot.endTime.toISOString(),
                lockedAt: slot.lockedAt?.toISOString() ?? null,
                lockExpiry: slot.lockExpiry?.toISOString() ?? null
            }))
        }));

        return result;
    }
}

export default DoctorService;