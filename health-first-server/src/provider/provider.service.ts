import { Injectable, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { BaseService } from 'src/common/base.service';
import { CreateDoctorDto } from './dto/provider.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ProviderService extends BaseService {
    constructor(private readonly prisma: PrismaClient) {
        super(ProviderService.name);
    }

    async createProvider(createDoctorDto: CreateDoctorDto): Promise<any> {
        try {
            this.logInfo('Creating new doctor provider', { email: createDoctorDto.email });

            // Validate password confirmation
            if (createDoctorDto.password !== createDoctorDto.confirm_password) {
                throw new BadRequestException('Password and confirm password do not match');
            }

            // Check if email already exists
            const existingEmail = await this.prisma.doctor.findUnique({
                where: { email: createDoctorDto.email }
            });

            if (existingEmail) {
                throw new ConflictException('A doctor with this email already exists');
            }

            // Check if phone number already exists
            const existingPhone = await this.prisma.doctor.findUnique({
                where: { phone_number: createDoctorDto.phone_number }
            });

            if (existingPhone) {
                throw new ConflictException('A doctor with this phone number already exists');
            }

            // Check if license number already exists
            const existingLicense = await this.prisma.doctor.findUnique({
                where: { license_number: createDoctorDto.license_number }
            });

            if (existingLicense) {
                throw new ConflictException('A doctor with this license number already exists');
            }

            const hashedPassword = await bcrypt.hash(createDoctorDto.password, 10);


            // Create the doctor record
            const doctor = await this.prisma.doctor.create({
                data: {
                    first_name: createDoctorDto.first_name,
                    last_name: createDoctorDto.last_name,
                    email: createDoctorDto.email,
                    phone_number: createDoctorDto.phone_number,
                    password_hash: hashedPassword, // We'll handle password hashing later
                    specialization: createDoctorDto.specialization,
                    license_number: createDoctorDto.license_number,
                    years_of_experience: createDoctorDto.years_of_experience,
                    clinic_address: createDoctorDto.clinic_address as any,
                    is_verified: createDoctorDto.is_verified || false,
                    verification_status: 'PENDING',
                    is_active: true,
                }
            });

            this.logInfo('Doctor provider created successfully', { id: doctor.id, email: doctor.email });

            // Return the response DTO (excluding password_hash)
            return {
                "success": true,
                "message": "Provider registered successfully. Verification email sent.",
                "data": {
                  "provider_id": doctor.id,
                  "email": doctor.email,
                  "verification_status": doctor.verification_status
                }
              }
              

        } catch (error) {
            this.logError('Error creating doctor provider', error);
            this.handleError(error, 'Failed to create doctor provider');
        }
    }

    async getProviderById(id: number): Promise<any> {
        try {
            const doctor = await this.prisma.doctor.findUnique({
                where: { id }
            });

            if (!doctor) {
                throw new BadRequestException('Doctor not found');
            }

            return {
                id: doctor.id,
                first_name: doctor.first_name,
                last_name: doctor.last_name,
                email: doctor.email,
                phone_number: doctor.phone_number,
                specialization: doctor.specialization,
                license_number: doctor.license_number,
                years_of_experience: doctor.years_of_experience,
                clinic_address: doctor.clinic_address as any,
                verification_status: doctor.verification_status,
                is_verified: doctor.is_verified,
                is_active: doctor.is_active,
                created_at: doctor.created_at,
                updated_at: doctor.updated_at,
            };

        } catch (error) {
            this.logError('Error fetching doctor provider', error);
            this.handleError(error, 'Failed to fetch doctor provider');
        }
    }

    async getAllProviders(): Promise<any[]> {
        try {
            const doctors = await this.prisma.doctor.findMany({
                where: { is_active: true },
                orderBy: { created_at: 'desc' }
            });

            return doctors;

        } catch (error) {
            this.logError('Error fetching all doctor providers', error);
            this.handleError(error, 'Failed to fetch doctor providers');
        }
    }
}
