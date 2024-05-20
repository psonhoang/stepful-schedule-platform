import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class CreateUserDTO {
  @ApiProperty({ required: true })
  role: Role;

  @ApiProperty({ required: true })
  name: string;

  @ApiProperty({ required: true })
  phone: string;
}
