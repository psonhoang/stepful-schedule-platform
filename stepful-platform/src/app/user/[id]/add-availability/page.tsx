import { client } from "@/client/httpClient";
import { User } from "@/types/user";
import moment from "moment-timezone";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/* Data requests */
async function getCoach(coachId: number): Promise<User> {
  return client.get(`users/${coachId}`);
}

async function postTimeSlot(formData: FormData) {
  "use server";

  const { coachId, date, time } = Object.fromEntries(formData);
  const localStartTime = `${date} ${moment(time as string, ["h:mm A"]).format(
    "HH:mm"
  )}:00`;
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const startTime = moment.tz(localStartTime, timezone).utc().toISOString();

  await client.post("timeslots", {
    coachId,
    startTime,
  });

  revalidatePath(`/user/${coachId}`);
  redirect(`/user/${coachId}`);
}

/* Availability Form page component */
export default async function AddAvailabilityPage({
  params: { id: coachId },
}: {
  params: { id: number };
}) {
  const coach = await getCoach(coachId);

  return (
    <div className="flex items-center justify-center p-24">
      <form
        className="flex flex-col space-y-5 text-center bg-gray-800 p-24"
        action={postTimeSlot}
      >
        <h1 className="font-bold text-2xl mb-5">{`Coach: ${coach.name}`}</h1>
        <input type="hidden" name="coachId" value={coachId} />
        <div className="flex flex-row space-x-2">
          <label htmlFor="date">Date: </label>
          <input className="text-black" type="date" name="date"></input>
        </div>
        <div className="flex flex-row space-x-2">
          <label htmlFor="time">Start time: </label>
          <input className="text-black" type="time" name="time"></input>
        </div>
        <div>
          <button
            type="submit"
            className="bg-blue-500 w-fit text-white font-bold py-2 px-4 rounded"
          >
            Submit Availability
          </button>
        </div>
      </form>
    </div>
  );
}
