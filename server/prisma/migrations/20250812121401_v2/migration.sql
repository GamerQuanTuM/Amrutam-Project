/*
  Warnings:

  - Changed the type of `specialization` on the `Doctor` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."Specialization" AS ENUM ('SKIN_CARE', 'DIGESTIVE_ISSUES', 'RESPIRATORY_CARE', 'JOINT_PAIN', 'MENTAL_WELLNESS', 'GENERAL_CONSULTATION', 'WOMENS_HEALTH', 'PEDIATRIC_CARE');

-- AlterEnum
ALTER TYPE "public"."AppointmentStatus" ADD VALUE 'PENDING_CONFIRMATION';

-- AlterTable
ALTER TABLE "public"."Appointment" ADD COLUMN     "confirmedAt" TIMESTAMP(3),
ADD COLUMN     "originalSlotId" TEXT,
ADD COLUMN     "rescheduleCount" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "status" DROP DEFAULT;

-- AlterTable
ALTER TABLE "public"."Availability" ADD COLUMN     "lockExpiry" TIMESTAMP(3),
ADD COLUMN     "lockedAt" TIMESTAMP(3),
ADD COLUMN     "lockedBy" TEXT;

-- AlterTable
ALTER TABLE "public"."Doctor" ADD COLUMN     "consultationFee" DECIMAL(65,30),
ADD COLUMN     "experience" INTEGER,
DROP COLUMN "specialization",
ADD COLUMN     "specialization" "public"."Specialization" NOT NULL;

-- CreateIndex
CREATE INDEX "Appointment_patientId_idx" ON "public"."Appointment"("patientId");

-- CreateIndex
CREATE INDEX "Appointment_doctorId_idx" ON "public"."Appointment"("doctorId");

-- CreateIndex
CREATE INDEX "Appointment_status_idx" ON "public"."Appointment"("status");

-- CreateIndex
CREATE INDEX "Appointment_bookedAt_idx" ON "public"."Appointment"("bookedAt");

-- CreateIndex
CREATE INDEX "Availability_doctorId_idx" ON "public"."Availability"("doctorId");

-- CreateIndex
CREATE INDEX "Availability_startTime_idx" ON "public"."Availability"("startTime");

-- CreateIndex
CREATE INDEX "Availability_doctorId_startTime_idx" ON "public"."Availability"("doctorId", "startTime");

-- CreateIndex
CREATE INDEX "Availability_isBooked_idx" ON "public"."Availability"("isBooked");

-- CreateIndex
CREATE INDEX "Availability_lockExpiry_idx" ON "public"."Availability"("lockExpiry");

-- CreateIndex
CREATE INDEX "Doctor_specialization_idx" ON "public"."Doctor"("specialization");

-- CreateIndex
CREATE INDEX "Doctor_mode_idx" ON "public"."Doctor"("mode");

-- CreateIndex
CREATE INDEX "Doctor_specialization_mode_idx" ON "public"."Doctor"("specialization", "mode");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "public"."User"("email");

-- AddForeignKey
ALTER TABLE "public"."Availability" ADD CONSTRAINT "Availability_lockedBy_fkey" FOREIGN KEY ("lockedBy") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
