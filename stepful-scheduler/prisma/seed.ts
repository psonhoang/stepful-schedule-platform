import { PrismaClient, Role } from '@prisma/client';
import { DateTime } from 'luxon';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  // Users seed data with COACH and STUDENT roles
  const usersData = [
    {
      id: 1,
      name: 'John Doe',
      role: Role.COACH,
      phone: '+1 (555) 555-5555',
    },
    {
      id: 2,
      name: 'Jane Doe',
      role: Role.COACH,
      phone: '+1 (555) 555-5555',
    },
    {
      id: 3,
      name: 'Student A',
      role: Role.STUDENT,
      phone: '+1 (888) 888-8888',
    },
    {
      id: 4,
      name: 'Student B',
      role: Role.STUDENT,
      phone: '+1 (888) 888-8888',
    },
    {
      id: 5,
      name: 'Student C',
      role: Role.STUDENT,
      phone: '+1 (888) 888-8888',
    },
  ];
  const coachIds = [1, 2];
  const startTimes = [
    DateTime.now().minus({ hours: 4 }),
    DateTime.now().minus({ hours: 1, minutes: 55 }),
    DateTime.now().plus({ minutes: 30 }),
    DateTime.now().plus({ hours: 2 }),
  ];

  // Populate time slots seed data based on coach IDs
  const timeslotsData = [];
  coachIds.forEach((coachId) => {
    startTimes.forEach((startDateTime) => {
      timeslotsData.push({
        coachId,
        startTime: startDateTime.toISO(),
        endTime: startDateTime.plus({ hours: 2 }).toISO(),
      });
    });
  });

  await prisma.$transaction([
    prisma.user.createMany({
      data: usersData,
    }),
    prisma.timeSlot.createMany({
      data: timeslotsData,
    }),
  ]);
}

// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });
