import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Feedback } from '@prisma/client';
import { CreateFeedbackDTO } from './dto/create-feedback.dto';
import { FeedbackService } from './feedback.service';

@ApiTags('Feedback')
@Controller('feedback')
export class FeedbackController {
  constructor(private feedbackService: FeedbackService) {}

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Feedback> {
    return this.feedbackService.findOne(id);
  }

  @Post()
  async create(@Body() body: CreateFeedbackDTO): Promise<Feedback> {
    return this.feedbackService.create(body);
  }
}
