import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import { BaseService } from 'src/common/base.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService extends BaseService{
    constructor(private readonly prisma: PrismaClient,
        private readonly jwtService: JwtService

    ) {
        super(AuthService.name);
    }


    async providerLogin(providerLoginDto: any): Promise<any> {
        try {
            const { email, password } = providerLoginDto;

            const provider = await this.prisma.doctor.findUnique({
                where: { email }
            });

            if (!provider) {
                throw new UnauthorizedException('Invalid credentials');
            }

            const isPasswordValid = await bcrypt.compare(password, provider.password_hash);
            if (!isPasswordValid) {
              throw new UnauthorizedException("Invalid credentials");
            }

            if (!provider.is_verified) {
                throw new UnauthorizedException('Provider not verified');
            }

            if (!provider.is_active) {
                throw new UnauthorizedException('Provider not active');
            }

            const payload = {
                providerId: provider.id,
                email: provider.email,
                role: 'provider',
              };

            const access_token = await this.jwtService.sign(payload, {
                secret: process.env.JWTSECRET,
                expiresIn: "1h",
              });

            return {
                access_token: access_token,
                provider: provider
            };
        } catch (error) {
            this.logError('Error logging in', error);
        }
    }

   
}
