import { Controller, Get, Module } from '@nestjs/common';
import { Public } from '../../presentation/decorators/public.decorator';

@Controller()
class HealthController {
  @Public()
  @Get('/health')
  health(): { status: string; ts: string } {
    return { status: 'ok', ts: new Date().toISOString() };
  }
}

@Module({ controllers: [HealthController] })
export class HealthModule {}
