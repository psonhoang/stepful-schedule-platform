import { Injectable } from '@nestjs/common';
import { Feedback } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFeedbackDTO } from './dto/create-feedback.dto';

@Injectable()
export class FeedbackService {
  constructor(private prismaService: PrismaService) {}

  async findOne(id: number): Promise<Feedback> {
    return this.prismaService.feedback.findUnique({
      where: {
        id,
      },
    });
  }

  async create(payload: CreateFeedbackDTO): Promise<Feedback> {
    const { timeSlotId, rating, note } = payload;
    return this.prismaService.feedback.create({
      data: {
        timeSlot: {
          connect: {
            id: timeSlotId,
          },
        },
        rating,
        note,
      },
    });
  }
}
