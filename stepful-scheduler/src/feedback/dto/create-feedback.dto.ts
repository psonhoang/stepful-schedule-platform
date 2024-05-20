import { ApiProperty } from '@nestjs/swagger';

export class CreateFeedbackDTO {
  @ApiProperty({ required: true })
  timeSlotId: number;

  @ApiProperty({ required: true })
  rating: number;

  @ApiProperty({ required: true })
  note: string;
}
