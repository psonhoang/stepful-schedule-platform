import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  @Get('')
  health(): string {
    return 'Stepful Scheduler API is healthy';
  }
}
