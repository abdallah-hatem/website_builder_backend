import { ApiProperty } from '@nestjs/swagger';
import { SectionContent, SectionType, SECTION_TYPES } from './section-types';

export class Section {
  @ApiProperty({ description: 'Section unique identifier' })
  id: string;

  @ApiProperty({ 
    description: 'Section type',
    enum: SECTION_TYPES,
    example: 'image-text'
  })
  type: SectionType;

  @ApiProperty({ 
    description: 'Section content - structure varies by type',
    oneOf: [
      {
        type: 'object',
        properties: {
          type: { type: 'string', enum: ['image-text'] },
          imageUrl: { type: 'string' },
          imageAlt: { type: 'string' },
          title: { type: 'string' },
          text: { type: 'string' },
          imagePosition: { type: 'string', enum: ['left', 'right'] }
        }
      },
      {
        type: 'object', 
        properties: {
          type: { type: 'string', enum: ['hero'] },
          backgroundImage: { type: 'string' },
          title: { type: 'string' },
          subtitle: { type: 'string' }
        }
      }
      // Add more examples as needed
    ]
  })
  content: SectionContent;

  @ApiProperty({ description: 'Section order on the page' })
  order: number;

  @ApiProperty({ description: 'Page ID this section belongs to' })
  pageId: string;
} 