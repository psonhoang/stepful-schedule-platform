import { Injectable } from '@nestjs/common';
import { Role, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDTO } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDTO): Promise<User> {
    return this.prismaService.user.create({
      data: {
        ...createUserDto,
      },
    });
  }

  async findByRole(role: Role): Promise<User[]> {
    return this.prismaService.user.findMany({
      where: {
        role,
      },
    });
  }

  async findAll(): Promise<User[]> {
    return this.prismaService.user.findMany({});
  }

  async findOne(id: number): Promise<User> {
    return this.prismaService.user.findUnique({
      where: {
        id,
      },
    });
  }
}
