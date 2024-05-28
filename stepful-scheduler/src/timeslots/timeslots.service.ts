import { Injectable } from '@nestjs/common';
import { TimeSlot } from '@prisma/client';
import { DateTime } from 'luxon';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTimeSlotDTO } from './dto/create-timeslot.dto';
import { TimeSlotsQuery } from './dto/timeslots.query';
import { UpdateTimeSlotDTO } from './dto/update-timeslot.dto';
import { TimeSlotEntity } from './entities/timeslot.entity';

@Injectable()
export class TimeslotsService {
  constructor(private prismaService: PrismaService) {}

  async create(createTimeslotDto: CreateTimeSlotDTO): Promise<TimeSlot> {
    const { coachId, startTime } = createTimeslotDto;
    const startDateTime = DateTime.fromISO(startTime);
    const endDateTime = startDateTime.plus({ hours: 2 });
    return this.prismaService.timeSlot.create({
      data: {
        coach: {
          connect: {
            id: coachId,
          },
        },
        startTime: startDateTime.toISO(),
        endTime: endDateTime.toISO(),
      },
    });
  }

  async findAll(query: TimeSlotsQuery): Promise<TimeSlotEntity[]> {
    const { coachId, studentId } = query;
    return this.prismaService.timeSlot.findMany({
      where: studentId
        ? {
            // Querying all available upcoming timeslots or timeslots assigned to given studentId
            coachId,
            OR: [
              // Past, current, or upcoming calls with given studentId
              {
                studentId,
              },
              // Upcoming available time slots
              {
                startTime: {
                  gte: new Date(),
                },
                studentId: null,
              },
            ],
          }
        : {
            // Querying all timeslots related to given coachId
            coachId,
          },
      orderBy: {
        endTime: 'desc',
      },
      include: {
        coach: true,
        student: true,
        feedback: true,
      },
    });
  }

  async findPast(query: TimeSlotsQuery): Promise<TimeSlotEntity[]> {
    const { coachId, studentId } = query;
    return this.prismaService.timeSlot.findMany({
      where: {
        endTime: {
          lt: new Date(),
        },
        coachId,
        studentId,
      },
      orderBy: {
        endTime: 'desc',
      },
      include: {
        coach: true,
        student: true,
        feedback: true,
      },
    });
  }

  async findOne(id: number): Promise<TimeSlotEntity> {
    return this.prismaService.timeSlot.findUnique({
      where: {
        id,
      },
      include: {
        coach: true,
        student: true,
        feedback: true,
      },
    });
  }

  async update(
    id: number,
    updateTimeslotDto: UpdateTimeSlotDTO,
  ): Promise<TimeSlot> {
    const { studentId, startTime } = updateTimeslotDto;
    const endTime = startTime
      ? DateTime.fromISO(startTime).plus({ hours: 2 }).toISO()
      : undefined;
    return this.prismaService.timeSlot.update({
      where: {
        id,
      },
      data: {
        studentId,
        startTime,
        endTime,
      },
    });
  }

  async remove(id: number): Promise<TimeSlot> {
    return this.prismaService.timeSlot.delete({
      where: {
        id,
      },
    });
  }
}
