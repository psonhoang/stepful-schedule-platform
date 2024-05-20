import { client } from "@/client/httpClient";
import { TimeSlot } from "@/types/timeslot";
import { Role, User } from "@/types/user";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { redirect } from "next/navigation";
import FeedbackModalButton from "./@modal/feedbackButton/page";

/* Data requests */
async function getUser(userId: number): Promise<User> {
  return client.get(`users/${userId}`);
}

async function getTimeSlotsForStudent(studentId: number): Promise<TimeSlot[]> {
  return client.get(`timeslots`, {
    studentId,
  });
}

async function getTimeSlotsByCoach(coachId: number): Promise<TimeSlot[]> {
  return client.get(`timeslots`, {
    coachId,
  });
}

async function updateTimeSlot(formData: FormData) {
  "use server";

  const { timeSlotId, coachId, studentId } = Object.fromEntries(formData);

  await client.patch(`timeslots/${timeSlotId}`, {
    studentId,
  });

  revalidatePath(`/user/${coachId}`);
  revalidatePath(`/user/${studentId}`);
  redirect(`/user/${studentId}`);
}

/* Page component */
export default async function UserPage({
  params: { id },
}: {
  params: {
    id: number;
  };
}) {
  const user = await getUser(id);
  const timeslots =
    user.role === Role.COACH
      ? await getTimeSlotsByCoach(id)
      : await getTimeSlotsForStudent(id);

  return (
    <div className="flex flex-col space-y-10 p-10">
      {/* User info header */}
      <section className="flex flex-row space-x-2 ">
        <div className="relative inline-flex items-center justify-center w-20 h-20 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
          <span className="text-4xl text-gray-600 dark:text-gray-300">
            {`${user.name.split(" ")[0][0]}${user.name.split(" ")[1][0]}`}
          </span>
        </div>
        <div className="flex flex-col text-lg p-2">
          <p>{`${user.role === Role.COACH ? "Coach" : "Student"}: ${
            user.name
          }`}</p>
          <p>{`Phone: ${user.phone}`}</p>
        </div>
      </section>
      {/* Schedule */}
      <section className="flex flex-col w-full space-y-4">
        {user.role === Role.COACH && (
          <Link href={`/user/${id}/add-availability`}>
            <button
              type="button"
              className="bg-blue-500 w-fit text-white font-bold py-2 px-4 rounded"
            >
              Add availability
            </button>
          </Link>
        )}
        <table className="table-fixed w-full border">
          <thead>
            <tr className="bg-gray-600">
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Time</th>
              <th className="px-4 py-2">
                {user.role === Role.COACH ? "Student" : "Coach"}
              </th>
              <th className="px-4 py-2">Contact</th>
              <th className="px-4 py-2">Feedback</th>
            </tr>
          </thead>
          <tbody>
            {timeslots.map((slot) => {
              const currentDate = new Date();
              const startDate = new Date(slot.startTime);
              const endDate = new Date(slot.endTime);

              const startTime = `${startDate
                .getHours()
                .toString()
                .padStart(2, "0")}:${startDate
                .getMinutes()
                .toString()
                .padStart(2, "0")}`;

              const endTime = `${endDate
                .getHours()
                .toString()
                .padStart(2, "0")}:${endDate
                .getMinutes()
                .toString()
                .padStart(2, "0")}`;

              return (
                <tr className="text-center" key={slot.id}>
                  <td className="border px-4 py-2">
                    {startDate.toLocaleDateString()}
                  </td>
                  <td className="border px-4 py-2">{`${startTime}-${endTime}`}</td>
                  <td className="border px-4 py-2">
                    {user.role === Role.STUDENT
                      ? slot.coach.name
                      : slot.student
                      ? slot.student.name
                      : "Available"}
                  </td>
                  {user.role === Role.COACH && (
                    <td className="border px-4 py-2">
                      {slot.student ? slot.student.phone : "N/A"}
                    </td>
                  )}
                  {user.role === Role.STUDENT && (
                    <td className="border px-4 py-2">
                      {slot.student ? (
                        slot.coach.phone
                      ) : (
                        <form action={updateTimeSlot}>
                          <input
                            type="hidden"
                            name="timeSlotId"
                            value={slot.id}
                          />
                          <input
                            type="hidden"
                            name="coachId"
                            value={slot.coach.id}
                          />
                          <input
                            type="hidden"
                            name="studentId"
                            value={user.id}
                          />
                          <button
                            type="submit"
                            className="bg-blue-500 text-white font-bold py-2 px-4 rounded "
                          >
                            Schedule call
                          </button>
                        </form>
                      )}
                    </td>
                  )}
                  <td className="border px-4 py-2">
                    {slot.feedback ? (
                      <FeedbackModalButton open={false} timeSlot={slot} />
                    ) : currentDate > endDate ? (
                      user.role === Role.COACH ? (
                        slot.student ? (
                          <Link href={`/timeslots/${slot.id}/add-feedback`}>
                            <button
                              type="button"
                              className="bg-green-500 text-white font-bold py-2 px-4 rounded "
                            >
                              Add feedback
                            </button>
                          </Link>
                        ) : (
                          "N/A"
                        )
                      ) : (
                        <button
                          type="button"
                          className="bg-yellow-500 text-white font-bold py-2 px-4 rounded "
                        >
                          Awaiting feedback
                        </button>
                      )
                    ) : slot.coach && slot.student ? (
                      <button
                        type="button"
                        className="bg-orange-500 text-white font-bold py-2 px-4 rounded "
                      >
                        Pending call
                      </button>
                    ) : (
                      "N/A"
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
}
