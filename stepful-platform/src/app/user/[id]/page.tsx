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

async function deleteTimeSlot(formData: FormData) {
  "use server";

  const { timeSlotId, coachId, studentId } = Object.fromEntries(formData);

  await client.delete(`timeslots/${timeSlotId}`);

  revalidatePath(`/user/${coachId}`);
  if (studentId !== "") revalidatePath(`/user/${studentId}`);
  redirect(`/user/${coachId}`);
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
          <Link href={`/user/${id}/availability`}>
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
                    <div className="flex flex-row align-middle justify-center space-x-4">
                      {user.role === Role.COACH && (
                        <div className="flex flex-row align-middle space-x-2">
                          <Link href={`/user/${id}/availability/${slot.id}`}>
                            <button
                              type="button"
                              className="bg-blue-500 text-white font-bold py-1 px-1 rounded"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="size-6"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                                />
                              </svg>
                            </button>
                          </Link>

                          <form action={deleteTimeSlot}>
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
                              name="studentid"
                              value={slot.student ? slot.student.id : ""}
                            />
                            <button
                              type="submit"
                              className="bg-red-500 text-white font-bold py-1 px-1 rounded"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="size-6"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                />
                              </svg>
                            </button>
                          </form>
                        </div>
                      )}
                      <p>{startDate.toLocaleDateString()}</p>
                    </div>
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
