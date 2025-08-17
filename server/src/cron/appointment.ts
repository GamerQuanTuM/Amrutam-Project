import { prisma } from "../config/prisma"

export const releaseSlots = async () => {
  const now = new Date()

  const expiredSlots = await prisma.availability.findMany({
    where: {
      lockedAt: { not: null },
      lockExpiry: { lte: now }
    }
  })

  if (expiredSlots.length > 0) {
    // Release them in bulk
    await prisma.availability.updateMany({
      where: {
        id: { in: expiredSlots.map(slot => slot.id) }
      },
      data: {
        isBooked: false,
        lockedAt: null,
        lockExpiry: null,
        lockedBy: null
      }
    })
    console.log(`Released ${expiredSlots.length} expired slot(s)`)
  } else {
    console.log("No expired slots found")
  }
}

export const cleanupPastSlotsAndAppointments = async () => {
  const now = new Date();

  // 1️⃣ Find all past slots
  const pastSlots = await prisma.availability.findMany({
    where: {
      endTime: { lt: now }, // Slots that ended before now
    },
    select: { id: true }
  });

  if (pastSlots.length === 0) {
    console.log("No past slots to clean up.");
    return;
  }

  const slotIds = pastSlots.map(slot => slot.id);

  await prisma.$transaction([
    prisma.appointment.deleteMany({
      where: {
        slotId: { in: slotIds }
      }
    }),

    prisma.availability.deleteMany({
      where: {
        id: { in: slotIds }
      }
    })
  ])



console.log(`Cleaned up ${slotIds.length} past slots and their appointments.`);
};

export const autoCancelUnpaidAppointments = async () => {
  const now = new Date()
  const AUTO_CANCEL_MINUTES = 15
  const cutoffTime = new Date(now.getTime() - AUTO_CANCEL_MINUTES * 60 * 1000)

  const unpaidAppointments = await prisma.appointment.findMany({
    where: {
      status: "BOOKED",
      createdAt: { lte: cutoffTime },
    },
    select: {
      id: true,
      slotId: true
    }
  })

  if (unpaidAppointments.length === 0) {
    console.log("No unpaid appointments to cancel.")
    return
  }

  for (const appt of unpaidAppointments) {
    await prisma.$transaction([
      prisma.appointment.update({
        where: { id: appt.id },
        data: { status: "CANCELLED" }
      }),
      prisma.availability.update({
        where: { id: appt.slotId },
        data: {
          isBooked: false,
          lockedAt: null,
          lockedBy: null,
          lockExpiry: null
        }
      })
    ])
  }

  console.log(`Auto-cancelled ${unpaidAppointments.length} unpaid appointments.`)
}


