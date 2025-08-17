import cron from "node-cron";
import { autoCancelUnpaidAppointments, cleanupPastSlotsAndAppointments, releaseSlots } from "./appointment";

export const initCronJobs = () => {
  // Every minute — release expired locks
  cron.schedule("* * * * *", async () => {
    console.log("⏳ Running releaseSlots job...");
    await releaseSlots();
  });

  // Every day at midnight — cleanup old slots/appointments
  cron.schedule("0 0 * * *", async () => {
    console.log("🧹 Running cleanupPastSlotsAndAppointments job...");
    await cleanupPastSlotsAndAppointments();
  });

  // Every minute — auto-cancel unpaid appointments
  cron.schedule("* * * * *", async () => {
    console.log("🚫 Running autoCancelUnpaidAppointments job...");
    await autoCancelUnpaidAppointments();
  });

  console.log("✅ Cron jobs scheduled");
};
