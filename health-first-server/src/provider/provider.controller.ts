import { Controller, Post, Get, Param, Body, ParseIntPipe, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ProviderService } from './provider.service';
import { CreateDoctorDto, DoctorResponseDto } from './dto/provider.dto';

@ApiTags('Providers')
@Controller('provider')
export class ProviderController {
  constructor(private readonly providerService: ProviderService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new doctor provider' })
  @ApiResponse({
    status: 201,
    description: 'Doctor provider created successfully',
    type: DoctorResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation error or password mismatch',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - email, phone number, or license number already exists',
  })
  async createProvider(@Body() createDoctorDto: CreateDoctorDto): Promise<DoctorResponseDto> {
    return this.providerService.createProvider(createDoctorDto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a doctor provider by ID' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the doctor provider',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Doctor provider retrieved successfully',
    type: DoctorResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - doctor not found',
  })
  async getProviderById(@Param('id', ParseIntPipe) id: number): Promise<DoctorResponseDto> {
    return this.providerService.getProviderById(id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all active doctor providers' })
  @ApiResponse({
    status: 200,
    description: 'List of all active doctor providers retrieved successfully',
    type: [DoctorResponseDto],
  })
  async getAllProviders(): Promise<DoctorResponseDto[]> {
    return this.providerService.getAllProviders();
  }
}
