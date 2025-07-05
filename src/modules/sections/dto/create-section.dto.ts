import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsObject, IsIn, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { SectionContent, SectionType, SECTION_TYPES } from '../entities/section-types';

export class CreateSectionDto {
  @ApiProperty({ 
    description: 'Section type',
    enum: SECTION_TYPES,
    example: 'image-text'
  })
  @IsString()
  @IsIn(SECTION_TYPES)
  type: SectionType;

  @ApiProperty({ 
    description: 'Section content - structure varies by type',
    example: {
      type: 'image-text',
      imageUrl: 'https://example.com/image.jpg',
      imageAlt: 'Example image',
      title: 'Amazing Title',
      text: 'This is some amazing content text.',
      imagePosition: 'left'
    }
  })
  @IsObject()
  @Transform(({ value, obj }) => {
    // Ensure the content type matches the section type
    if (typeof value === 'object' && value !== null) {
      value.type = obj.type;
    }
    return value;
  })
  content: SectionContent;

  @ApiProperty({ 
    description: 'Section order on the page',
    example: 1
  })
  @IsNumber()
  order: number;

  @ApiProperty({ 
    description: 'Page ID this section belongs to',
    example: 'clxxx123456'
  })
  @IsString()
  pageId: string;
}

// Helper DTOs for different content types (for better Swagger documentation)
export class ImageTextContentDto {
  @ApiProperty({ enum: ['image-text'] })
  type: 'image-text';

  @ApiProperty({ example: 'https://example.com/image.jpg' })
  imageUrl: string;

  @ApiProperty({ example: 'Description of the image' })
  imageAlt: string;

  @ApiProperty({ example: 'Section Title' })
  title: string;

  @ApiProperty({ example: 'This is the main content text.' })
  text: string;

  @ApiProperty({ enum: ['left', 'right'], example: 'left' })
  imagePosition: 'left' | 'right';

  @ApiProperty({ required: false })
  @IsOptional()
  ctaButton?: {
    text: string;
    url: string;
  };
}

export class HeroContentDto {
  @ApiProperty({ enum: ['hero'] })
  type: 'hero';

  @ApiProperty({ example: 'https://example.com/hero-bg.jpg' })
  backgroundImage: string;

  @ApiProperty({ example: 'Hero background image' })
  backgroundImageAlt: string;

  @ApiProperty({ example: 'Welcome to Our Website' })
  title: string;

  @ApiProperty({ example: 'Discover amazing products and services' })
  subtitle: string;

  @ApiProperty()
  ctaButton: {
    text: string;
    url: string;
  };

  @ApiProperty({ enum: ['left', 'center', 'right'], example: 'center' })
  textAlignment: 'left' | 'center' | 'right';
} 