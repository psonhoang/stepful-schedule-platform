import { client } from "@/client/httpClient";
import { TimeSlot } from "@/types/timeslot";
import moment from "moment-timezone";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/* Data requests */
async function getTimeSlot(id: number): Promise<TimeSlot> {
  return client.get(`timeslots/${id}`);
}

async function patchTimeSlot(formData: FormData) {
  "use server";

  const { id, coachId, studentId, date, time } = Object.fromEntries(formData);
  const localStartTime = `${date} ${moment(time as string, ["h:mm A"]).format(
    "HH:mm"
  )}:00`;
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const startTime = moment.tz(localStartTime, timezone).utc().toISOString();

  await client.patch(`timeslots/${id}`, {
    startTime,
  });

  revalidatePath(`/user/${coachId}`);
  if (studentId) revalidatePath(`/user/${studentId}`);
  redirect(`/user/${coachId}`);
}

/* Page component */
export default async function EditAvailabilityPage({
  params: { timeSlotId },
}: {
  params: {
    timeSlotId: number;
  };
}) {
  const { coach, student, startTime, id } = await getTimeSlot(timeSlotId);
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const utcMoment = moment.utc(startTime);
  const localMoment = utcMoment.tz(timezone);

  return (
    <div className="flex items-center justify-center p-24">
      <form
        className="flex flex-col space-y-5 text-center bg-gray-800 p-24"
        action={patchTimeSlot}
      >
        <h1 className="font-bold text-2xl mb-5">{`Coach: ${coach.name}`}</h1>
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="coachId" value={coach.id} />
        {student && <input type="hidden" name="studentId" value={student.id} />}
        <div className="flex flex-row space-x-2">
          <label htmlFor="date">Date: </label>
          <input
            className="text-black"
            type="date"
            defaultValue={localMoment.format("YYYY-MM-DD")}
            name="date"
          ></input>
        </div>
        <div className="flex flex-row space-x-2">
          <label htmlFor="time">Start time: </label>
          <input
            className="text-black"
            type="time"
            defaultValue={localMoment.format("HH:mm")}
            name="time"
          ></input>
        </div>
        <div>
          <button
            type="submit"
            className="bg-blue-500 w-fit text-white font-bold py-2 px-4 rounded"
          >
            Update Availability
          </button>
        </div>
      </form>
    </div>
  );
}
