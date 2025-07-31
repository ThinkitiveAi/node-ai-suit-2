import { Module } from '@nestjs/common';
import { AvailabilityService } from './availability.service';
import { AvailabilityController } from './availability.controller';
import { PrismaClient } from '@prisma/client';

@Module({
  controllers: [AvailabilityController],
  providers: [AvailabilityService, PrismaClient],
})
export class AvailabilityModule {}
