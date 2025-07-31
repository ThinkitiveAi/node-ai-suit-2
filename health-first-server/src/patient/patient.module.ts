import { Module } from '@nestjs/common';
import { PatientService } from './patient.service';
import { PatientController } from './patient.controller';
import { PrismaClient } from '@prisma/client';

@Module({
  controllers: [PatientController],
  providers: [PatientService, PrismaClient],
})
export class PatientModule {}
