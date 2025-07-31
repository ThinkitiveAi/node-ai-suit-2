-- AlterTable
ALTER TABLE "doctors" ALTER COLUMN "is_verified" DROP NOT NULL,
ALTER COLUMN "phone_number" DROP NOT NULL,
ALTER COLUMN "password_hash" DROP NOT NULL,
ALTER COLUMN "specialization" DROP NOT NULL,
ALTER COLUMN "years_of_experience" DROP NOT NULL,
ALTER COLUMN "clinic_address" DROP NOT NULL,
ALTER COLUMN "verification_status" DROP NOT NULL;

-- AlterTable
ALTER TABLE "patients" ALTER COLUMN "phone_number" DROP NOT NULL,
ALTER COLUMN "password_hash" DROP NOT NULL,
ALTER COLUMN "date_of_birth" DROP NOT NULL,
ALTER COLUMN "gender" DROP NOT NULL,
ALTER COLUMN "address" DROP NOT NULL,
ALTER COLUMN "email_verified" DROP NOT NULL,
ALTER COLUMN "phone_verified" DROP NOT NULL,
ALTER COLUMN "is_active" DROP NOT NULL;
