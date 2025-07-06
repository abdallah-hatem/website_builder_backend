import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePageDto {
  @ApiProperty({ description: 'Page title', example: 'Home Page' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ 
    description: 'Page slug (URL segment, not full path). For nested pages, this is just the segment (e.g., "gallery" for "/media/gallery")', 
    example: 'gallery'
  })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ 
    description: 'Parent page ID for nested pages',
    example: 'cuid123',
    required: false
  })
  @IsString()
  @IsOptional()
  parentId?: string;
} 