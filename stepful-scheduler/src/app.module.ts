import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { PrismaModule } from './prisma/prisma.module';
import { TimeslotsModule } from './timeslots/timeslots.module';
import { UsersModule } from './users/users.module';
import { FeedbackModule } from './feedback/feedback.module';

@Module({
  imports: [PrismaModule, UsersModule, TimeslotsModule, HealthModule, FeedbackModule],
})
export class AppModule {}
