import { Module } from '@nestjs/common';
import { ProviderService } from './provider.service';
import { ProviderController } from './provider.controller';
import { PrismaClient } from '@prisma/client';

@Module({
  controllers: [ProviderController],
  providers: [ProviderService, PrismaClient],
})
export class ProviderModule {}
