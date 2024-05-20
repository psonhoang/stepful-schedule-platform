import { ApiProperty, ApiQuery } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

@ApiQuery({ required: false })
export class TimeSlotsQuery {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  coachId: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  studentId: number;
}
