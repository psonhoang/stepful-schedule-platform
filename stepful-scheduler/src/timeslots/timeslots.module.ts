import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TimeslotsController } from './timeslots.controller';
import { TimeslotsService } from './timeslots.service';

@Module({
  controllers: [TimeslotsController],
  providers: [TimeslotsService],
  imports: [PrismaModule],
})
export class TimeslotsModule {}
