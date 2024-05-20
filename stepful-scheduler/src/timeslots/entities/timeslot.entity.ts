import { Prisma } from '@prisma/client';

const timeSlotWithIncludes = Prisma.validator<Prisma.TimeSlotDefaultArgs>()({
  include: {
    coach: true,
    student: true,
    feedback: true,
  },
});

export type TimeSlotEntity = Prisma.TimeSlotGetPayload<
  typeof timeSlotWithIncludes
>;
