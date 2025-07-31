import { IsEmail, IsString, IsOptional, IsDateString, IsEnum, IsArray, IsObject, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
  PREFER_NOT_TO_SAY = 'PREFER_NOT_TO_SAY'
}

export class AddressDto {
  @ApiPropertyOptional({ description: 'Street address' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  street?: string;

  @ApiPropertyOptional({ description: 'City' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string;

  @ApiPropertyOptional({ description: 'State/Province' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  state?: string;

  @ApiPropertyOptional({ description: 'ZIP/Postal code' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  zipCode?: string;

  @ApiPropertyOptional({ description: 'Country' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  country?: string;
}

export class EmergencyContactDto {
  @ApiPropertyOptional({ description: 'Emergency contact name' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({ description: 'Emergency contact relationship' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  relationship?: string;

  @ApiPropertyOptional({ description: 'Emergency contact phone number' })
  @IsOptional()
  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'Invalid phone number format' })
  phoneNumber?: string;
}

export class InsuranceInfoDto {
  @ApiPropertyOptional({ description: 'Insurance provider name' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  provider?: string;

  @ApiPropertyOptional({ description: 'Insurance policy number' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  policyNumber?: string;

  @ApiPropertyOptional({ description: 'Insurance group number' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  groupNumber?: string;

  @ApiPropertyOptional({ description: 'Insurance expiration date' })
  @IsOptional()
  @IsDateString()
  expirationDate?: string;
}

export class CreatePatientDto {
  @ApiProperty({ description: 'Patient email address' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @ApiProperty({ description: 'Patient password' })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(128, { message: 'Password must not exceed 128 characters' })
  password: string;

  @ApiProperty({ description: 'Password confirmation' })
  @IsString()
  confirm_password: string;

  @ApiProperty({ description: 'Patient first name' })
  @IsString()
  @MinLength(2, { message: 'First name must be at least 2 characters long' })
  @MaxLength(50, { message: 'First name must not exceed 50 characters' })
  first_name: string;

  @ApiProperty({ description: 'Patient last name' })
  @IsString()
  @MinLength(2, { message: 'Last name must be at least 2 characters long' })
  @MaxLength(50, { message: 'Last name must not exceed 50 characters' })
  last_name: string;

  @ApiPropertyOptional({ description: 'Patient phone number' })
  @IsOptional()
  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'Invalid phone number format' })
  phone_number?: string;

  @ApiPropertyOptional({ description: 'Patient date of birth' })
  @IsOptional()
  @IsDateString({}, { message: 'Invalid date format' })
  date_of_birth?: string;

  @ApiPropertyOptional({ description: 'Patient gender', enum: Gender })
  @IsOptional()
  @IsEnum(Gender, { message: 'Invalid gender value' })
  gender?: Gender;

  @ApiPropertyOptional({ description: 'Patient address', type: AddressDto })
  @IsOptional()
  @IsObject()
  address?: AddressDto;

  @ApiPropertyOptional({ description: 'Emergency contact information', type: EmergencyContactDto })
  @IsOptional()
  @IsObject()
  emergency_contact?: EmergencyContactDto;

  @ApiPropertyOptional({ description: 'Medical history as array of strings' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  medical_history?: string[];

  @ApiPropertyOptional({ description: 'Insurance information', type: InsuranceInfoDto })
  @IsOptional()
  @IsObject()
  insurance_info?: InsuranceInfoDto;
} 