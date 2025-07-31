import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { BaseService } from 'src/common/base.service';
import * as moment from "moment";
import { CreateProviderAvailabilityDto, GetAvailabilityDto } from './dto/availability.dto';


@Injectable()
export class AvailabilityService extends BaseService {
    constructor(
        private readonly prisma: PrismaClient,
    ) {
        super(AvailabilityService.name);
    }

    private async rollbackAvailability(availabilityId: string) {
        try {
          await this.prisma.provider_availability.delete({
            where: { uuid: availabilityId },
            include: {
              provider_availability_slots: {},
              availability_block_days: {},
            },
          });
        } catch (error) {
          console.log("error:", error);
          throw new BadRequestException(error);
        }
      }

       async rollbackAvailabilitySlots(availabilityId: string) {
        try {
          await this.prisma.provider_availability.delete({
            where: { uuid: availabilityId },
            include: {
              provider_availability_slots: {},
              availability_block_days: {},
            },
          });
        } catch (error) {
          console.log("error:", error);
          throw new BadRequestException(error);
        }
      }

      getDatesOfWeekdayInRange(
        dayIndex: number,
        weeksCount: number,
        blockDays: any,
      ) {
        const currentDate = new Date();
        console.log("currentDate:>", currentDate);
        const currentDay = currentDate.getDay();
        let daysToAdd = (dayIndex - currentDay + 7) % 7;
        if (daysToAdd === 0) daysToAdd = 7;
    
        currentDate.setDate(currentDate.getDate() + daysToAdd);
    
        const result:any[] = [];
        for (let i = 0; i < weeksCount; i++) {
          const newDate = new Date(currentDate);
          newDate.setDate(newDate.getDate() + 7 * i);
          const formattedDate:any = moment(newDate).format();
          if (!this.isDateBlocked(formattedDate, blockDays)) {
            result.push(formattedDate);
          }
        }
        return result;
      }


      isDateBlocked(date: string, blockDays: any) {
        const dateIsInBlockDate =
          blockDays.filter((blockDay: any) =>
            moment(date).isSame(blockDay.blockDaysDate, "day"),
          ).length > 0;
    
        console.log("dateIsInBlockDate:", dateIsInBlockDate);
        return dateIsInBlockDate;
      }

