import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAssetDto {
  @ApiProperty({ description: 'Asset URL', example: '/uploads/image.jpg' })
  @IsString()
  @IsNotEmpty()
  url: string;

  @ApiProperty({ description: 'Asset type', example: 'image', enum: ['image', 'video', 'file'] })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ description: 'Original filename', example: 'image.jpg' })
  @IsString()
  @IsNotEmpty()
  filename: string;

  @ApiProperty({ description: 'User who uploaded the asset', required: false })
  @IsString()
  @IsOptional()
  uploadedBy?: string;
} 