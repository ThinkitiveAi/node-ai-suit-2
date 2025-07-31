import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, Length } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Email address for login',
    example: 'john.doe@clinic.com',
    format: 'email',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @ApiProperty({
    description: 'Password for login',
    example: 'SecurePassword123!',
    minLength: 8,
  })
  @IsString()
  @Length(8, 128, { message: 'Password must be between 8 and 128 characters' })
  password: string;
}

export class LoginResponseDto {
  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;

  @ApiProperty({
    description: 'Provider/Doctor information',
    additionalProperties: true,
  })
  provider: any;
} 