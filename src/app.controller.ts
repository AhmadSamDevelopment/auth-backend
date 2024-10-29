import { Controller, Get } from '@nestjs/common';

interface HealthStatus {
  status: string;
  timestamp: string;
  uptime: number;
  version: string;
}

@Controller('health-check')
export class AppController {
  @Get()
  getStatus(): HealthStatus {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: '1.0.0',
    };
  }
}
