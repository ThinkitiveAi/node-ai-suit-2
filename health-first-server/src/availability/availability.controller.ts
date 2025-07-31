import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { AvailabilityService } from './availability.service';
import { CreateProviderAvailabilityDto, GetAvailabilityDto } from './dto/availability.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('availability')
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {} 

  @Post()
  @ApiOperation({ summary: 'Create provider availability' })
  @ApiResponse({ status: 201, description: 'Provider availability created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createProviderAvailability(@Body() createProviderAvailabilityDto: CreateProviderAvailabilityDto) {
    return this.availabilityService.createProviderAvailability(createProviderAvailabilityDto);
  }

  @Get('provider/:id')
  @ApiOperation({ summary: 'Get provider availability' })
  @ApiResponse({ status: 200, description: 'Provider availability fetched successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async getProviderAvailability(@Param('id') id: string, @Query() getAvailabilityDto: GetAvailabilityDto) {
    return this.availabilityService.getProviderAvailability(Number(id), getAvailabilityDto);
  }
}
