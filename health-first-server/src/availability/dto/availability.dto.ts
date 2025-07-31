import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min, ValidateIf, ValidateNested } from "class-validator";

export enum weekDays {
    Sunday = "Sunday",
    Monday = "Monday",
    Tuesday = "Tuesday",
    Wednesday = "Wednesday",
    Thursday = "Thursday",
    Friday = "Friday",
    Saturday = "Saturday",
  }



export class ProviderAvailabilityBlockDays {
    @IsString()
    @IsOptional()
    @ApiProperty({ type: Date, required: false })
    blockDaysDate: Date;
  
    @IsBoolean()
    @IsOptional()
    @ApiProperty({ type: Boolean, required: false })
    fullDayBlock: boolean;
  
    @IsString()
    @ValidateIf((o) => !o.fullDayBlock) // Validate only if fullDayBlock is false
    @IsNotEmpty({
      message:
        "blockDaysStartTime is required when the when full day is not blocked",
    })
    @ApiProperty({ required: false })
    blockDaysStartTime: string;
  
    @IsString()
    @ValidateIf((o) => !o.fullDayBlock) // Validate only if fullDayBlock is false
    @IsNotEmpty({
      message:
        "blockDaysEndTime is required when the when full day is not blocked",
    })
    @ApiProperty({ required: false })
    blockDaysEndTime: string;
  }




export class AvailabilitySlotsDto {
    @IsEnum(weekDays)
    @IsNotEmpty()
    @ApiProperty({
      enum: weekDays,
      enumName: "weekDays",
      example: weekDays.Monday,
    })
    day: string;
  
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ required: false })
    startTime: string;
  
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ required: false })
    endTime: string;
  
    @IsBoolean()
    @IsOptional()
    @ApiProperty({ required: false, type: Boolean })
    virtual: boolean;
  
    @IsString()
    @IsOptional()
    // @IsNotEmpty({
    //   message: "availabilityLocationId is required when the slot is in person",
    // })
    @ApiProperty({ required: false })
    availabilityLocationId: string;
  }


  export class CreateProviderAvailabilityDto {
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ required: true })
    providerId: number;
  
    @IsNumber()
    @IsNotEmpty()
    @Min(1, { message: "bookingWindow must be greater than 0" })
    @ApiProperty({ required: true })
    bookingWindow: number;
  
    @IsString()
    @IsOptional()
    @ApiProperty({ required: false })
    timeZone: string;
  
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ required: true })
    newAppointmentTime: number;
  
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ required: true })
    followUpAppointmentTime: number;
  
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ required: true })
    bufferTime: number;
  
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => AvailabilitySlotsDto) // Create a separate DTO for day, startTime, endTime
    @ApiProperty({ type: [AvailabilitySlotsDto], required: true })
    availabilitySlots: AvailabilitySlotsDto[];
  
    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => ProviderAvailabilityBlockDays)
    @ApiProperty({ type: [ProviderAvailabilityBlockDays], required: false })
    blockDays: ProviderAvailabilityBlockDays[];
  
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ required: true })
    minimumSchedulingThreshold: number;
  
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ required: true })
    minimumSchedulingThresholdDescription: string;
  }


  export class GetAvailabilityDto {
    @IsArray()
    @IsOptional()
    @ApiProperty({
      type: [String],
      default: [],
      description: "locationIds",
      required: false,
    })
    locationIds: string[];
  }