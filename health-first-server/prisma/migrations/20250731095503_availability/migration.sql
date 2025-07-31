-- CreateTable
CREATE TABLE "provider_locations" (
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "place_of_service" TEXT,
    "speciality_type" TEXT,
    "email" TEXT,
    "group_npi_number" INTEGER,
    "fax" TEXT,
    "information" TEXT,
    "timezone" TEXT,
    "contact_number" INTEGER,
    "contact_person" TEXT,
    "physical_address_1" TEXT NOT NULL,
    "physical_address_2" TEXT,
    "physical_address_city" TEXT NOT NULL,
    "physical_address_state" TEXT NOT NULL,
    "physical_address_country" TEXT,
    "physical_address_zip" TEXT NOT NULL,
    "billing_address_1" TEXT,
    "billing_address_2" TEXT,
    "billing_address_city" TEXT,
    "billing_address_state" TEXT,
    "billing_address_country" TEXT,
    "billing_address_zip" TEXT,
    "office_hours" JSON,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "provider_id" INTEGER,
    "location_id" TEXT,
    "id_qualifier" TEXT,
    "number" INTEGER,
    "status" BOOLEAN,
    "image_path" TEXT,

    CONSTRAINT "provider_locations_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "provider_availability" (
    "uuid" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "provider_id" INTEGER,
    "booking_window" INTEGER NOT NULL,
    "time_zone" TEXT DEFAULT 'IST',
    "new_appointment_time" INTEGER,
    "follow_up_appointment_time" INTEGER,
    "buffer_time" INTEGER NOT NULL,
    "prevent_appointment" JSONB,
    "minimum_scheduling_threshold" INTEGER NOT NULL,
    "minimum_scheduling_threshold_description" TEXT NOT NULL,

    CONSTRAINT "provider_availability_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "provider_availability_slots" (
    "uuid" TEXT NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "day" TEXT NOT NULL,
    "start_time" TEXT NOT NULL,
    "end_time" TEXT NOT NULL,
    "provider_availability_id" TEXT NOT NULL,
    "availability_location_id" TEXT,
    "virtual" BOOLEAN,
    "date" TIMESTAMP(3) NOT NULL,
    "is_single_day_slot" BOOLEAN,

    CONSTRAINT "provider_availability_slots_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "availability_block_days" (
    "uuid" TEXT NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date" DATE NOT NULL,
    "start_time" TEXT,
    "end_time" TEXT,
    "location_id" TEXT,
    "reason" TEXT,
    "provider_availability_id" TEXT NOT NULL,
    "full_day_block" BOOLEAN,

    CONSTRAINT "availability_block_days_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "_PatientToprovider_locations" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PatientToprovider_locations_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "provider_availability_provider_id_key" ON "provider_availability"("provider_id");

-- CreateIndex
CREATE INDEX "_PatientToprovider_locations_B_index" ON "_PatientToprovider_locations"("B");

-- AddForeignKey
ALTER TABLE "provider_locations" ADD CONSTRAINT "provider_locations_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "doctors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "provider_availability" ADD CONSTRAINT "provider_availability_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "doctors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "provider_availability_slots" ADD CONSTRAINT "provider_availability_slots_provider_availability_id_fkey" FOREIGN KEY ("provider_availability_id") REFERENCES "provider_availability"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "provider_availability_slots" ADD CONSTRAINT "provider_availability_slots_availability_location_id_fkey" FOREIGN KEY ("availability_location_id") REFERENCES "provider_locations"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "availability_block_days" ADD CONSTRAINT "availability_block_days_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "provider_locations"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "availability_block_days" ADD CONSTRAINT "availability_block_days_provider_availability_id_fkey" FOREIGN KEY ("provider_availability_id") REFERENCES "provider_availability"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PatientToprovider_locations" ADD CONSTRAINT "_PatientToprovider_locations_A_fkey" FOREIGN KEY ("A") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PatientToprovider_locations" ADD CONSTRAINT "_PatientToprovider_locations_B_fkey" FOREIGN KEY ("B") REFERENCES "provider_locations"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
