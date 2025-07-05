import { ApiProperty } from '@nestjs/swagger';

export class Asset {
  @ApiProperty({ description: 'Asset unique identifier' })
  id: string;

  @ApiProperty({ description: 'Asset URL' })
  url: string;

  @ApiProperty({ description: 'Asset type', enum: ['image', 'video', 'file'] })
  type: string;

  @ApiProperty({ description: 'Original filename' })
  filename: string;

  @ApiProperty({ description: 'Upload date' })
  uploadedAt: Date;

  @ApiProperty({ description: 'User who uploaded the asset', required: false })
  uploadedBy?: string;
} 