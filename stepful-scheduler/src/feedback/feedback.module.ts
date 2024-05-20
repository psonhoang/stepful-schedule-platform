import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { FeedbackService } from './feedback.service';
import { FeedbackController } from './feedback.controller';

@Module({
  providers: [FeedbackService],
  imports: [PrismaModule],
  controllers: [FeedbackController],
})
export class FeedbackModule {}
