import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TimeSlot } from '@prisma/client';
import { CreateTimeSlotDTO } from './dto/create-timeslot.dto';
import { TimeSlotsQuery } from './dto/timeslots.query';
import { UpdateTimeSlotDTO } from './dto/update-timeslot.dto';
import { TimeSlotEntity } from './entities/timeslot.entity';
import { TimeslotsService } from './timeslots.service';

@ApiTags('TimeSlots')
@Controller('timeslots')
export class TimeslotsController {
  constructor(private readonly timeslotsService: TimeslotsService) {}

  @Post()
  async create(
    @Body() createTimeslotDto: CreateTimeSlotDTO,
  ): Promise<TimeSlot> {
    return await this.timeslotsService.create(createTimeslotDto);
  }

  @Get()
  async findAll(@Query() query: TimeSlotsQuery): Promise<TimeSlotEntity[]> {
    return await this.timeslotsService.findAll(query);
  }

  @Get('past')
  async findPast(@Query() query: TimeSlotsQuery): Promise<TimeSlotEntity[]> {
    return await this.timeslotsService.findPast(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<TimeSlotEntity> {
    return this.timeslotsService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTimeslotDto: UpdateTimeSlotDTO,
  ): Promise<TimeSlot> {
    return await this.timeslotsService.update(+id, updateTimeslotDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<TimeSlot> {
    return this.timeslotsService.remove(+id);
  }
}
