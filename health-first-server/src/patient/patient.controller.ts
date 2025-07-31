import { 
  Controller, 
  Post, 
  Get, 
  Body, 
  HttpStatus, 
  HttpCode,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
  UsePipes
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBody, 
  ApiBearerAuth 
} from '@nestjs/swagger';
import { PatientService } from './patient.service';
import { CreatePatientDto, PatientResponseDto } from './dto';

@ApiTags('Patients')
@Controller('patients')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Create a new patient',
    description: 'Creates a new patient account with the provided information'
  })
  @ApiBody({ 
    type: CreatePatientDto,
    description: 'Patient registration data'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Patient created successfully',
    type: PatientResponseDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - Invalid data provided'
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Conflict - Patient with this email already exists'
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Internal server error'
  })
  @UsePipes(new ValidationPipe({ 
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true
  }))
  async createPatient(@Body() createPatientDto: CreatePatientDto): Promise<PatientResponseDto> {
    return this.patientService.createPatient(createPatientDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Get all patients',
    description: 'Retrieves a list of all active patients'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Patients retrieved successfully',
    type: [PatientResponseDto]
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Internal server error'
  })
  async getAllPatients(): Promise<PatientResponseDto[]> {
    return this.patientService.getAllPatients();
  }
}
