import { ApiProperty } from '@nestjs/swagger';

export class Page {
  @ApiProperty({ description: 'Page unique identifier' })
  id: string;

  @ApiProperty({ description: 'Page title' })
  title: string;

  @ApiProperty({ description: 'Page slug (URL identifier)' })
  slug: string;

  @ApiProperty({ description: 'Page sections', required: false })
  sections?: any[];

  @ApiProperty({ description: 'Page creation date' })
  createdAt: Date;
} 