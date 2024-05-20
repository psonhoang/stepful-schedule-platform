import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber } from 'class-validator';

export class CreateTimeSlotDTO {
  @ApiProperty({ required: true })
  @IsNumber()
  coachId: number;

  @ApiProperty({ required: true })
  @IsDateString()
  startTime: string;
}