      async createProviderAvailability(
        createProviderAvailabilityDto: CreateProviderAvailabilityDto,
      ) {
        console.log(
          "createProviderAvailabilityDto:",
          createProviderAvailabilityDto,
        );
        let prisma = null;
        try {
          
    
          const provider = await this.prisma.doctor.findUnique({
            where: {
              id: createProviderAvailabilityDto.providerId,
            },
          });
          if (!provider)
            throw new BadRequestException(
              `Provider with uuid ${createProviderAvailabilityDto.providerId} not found`,
            );
          const providerId = provider.id;
    
          const availabilityExist:any = await this.prisma.provider_availability.findFirst({
            where: { providerId },
          });
          console.log("availabilityExist:", availabilityExist);
    
          if (availabilityExist)
            await this.rollbackAvailability(availabilityExist.uuid);
    
          if (createProviderAvailabilityDto.availabilitySlots?.length === 0)
            throw new BadRequestException("Avalability slots cannot be empty");
    
          const providerAvailability:any = await this.prisma.provider_availability.create({
            data: {
              providerId: providerId,
              bookingWindow: createProviderAvailabilityDto.bookingWindow,
              timeZone: createProviderAvailabilityDto.timeZone,
              newAppointmentTime: createProviderAvailabilityDto.newAppointmentTime,
              followUpAppointmentTime:
                createProviderAvailabilityDto.followUpAppointmentTime,
              bufferTime: createProviderAvailabilityDto.bufferTime,
              minimumSchedulingThresholdDescription:
                createProviderAvailabilityDto.minimumSchedulingThresholdDescription,
              minimumSchedulingThreshold:
                createProviderAvailabilityDto.minimumSchedulingThreshold,
            },
          });
          console.log("providerAvailability created:", providerAvailability);
    
          const providerSlots:any[] = [];
          for (const slot of createProviderAvailabilityDto.availabilitySlots) {
            const slotExistForThatDay =
              await this.prisma.provider_availability_slots.findMany({
                where: {
                  day: slot.day,
                  providerAvailabilityId: providerAvailability.uuid,
                },
              });
            console.log("slotExistForThatDay:", slotExistForThatDay);
    
            if (slotExistForThatDay.length > 0) {
              for (const existingSlot of slotExistForThatDay) {
                if (
                  this.hasOverlap(
                    this.convertTo24HourFormat(slot.startTime),
                    this.convertTo24HourFormat(slot.endTime),
                    this.convertTo24HourFormat(existingSlot.startTime),
                    this.convertTo24HourFormat(existingSlot.endTime),
                  ) ||
                  slot.startTime === slot.endTime
                ) {
                  await this.rollbackAvailability(
                    providerAvailability.uuid,
                  );
                  throw new BadRequestException(
                    `Having conflicts with time for ${slot.day} Slots`,
                  );
                }
              }
            }
    
            const slotsObjectToCreate: any = [];
            const dates = this.getDatesOfWeekdayInRange(
              this.getDayIndex(slot.day),
              createProviderAvailabilityDto.bookingWindow,
              createProviderAvailabilityDto.blockDays,
            );
            console.log("dates:", dates);
    
            for (let i = 0; i < dates.length; i++) {
              slotsObjectToCreate.push({
                date: dates[i],
                day: slot.day,
                startTime: slot.startTime,
                endTime: slot.endTime,
                providerAvailabilityId: providerAvailability.uuid,
              });
              if (slot.availabilityLocationId) {
                const locationExist:any = await this.prisma.provider_locations.findUnique({
                  where: { uuid: slot.availabilityLocationId },
                });
                console.log("locationExist:", locationExist);
                if (!locationExist) {
                  await this.rollbackAvailability(
                    providerAvailability.uuid,
                  );
                  throw new BadRequestException(
                    `Provider group location with uuid ${slot.availabilityLocationId} not exist`,
                  );
                }
              }
              slotsObjectToCreate[i].availabilityLocationId =
                slot.availabilityLocationId;
              if (slot.virtual) slotsObjectToCreate[i].virtual = slot.virtual;
              console.log("slotsObjectToCreate:", slotsObjectToCreate);
            }
    
            providerSlots.push(
              await this.prisma.provider_availability_slots.createMany({
                data: slotsObjectToCreate,
              }),
            );
            console.log("providerSlots:", providerSlots);
          }
    
          const blockDays:any[] = [];
          if (createProviderAvailabilityDto.blockDays?.length > 0) {
            for (
              let i = 0;
              i < createProviderAvailabilityDto.blockDays.length;
              i++
            ) {
              const objectToCreate: any = {
                date: createProviderAvailabilityDto.blockDays[i].blockDaysDate,
                providerAvailabilityId: providerAvailability.uuid,
                fullDayBlock:
                  createProviderAvailabilityDto.blockDays[i].fullDayBlock,
              };
    
              if (!createProviderAvailabilityDto.blockDays[i].fullDayBlock) {
                objectToCreate.startTime =
                  createProviderAvailabilityDto.blockDays[i].blockDaysStartTime;
    
                objectToCreate.endTime =
                  createProviderAvailabilityDto.blockDays[i].blockDaysEndTime;
              }
    
              blockDays.push(
                await this.prisma.availability_block_days.create({
                  data: objectToCreate,
                }),
              );
            }
          }
    
          return {
            message: "Provider availability created successfully!",
            success: true,
            data: {
              providerAvailability,
              availableSlots: providerSlots,
              blockDays: blockDays,
            },
          };
        } catch (error) {
          console.log("error:", error);
          throw new BadRequestException(error.message);
        }
      }

      getDayIndex(dayName: string) {
        const weekdays = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];
        const index = weekdays.findIndex(
          (day) => day.toLowerCase() === dayName.toLowerCase(),
        );
        return index;
      }

      hasOverlap(startTime1: any, endTime1: any, startTime2: any, endTime2: any) {
        return !(endTime1 < startTime2 || endTime2 < startTime1);
      }

      convertTo24HourFormat(time12h: string) {
        const [time, modifier] = time12h.split(" ");
        // eslint-disable-next-line prefer-const
        let [hours, minutes] = time.split(":");
    
        if (hours === "12") {
          hours = "00";
        }
    
        if (modifier === "PM") {
          hours = String(parseInt(hours, 10) + 12);
        }
    
        return `${hours}:${minutes}`;
      }

    
      async getProviderAvailability(
        providerId: number,
        getAvailabilityDto: GetAvailabilityDto,
      ) {
        try {
          
          const providerAvailability:any = await this.prisma.provider_availability.findMany({
            where: {
              providerId,
              provider_availability_slots: {
                some: {
                  availabilityLocationId: {
                    in: getAvailabilityDto.locationIds,
                  },
                },
              },
            },
            include: {
              provider_availability_slots: {
                where: {
                  availabilityLocationId: {
                    in: getAvailabilityDto.locationIds,
                  },
                },
                include: { availabilityLocation: {} },
              },
              availability_block_days: {},
            },
          });
    
          return {
            message: "Provider availability fetched successfully",
            success: true,
            data: providerAvailability,
          };
        } catch (error) {
          console.log("error:", error);
          throw new BadRequestException(error);
        } 
      }
}
