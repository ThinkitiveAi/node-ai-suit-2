-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY');

-- CreateTable
CREATE TABLE "users_user" (
    "id" SERIAL NOT NULL,
    "password" VARCHAR(128),
    "last_login" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "is_superuser" BOOLEAN,
    "username" VARCHAR(150),
    "is_staff" BOOLEAN,
    "is_active" BOOLEAN,
    "date_joined" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "uuid" UUID,
    "email" VARCHAR(254),
    "first_name" VARCHAR(255),
    "last_name" VARCHAR(255),
    "is_admin" BOOLEAN,
    "is_provider" BOOLEAN,
    "is_patient" BOOLEAN,
    "picture" TEXT,
    "is_deleted" BOOLEAN DEFAULT false,

    CONSTRAINT "users_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doctors" (
    "id" SERIAL NOT NULL,
    "first_name" VARCHAR(50) NOT NULL,
    "last_name" VARCHAR(50) NOT NULL,
    "email" VARCHAR(254) NOT NULL,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "phone_number" VARCHAR(20) NOT NULL,
    "password_hash" TEXT NOT NULL,
    "specialization" VARCHAR(100) NOT NULL,
    "license_number" VARCHAR(50) NOT NULL,
    "years_of_experience" INTEGER NOT NULL DEFAULT 0,
    "clinic_address" JSONB NOT NULL,
    "verification_status" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "license_document_url" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "user_id" INTEGER,

    CONSTRAINT "doctors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patients" (
    "id" SERIAL NOT NULL,
    "first_name" VARCHAR(50) NOT NULL,
    "last_name" VARCHAR(50) NOT NULL,
    "email" VARCHAR(254) NOT NULL,
    "phone_number" VARCHAR(20) NOT NULL,
    "password_hash" TEXT NOT NULL,
    "date_of_birth" DATE NOT NULL,
    "gender" "Gender" NOT NULL DEFAULT 'PREFER_NOT_TO_SAY',
    "address" JSONB NOT NULL,
    "emergency_contact" JSONB,
    "medical_history" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "insurance_info" JSONB,
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "phone_verified" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "user_id" INTEGER,

    CONSTRAINT "patients_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_user_username_key" ON "users_user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_user_uuid_key" ON "users_user"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "users_user_email_key" ON "users_user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "doctors_email_key" ON "doctors"("email");

-- CreateIndex
CREATE UNIQUE INDEX "doctors_phone_number_key" ON "doctors"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "doctors_license_number_key" ON "doctors"("license_number");

-- CreateIndex
CREATE INDEX "doctors_user_id_idx" ON "doctors"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "patients_email_key" ON "patients"("email");

-- CreateIndex
CREATE UNIQUE INDEX "patients_phone_number_key" ON "patients"("phone_number");

-- CreateIndex
CREATE INDEX "patients_user_id_idx" ON "patients"("user_id");

-- AddForeignKey
ALTER TABLE "doctors" ADD CONSTRAINT "doctors_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users_user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patients" ADD CONSTRAINT "patients_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users_user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
