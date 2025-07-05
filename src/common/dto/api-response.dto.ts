import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto<T> {
  @ApiProperty({ description: 'Indicates if the request was successful' })
  success: boolean;

  @ApiProperty({ description: 'HTTP status code' })
  statusCode: number;

  @ApiProperty({ description: 'Response message' })
  message: string;

  @ApiProperty({ description: 'Response data' })
  data?: T;

  constructor(success: boolean, statusCode: number, message: string, data?: T) {
    this.success = success;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }

  static success<T>(data: T, message: string = 'Success', statusCode: number = 200): ApiResponseDto<T> {
    return new ApiResponseDto(true, statusCode, message, data);
  }

  static error(message: string, statusCode: number = 500): ApiResponseDto<null> {
    return new ApiResponseDto(false, statusCode, message, null);
  }
} 