import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Gender } from './create-patient.dto';

export class PatientResponseDto {
  @ApiProperty({ description: 'Patient unique identifier' })
  id: number;

  @ApiProperty({ description: 'Patient first name' })
  first_name: string;

  @ApiProperty({ description: 'Patient last name' })
  last_name: string;

  @ApiProperty({ description: 'Patient email address' })
  email: string;

  @ApiPropertyOptional({ description: 'Patient phone number' })
  phone_number?: string;

  @ApiPropertyOptional({ description: 'Patient date of birth' })
  date_of_birth?: Date;

  @ApiPropertyOptional({ description: 'Patient gender', enum: Gender })
  gender?: Gender;

  @ApiPropertyOptional({ description: 'Patient address information' })
  address?: any;

  @ApiPropertyOptional({ description: 'Emergency contact information' })
  emergency_contact?: any;

  @ApiPropertyOptional({ description: 'Medical history as array of strings' })
  medical_history?: string[];

  @ApiPropertyOptional({ description: 'Insurance information' })
  insurance_info?: any;

  @ApiPropertyOptional({ description: 'Email verification status' })
  email_verified?: boolean;

  @ApiPropertyOptional({ description: 'Phone verification status' })
  phone_verified?: boolean;

  @ApiProperty({ description: 'Patient active status' })
  is_active: boolean;

  @ApiProperty({ description: 'Record creation timestamp' })
  created_at: Date;

  @ApiProperty({ description: 'Record last update timestamp' })
  updated_at: Date;

  @ApiPropertyOptional({ description: 'Associated user ID' })
  user_id?: number;
} 