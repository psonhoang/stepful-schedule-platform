"use client";

import { TimeSlot } from "@/types/timeslot";
import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { useState } from "react";

export default function FeedbackModalButton({
  open,
  timeSlot,
}: {
  open: boolean;
  timeSlot: TimeSlot;
}) {
  let [isOpen, setIsOpen] = useState(open);

  const { coach, student, startTime, feedback } = timeSlot;

  if (!feedback) return <></>;

  const { rating, note } = feedback;

  return (
    <div>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="bg-blue-500 text-white font-bold py-2 px-4 rounded "
      >
        View feedback
      </button>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50 bg-white text-black"
      >
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="w-full max-w-sm rounded bg-white">
            <DialogTitle className="bg-gray-500 text-center text-white text-xl">{`Feedback for ${student?.name}`}</DialogTitle>
            <Description className="p-2">{`The following feedback is for the call with coach ${
              coach.name
            } on ${new Date(startTime).toLocaleDateString()}:`}</Description>

            <div className="flex flex-col space-y-1 p-10 text-black text-lg">
              <p>{`Rating: ${rating}/5`}</p>
              <p>{`Note: ${note}`}</p>
            </div>

            <button
              className="bg-red-500 text-center p-2 w-full text-white"
              onClick={() => setIsOpen(false)}
            >
              Close
            </button>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
}
