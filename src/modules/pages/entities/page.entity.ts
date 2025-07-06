import { ApiProperty } from '@nestjs/swagger';

export class Page {
  @ApiProperty({ description: 'Page unique identifier' })
  id: string;

  @ApiProperty({ description: 'Page title' })
  title: string;

  @ApiProperty({ description: 'Page slug (URL segment, not full path)' })
  slug: string;

  @ApiProperty({ description: 'Parent page ID', required: false })
  parentId?: string;

  @ApiProperty({ description: 'Full URL path (computed)', example: '/media/gallery', required: false })
  fullPath?: string;

  @ApiProperty({ description: 'Child pages', required: false })
  children?: Page[];

  @ApiProperty({ description: 'Parent page', required: false })
  parent?: Page;

  @ApiProperty({ description: 'Page sections', required: false })
  sections?: any[];

  @ApiProperty({ description: 'Page creation date' })
  createdAt: Date;
} 