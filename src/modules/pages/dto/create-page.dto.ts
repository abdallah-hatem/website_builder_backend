import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePageDto {
  @ApiProperty({ description: 'Page title', example: 'Home Page' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Page slug (URL identifier)', example: 'home' })
  @IsString()
  @IsNotEmpty()
  slug: string;
} 