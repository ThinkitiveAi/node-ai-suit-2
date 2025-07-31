import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNumber, IsObject, IsOptional, Min, Max, Length, Matches, ValidateNested, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class ClinicAddressDto {
  @ApiProperty({
    description: 'Street address of the clinic',
    example: '123 Medical Center Dr',
    maxLength: 200,
  })
  @IsString()
  @Length(1, 200, { message: 'Street must be between 1 and 200 characters' })
  street: string;

  @ApiProperty({
    description: 'City where the clinic is located',
    example: 'New York',
    maxLength: 100,
  })
  @IsString()
  @Length(1, 100, { message: 'City must be between 1 and 100 characters' })
  city: string;

  @ApiProperty({
    description: 'State or province where the clinic is located',
    example: 'NY',
    maxLength: 50,
  })
  @IsString()
  @Length(1, 50, { message: 'State must be between 1 and 50 characters' })
  state: string;

  @ApiProperty({
    description: 'Postal/ZIP code of the clinic location',
    example: '10001',
    pattern: '^[0-9A-Za-z\\s-]{3,10}$',
  })
  @IsString()
  @Matches(/^[0-9A-Za-z\s-]{3,10}$/, { 
    message: 'ZIP code must be 3-10 characters and contain only letters, numbers, spaces, and hyphens' 
  })
  zip: string;
}

export class CreateDoctorDto {
  @ApiProperty({
    description: 'First name of the doctor',
    example: 'John',
    minLength: 2,
    maxLength: 50,
  })
  @IsString()
  @Length(2, 50, { message: 'First name must be between 2 and 50 characters' })
  first_name: string;

  @ApiProperty({
    description: 'Last name of the doctor',
    example: 'Doe',
    minLength: 2,
    maxLength: 50,
  })
  @IsString()
  @Length(2, 50, { message: 'Last name must be between 2 and 50 characters' })
  last_name: string;

  @ApiProperty({
    description: 'Email address of the doctor (must be unique)',
    example: 'john.doe@clinic.com',
    format: 'email',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @ApiProperty({
    description: 'Phone number of the doctor (must be unique)',
    example: '+1234567890',
    pattern: '^[+]?[0-9\\s()-]{10,20}$',
  })
  @IsString()
  @Matches(/^[+]?[0-9\s()-]{10,20}$/, { 
    message: 'Please provide a valid phone number (10-20 digits, may include +, spaces, parentheses, and hyphens)' 
  })
  phone_number: string;

  @ApiProperty({
    description: 'Password for the doctor account',
    example: 'SecurePassword123!',
    minLength: 8,
    pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$',
  })
  @IsString()
  @Length(8, 128, { message: 'Password must be between 8 and 128 characters' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  password: string;

  @ApiProperty({
    description: 'Confirmation of the password (must match password)',
    example: 'SecurePassword123!',
  })
  @IsString()
  confirm_password: string;

  @ApiProperty({
    description: 'Medical specialization of the doctor',
    example: 'Cardiology',
    minLength: 3,
    maxLength: 100,
  })
  @IsString()
  @Length(3, 100, { message: 'Specialization must be between 3 and 100 characters' })
  specialization: string;

  @ApiProperty({
    description: 'Medical license number (must be unique and alphanumeric)',
    example: 'MD123456789',
    pattern: '^[A-Za-z0-9]{5,20}$',
  })
  @IsString()
  @Matches(/^[A-Za-z0-9]{5,20}$/, { 
    message: 'License number must be 5-20 characters and contain only letters and numbers' 
  })
  license_number: string;

  @ApiProperty({
    description: 'Number of years of medical experience',
    example: 10,
    minimum: 0,
    maximum: 50,
  })
  @IsNumber()
  @Min(0, { message: 'Years of experience must be at least 0' })
  @Max(50, { message: 'Years of experience cannot exceed 50' })
  @Type(() => Number)
  years_of_experience: number;

  @ApiProperty({
    description: 'Clinic address information',
    type: ClinicAddressDto,
  })
  @IsObject()
  @ValidateNested()
  @Type(() => ClinicAddressDto)
  clinic_address: ClinicAddressDto;

  @ApiProperty({
    description: 'Whether the doctor is verified (optional, defaults to false)',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  is_verified?: boolean;
}

export class DoctorResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the doctor',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'First name of the doctor',
    example: 'John',
  })
  first_name: string;

  @ApiProperty({
    description: 'Last name of the doctor',
    example: 'Doe',
  })
  last_name: string;

  @ApiProperty({
    description: 'Email address of the doctor',
    example: 'john.doe@clinic.com',
  })
  email: string;

  @ApiProperty({
    description: 'Phone number of the doctor',
    example: '+1234567890',
  })
  phone_number: string;

  @ApiProperty({
    description: 'Medical specialization of the doctor',
    example: 'Cardiology',
  })
  specialization: string;

  @ApiProperty({
    description: 'Medical license number',
    example: 'MD123456789',
  })
  license_number: string;

  @ApiProperty({
    description: 'Number of years of medical experience',
    example: 10,
  })
  years_of_experience: number;

  @ApiProperty({
    description: 'Clinic address information',
    type: ClinicAddressDto,
  })
  clinic_address: ClinicAddressDto;

  @ApiProperty({
    description: 'Verification status of the doctor',
    example: 'PENDING',
    enum: ['PENDING', 'VERIFIED', 'REJECTED'],
  })
  verification_status: string;

  @ApiProperty({
    description: 'Whether the doctor is verified',
    example: false,
  })
  is_verified: boolean;

  @ApiProperty({
    description: 'Whether the doctor account is active',
    example: true,
  })
  is_active: boolean;

  @ApiProperty({
    description: 'Timestamp when the doctor was created',
    example: '2024-01-15T10:30:00Z',
  })
  created_at: Date;

  @ApiProperty({
    description: 'Timestamp when the doctor was last updated',
    example: '2024-01-15T10:30:00Z',
  })
  updated_at: Date;
}
