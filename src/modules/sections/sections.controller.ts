import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { SectionsService } from './sections.service';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { Section } from './entities/section.entity';

@ApiTags('sections')
@Controller('sections')
export class SectionsController {
  constructor(private readonly sectionsService: SectionsService) {}

  @Get('types')
  @ApiOperation({ 
    summary: 'Get all available section types and their structures',
    description: 'Returns information about all available section component types and their expected content structures'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Section types retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        types: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              type: { type: 'string' },
              name: { type: 'string' },
              description: { type: 'string' },
              fields: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    type: { type: 'string' },
                    required: { type: 'boolean' },
                    description: { type: 'string' },
                    options: { type: 'array', items: { type: 'string' } }
                  }
                }
              },
              example: { type: 'object' }
            }
          }
        }
      }
    }
  })
  getSectionTypes() {
    return this.sectionsService.getSectionTypes();
  }

  @Get()
  @ApiOperation({ summary: 'Get all sections' })
  @ApiResponse({ status: 200, description: 'Sections retrieved successfully', type: [Section] })
  findAll() {
    return this.sectionsService.findAll();
  }

  @Get('by-page/:pageId')
  @ApiOperation({ summary: 'Get sections by page ID' })
  @ApiParam({ name: 'pageId', description: 'Page ID to filter sections' })
  @ApiResponse({ status: 200, description: 'Sections retrieved successfully', type: [Section] })
  findByPageId(@Param('pageId') pageId: string) {
    return this.sectionsService.findByPageId(pageId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get section by ID' })
  @ApiParam({ name: 'id', description: 'Section ID' })
  @ApiResponse({ status: 200, description: 'Section retrieved successfully', type: Section })
  @ApiResponse({ status: 404, description: 'Section not found' })
  findOne(@Param('id') id: string) {
    return this.sectionsService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new section' })
  @ApiResponse({ status: 201, description: 'Section created successfully', type: Section })
  @ApiResponse({ status: 400, description: 'Invalid section data' })
  create(@Body() createSectionDto: CreateSectionDto) {
    return this.sectionsService.create(createSectionDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update section by ID' })
  @ApiParam({ name: 'id', description: 'Section ID' })
  @ApiResponse({ status: 200, description: 'Section updated successfully', type: Section })
  @ApiResponse({ status: 404, description: 'Section not found' })
  update(@Param('id') id: string, @Body() updateSectionDto: UpdateSectionDto) {
    return this.sectionsService.update(id, updateSectionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete section by ID' })
  @ApiParam({ name: 'id', description: 'Section ID' })
  @ApiResponse({ status: 200, description: 'Section deleted successfully', type: Section })
  @ApiResponse({ status: 404, description: 'Section not found' })
  remove(@Param('id') id: string) {
    return this.sectionsService.delete(id);
  }
} 