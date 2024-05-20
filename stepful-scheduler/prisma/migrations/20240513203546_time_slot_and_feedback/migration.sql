/*
  Warnings:

  - A unique constraint covering the columns `[feedback_id]` on the table `TimeSlot` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "TimeSlot" ADD COLUMN     "feedback_id" INTEGER;

-- CreateTable
CREATE TABLE "Feedback" (
    "id" SERIAL NOT NULL,
    "rating" INTEGER NOT NULL,
    "note" TEXT NOT NULL,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TimeSlot_feedback_id_key" ON "TimeSlot"("feedback_id");

-- AddForeignKey
ALTER TABLE "TimeSlot" ADD CONSTRAINT "TimeSlot_feedback_id_fkey" FOREIGN KEY ("feedback_id") REFERENCES "Feedback"("id") ON DELETE SET NULL ON UPDATE CASCADE;
