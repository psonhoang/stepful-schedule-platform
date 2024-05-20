import { client } from "@/client/httpClient";
import { TimeSlot } from "@/types/timeslot";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/* Data requests */
async function getTimeSlot(id: number): Promise<TimeSlot> {
  "use server";

  return client.get(`timeslots/${id}`);
}

async function postFeedback(formData: FormData) {
  "use server";
  const { timeSlotId, coachId, studentId, rating, note } =
    Object.fromEntries(formData);
  await client.post("feedback", {
    timeSlotId,
    rating,
    note,
  });

  revalidatePath(`/user/${coachId}`);
  revalidatePath(`/user/${studentId}`);
  redirect(`/user/${coachId}`);
}

/* Add Feedback form page */
export default async function AddFeedbackPage({
  params: { id: timeSlotId },
}: {
  params: { id: number };
}) {
  const { student, startTime, coach } = await getTimeSlot(timeSlotId);
  const startDate = new Date(startTime).toLocaleDateString();

  return (
    <div className="flex items-center justify-center p-24">
      <form
        className="flex flex-col space-y-5 text-center bg-gray-800 p-24"
        action={postFeedback}
      >
        <h1 className="font-bold text-2xl mb-5">{`Feedback for call with ${
          student?.name || ""
        } on ${startDate}`}</h1>
        <input type="hidden" name="timeSlotId" value={timeSlotId} />
        <input type="hidden" name="studentId" value={student?.id || ""} />
        <input type="hidden" name="coachId" value={coach.id} />
        <div className="flex flex-row space-x-2">
          <label htmlFor="rating">Rating: </label>
          <input
            className="text-black"
            type="number"
            defaultValue={0}
            min="0"
            max="5"
            name="rating"
          ></input>
          <span>/5</span>
        </div>
        <div className="flex flex-row space-x-2">
          <label htmlFor="note">Note: </label>
          <textarea
            className="text-black"
            name="note"
            cols={40}
            rows={3}
          ></textarea>
        </div>
        <div>
          <button
            type="submit"
            className="bg-blue-500 w-fit text-white font-bold py-2 px-4 rounded"
          >
            Submit feedback
          </button>
        </div>
      </form>
    </div>
  );
}
