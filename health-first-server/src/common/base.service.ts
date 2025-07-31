import {
    Injectable,
    Logger,
    NotFoundException,
    BadRequestException,
    InternalServerErrorException,
    UnauthorizedException,
    ConflictException,
    ForbiddenException,
  } from "@nestjs/common";
  import { v4 as uuidv4 } from "uuid";
  import * as jwt from 'jsonwebtoken';
  import {
    PrismaClientKnownRequestError,
    PrismaClientValidationError,
    PrismaClientInitializationError,
    PrismaClientRustPanicError,
  } from "@prisma/client/runtime/library";
  
  @Injectable()
  export class BaseService {
    protected readonly logger: Logger;
  
    constructor(context: string) {
      this.logger = new Logger(context);
    }
  
    protected handleError(error: any, customMessage?: string): never {
      console.log("🚀 ~ BaseService ~ handleError ~ error:", error);
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException ||
        error instanceof InternalServerErrorException ||
        error instanceof UnauthorizedException ||
        error instanceof ConflictException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
  
      // Handle Prisma specific errors
      if (error instanceof PrismaClientKnownRequestError) {
        switch (error.code) {
          case "P2002": // Unique constraint violation
            throw new BadRequestException(
              customMessage || "A record with this identifier already exists",
            );
          case "P2025": // Record not found
            throw new NotFoundException(customMessage || "Record not found");
          case "P2003": // Foreign key constraint violation
            throw new BadRequestException(
              customMessage || "Related record does not exist",
            );
          case "P2014": // Invalid ID
            throw new BadRequestException(customMessage || "Invalid ID provided");
          case "P2016": // Query interpretation error
            throw new BadRequestException(
              customMessage || "Invalid query parameters",
            );
          case "P2024": // Connection timeout
            throw new InternalServerErrorException(
              customMessage || "Database timeout",
            );
          default:
            throw new InternalServerErrorException(
              customMessage || "Database operation failed",
            );
        }
      }
  
      // Handle validation errors
      if (error instanceof PrismaClientValidationError) {
        throw new BadRequestException(customMessage || "Invalid data provided");
      }
  
      // Handle initialization errors
      if (error instanceof PrismaClientInitializationError) {
        throw new InternalServerErrorException(
          customMessage || "Database initialization failed",
        );
      }
  
      // Handle generic Prisma errors
      if (error instanceof PrismaClientRustPanicError) {
        throw new InternalServerErrorException(
          customMessage || "Critical database error occurred",
        );
      }
  
      // Handle unknown errors
      throw new InternalServerErrorException(
        customMessage || "An unexpected error occurred",
      );
    }
  
    protected validateId(id: string, entityName: string): void {
      if (!id || typeof id !== "string" || id.trim().length === 0) {
        throw new BadRequestException(`Invalid ${entityName} ID`);
      }
    }
    protected throwNotFoundError(
      value: any,
      message: string = "Resource not found",
    ): void {
      if (value === undefined || value === null || value === "") {
        throw new NotFoundException(message);
      }
    }
  
    protected throwConflictError(messageOrObject: string | object): void {
      if (typeof messageOrObject === "string") {
        throw new ConflictException({ detail: messageOrObject });
      } else {
        throw new ConflictException({
          detail: messageOrObject,
        });
      }
    }
  
    protected throwNBadRequestError(messageOrObject: string | object): void {
      if (typeof messageOrObject === "string") {
        throw new BadRequestException({ detail: messageOrObject });
      } else {
        throw new BadRequestException({
          detail: messageOrObject,
        });
      }
    }
  
    protected throwBadRequestError(messageOrObject: string | object): void {
      if (typeof messageOrObject === "string") {
        throw new BadRequestException(messageOrObject);
      } else {
        throw new BadRequestException({
          message: "Bad Request",
          details: messageOrObject,
        });
      }
    }
  
    protected throwValidationError(value: any): void {
      if (value === undefined || value === null || value === "") {
        throw new ConflictException(value);
      }
    }
  
    protected validateRequired(value: any, fieldName: string): void {
      if (value === undefined || value === null || value === "") {
        throw new BadRequestException(`${fieldName} is required`);
      }
    }
  
    protected throwForbiddenError(messageOrObject: string | object): void {
      if (typeof messageOrObject === "string") {
        throw new ForbiddenException({ detail: messageOrObject });
      } else {
        throw new ForbiddenException({
          detail: messageOrObject,
        });
      }
    }
  
    protected validateEmail(email: string): void {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new BadRequestException("Invalid email format");
      }
    }
  
    protected validatePhoneNumber(phoneNumber: string): void {
      const phoneRegex = /^\+?[1-9]\d{1,14}$/;
      if (!phoneRegex.test(phoneNumber)) {
        throw new BadRequestException("Invalid phone number format");
      }
    }
  
    protected validateDate(date: Date | string, fieldName: string): void {
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) {
        throw new BadRequestException(`Invalid ${fieldName} date`);
      }
    }
  
    protected validateEnum(value: any, enumType: any, fieldName: string): void {
      const validValues = Object.values(enumType);
      if (!validValues.includes(value)) {
        throw new BadRequestException(
          `Invalid ${fieldName}. Must be one of: ${validValues.join(", ")}`,
        );
      }
    }
  
    protected validateNumericRange(
      value: number,
      min: number,
      max: number,
      fieldName: string,
    ): void {
      if (value < min || value > max) {
        throw new BadRequestException(
          `${fieldName} must be between ${min} and ${max}`,
        );
      }
    }
  
    protected validateArrayLength(
      array: any[],
      minLength: number,
      maxLength: number,
      fieldName: string,
    ): void {
      if (array.length < minLength || array.length > maxLength) {
        throw new BadRequestException(
          `${fieldName} must have between ${minLength} and ${maxLength} items`,
        );
      }
    }
  
    protected validateStringLength(
      str: string,
      minLength: number,
      maxLength: number,
      fieldName: string,
    ): void {
      if (str.length < minLength || str.length > maxLength) {
        throw new BadRequestException(
          `${fieldName} must be between ${minLength} and ${maxLength} characters`,
        );
      }
    }
  
    protected async validateExists<T>(
      promise: Promise<T | null>,
      entityName: string,
    ): Promise<T> {
      try {
        const result = await promise;
        if (!result) {
          throw new NotFoundException(`${entityName} not found`);
        }
        return result;
      } catch (error) {
        this.handleError(error, `Error validating ${entityName} existence`);
      }
    }
  
    protected logInfo(message: string, context?: any): void {
      this.logger.log(message, context);
    }
  
    protected logWarning(message: string, context?: any): void {
      this.logger.warn(message, context);
    }
  
    protected logError(message: string, error?: any): void {
      this.logger.error(message, error?.stack);
    }
  
    protected logDebug(message: string, context?: any): void {
      this.logger.debug(message, context);
    }
  
    protected logVerbose(message: string, context?: any): void {
      this.logger.verbose(message, context);
    }
    protected generateUUID(): string {
      return uuidv4();
    }
  
    protected assignNullToEmptyStrings(
      data: Record<string, any>,
      keysToDelete: string[] = [],
    ): Record<string, any> {
      Object.keys(data).forEach((key) => {
        if (data[key] == "") {
          data[key] = null;
        }
        if (keysToDelete.includes(key)) {
          delete data[key];
        }
      });
      return data;
    }
  
    protected decodeTokenFromHeaders(headers: Record<string, any>) {
      try {
        const authorization =
          headers["authorization"] || headers["Authorization"];
        if (!authorization || !authorization.startsWith("Bearer ")) {
          throw new UnauthorizedException(
            "Authorization token is missing or invalid",
          );
        }
  
        const token = authorization.split(" ")[1]; // Extract the token after "Bearer"
        const decoded = jwt.decode(token) as any; // Decode the token without verifying
        return decoded;
      } catch (error) {
        this.logger.error("Failed to decode token", error?.stack || error);
        throw new UnauthorizedException("Failed to decode token");
      }
    }
  
    protected decodeRefrshToken(token: string) {
      const decode = jwt.decode(token) as any;
      return decode;
    }
    protected createJwt(payload:any){
      return jwt.sign(payload,'HS256') as any;
    }
  
  
    protected usNumberFormat(phoneNumber: string): string {
      const cleanedNumber = phoneNumber.replace(/[^0-9]/g, "");
      if (cleanedNumber.length === 10) {
        return `+1${cleanedNumber}`;
      } else if (cleanedNumber.length === 11 && cleanedNumber[0] === "1") {
        return `+${cleanedNumber}`;
      } else {
        return phoneNumber;
      }
    }
    protected stringToNumberArray(encodedString: string) {
      const decodedString = decodeURIComponent(encodedString);
      const stringArray = decodedString.split(",");
      const numberArray = stringArray
        .map((str) => Number(str.trim()))
        .filter((num) => !isNaN(num));
      return numberArray;
    }
  
    protected formatPhoneNumber(phoneNumber: string): string {
      const cleanedNumber = phoneNumber.replace(/\D/g, '');
      switch (cleanedNumber.length) {
        case 3:
          return `(${cleanedNumber})`;
        default:
          const areaCode = cleanedNumber.substring(0, 3);
          const prefix = cleanedNumber.substring(3, 6);
          const lineNumber = cleanedNumber.substring(6, 10);
          return `(${areaCode}) ${prefix}-${lineNumber}`;
      }
    }
  }
  