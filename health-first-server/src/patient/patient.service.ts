import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { BaseService } from 'src/common/base.service';
import { CreatePatientDto, PatientResponseDto } from './dto';

@Injectable()
export class PatientService extends BaseService {
    constructor(private readonly prisma: PrismaClient) {
        super(PatientService.name);
    }

    async createPatient(createPatientDto: CreatePatientDto): Promise<PatientResponseDto> {
        try {
            const { 
                email, 
                password, 
                confirm_password,
                first_name,
                last_name,
                phone_number,
                date_of_birth,
                gender,
                address,
                emergency_contact,
                medical_history,
                insurance_info
            } = createPatientDto;

            // Validate required fields
            this.validateRequired(email, 'email');
            this.validateRequired(first_name, 'first_name');
            this.validateRequired(last_name, 'last_name');
            this.validateRequired(password, 'password');

            // Validate email format
            this.validateEmail(email);

            // Validate password confirmation
            if (password !== confirm_password) {
                this.throwBadRequestError('Password and confirm password do not match');
            }

            // Validate phone number if provided
            if (phone_number) {
                this.validatePhoneNumber(phone_number);
            }

            // Validate date of birth if provided
            if (date_of_birth) {
                this.validateDate(date_of_birth, 'date_of_birth');
            }

            // Validate gender if provided
            if (gender) {
                this.validateEnum(gender, ['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY'], 'gender');
            }

            // Check if patient with email already exists
            const existingPatient = await this.prisma.patient.findUnique({
                where: { email }
            });

            if (existingPatient) {
                this.throwConflictError('Patient with this email already exists');
            }

            // Hash password (you might want to use bcrypt or similar)
            const password_hash = password; // TODO: Implement proper password hashing

            // Create patient
            const patient = await this.prisma.patient.create({
                data: {
                    email,
                    password_hash,
                    first_name,
                    last_name,
                    phone_number,
                    date_of_birth: date_of_birth ? new Date(date_of_birth) : null,
                    gender,
                    address: address as any,
                    emergency_contact: emergency_contact as any,
                    medical_history: medical_history || [],
                    insurance_info: insurance_info as any,
                    email_verified: false,
                    phone_verified: false,
                    is_active: true
                }
            });

            this.logInfo('Patient created successfully', { patientId: patient.id, email });
            
            // Return patient data without password
            const { password_hash: _, ...patientData } = patient;
            return patientData as PatientResponseDto;

        } catch (error) {
            this.logError('Error creating patient', error);
            this.handleError(error, 'Failed to create patient');
        }
    }

    async getAllPatients(): Promise<PatientResponseDto[]> {
        try {
            const patients = await this.prisma.patient.findMany({
                where: {
                    is_active: true
                },
                select: {
                    id: true,
                    first_name: true,
                    last_name: true,
                    email: true,
                    phone_number: true,
                    date_of_birth: true,
                    gender: true,
                    address: true,
                    emergency_contact: true,
                    medical_history: true,
                    insurance_info: true,
                    email_verified: true,
                    phone_verified: true,
                    is_active: true,
                    created_at: true,
                    updated_at: true,
                    user_id: true
                },
                orderBy: {
                    created_at: 'desc'
                }
            });

            this.logInfo('Retrieved all patients', { count: patients.length });
            return patients as PatientResponseDto[];

        } catch (error) {
            this.logError('Error retrieving patients', error);
            this.handleError(error, 'Failed to retrieve patients');
        }
    }
}
