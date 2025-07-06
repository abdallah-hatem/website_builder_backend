import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Put, 
  Delete, 
  UseInterceptors, 
  UploadedFile,
  UploadedFiles,
  BadRequestException
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor, AnyFilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { SectionsService } from './sections.service';
import { SectionContentProcessorService } from './services/section-content-processor.service';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { Section } from './entities/section.entity';
import { 
  createMulterOptions, 
  mediaFileFilter,
  generateFileUrl 
} from '../../common/utils/file-upload.util';

@ApiTags('sections')
@Controller('sections')
export class SectionsController {
  constructor(
    private readonly sectionsService: SectionsService,
    private readonly sectionContentProcessor: SectionContentProcessorService,
  ) {}

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
              example: { type: 'object' },
              requiresFiles: { type: 'boolean' },
              fileFields: { 
                type: 'array',
                items: { type: 'string' }
              },
              textFields: {
                type: 'object',
                additionalProperties: { type: 'string' }
              }
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
  @ApiOperation({ 
    summary: 'Create a new section',
    description: 'Create a section using FormData. Files are processed based on section type.'
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        type: { type: 'string', enum: ['image-text', 'hero', 'slider', 'text-block', 'gallery', 'contact-form'] },
        pageId: { type: 'string' },
        order: { type: 'number' },
        
        // Standardized text fields
        text_1: { type: 'string', description: 'First text field (varies by type)' },
        text_2: { type: 'string', description: 'Second text field (varies by type)' },
        text_3: { type: 'string', description: 'Third text field (varies by type)' },
        text_4: { type: 'string', description: 'Fourth text field (varies by type)' },
        text_5: { type: 'string', description: 'Fifth text field (varies by type)' },
        
        // Non-text fields
        imagePosition: { type: 'string', enum: ['left', 'right'] },
        imageAlt: { type: 'string' },
        backgroundImageAlt: { type: 'string' },
        textAlignment: { type: 'string', enum: ['left', 'center', 'right'] },
        layout: { type: 'string', enum: ['grid', 'masonry', 'carousel'] },
        columns: { type: 'number' },
        autoPlay: { type: 'boolean' },
        duration: { type: 'number' },
        backgroundColor: { type: 'string' },
        
        // CTA Button fields
        ctaButtonUrl: { type: 'string' },
        
        // Complex data as JSON
        slideData: { type: 'string', description: 'JSON string with slide data' },
        formFields: { type: 'string', description: 'JSON string with form fields' },
        
        // File fields
        image: { type: 'string', format: 'binary' },
        backgroundImage: { type: 'string', format: 'binary' },
        images: { type: 'array', items: { type: 'string', format: 'binary' } }
      },
      required: ['type', 'pageId', 'order']
    }
  })
  @ApiResponse({ status: 201, description: 'Section created successfully', type: Section })
  @ApiResponse({ status: 400, description: 'Invalid section data' })
  @UseInterceptors(AnyFilesInterceptor(createMulterOptions('', mediaFileFilter)))
  async create(@UploadedFiles() files: Express.Multer.File[], @Body() formData: any) {
    const { type, pageId, order } = formData;
    
    if (!type || !pageId || order === undefined) {
      throw new BadRequestException('type, pageId, and order are required fields');
    }

    const content = await this.sectionContentProcessor.processContent(type, files, formData);

    const createSectionDto: CreateSectionDto = {
      type,
      pageId,
      order: parseInt(order),
      content,
    };

    return this.sectionsService.create(createSectionDto);
  }

  @Put(':id')
  @ApiOperation({ 
    summary: 'Update section by ID',
    description: 'Update a section using FormData. Files are processed based on section type.'
  })
  @ApiParam({ name: 'id', description: 'Section ID' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        type: { type: 'string', enum: ['image-text', 'hero', 'slider', 'text-block', 'gallery', 'contact-form'] },
        pageId: { type: 'string' },
        order: { type: 'number' },
        
        // Standardized text fields
        text_1: { type: 'string', description: 'First text field (varies by type)' },
        text_2: { type: 'string', description: 'Second text field (varies by type)' },
        text_3: { type: 'string', description: 'Third text field (varies by type)' },
        text_4: { type: 'string', description: 'Fourth text field (varies by type)' },
        text_5: { type: 'string', description: 'Fifth text field (varies by type)' },
        
        // Non-text fields
        imagePosition: { type: 'string', enum: ['left', 'right'] },
        imageAlt: { type: 'string' },
        backgroundImageAlt: { type: 'string' },
        textAlignment: { type: 'string', enum: ['left', 'center', 'right'] },
        layout: { type: 'string', enum: ['grid', 'masonry', 'carousel'] },
        columns: { type: 'number' },
        autoPlay: { type: 'boolean' },
        duration: { type: 'number' },
        backgroundColor: { type: 'string' },
        
        // CTA Button fields
        ctaButtonUrl: { type: 'string' },
        
        // Complex data as JSON
        slideData: { type: 'string', description: 'JSON string with slide data' },
        formFields: { type: 'string', description: 'JSON string with form fields' },
        
        // File fields
        image: { type: 'string', format: 'binary' },
        backgroundImage: { type: 'string', format: 'binary' },
        images: { type: 'array', items: { type: 'string', format: 'binary' } }
      }
    }
  })
  @ApiResponse({ status: 200, description: 'Section updated successfully', type: Section })
  @ApiResponse({ status: 404, description: 'Section not found' })
  @UseInterceptors(AnyFilesInterceptor(createMulterOptions('', mediaFileFilter)))
  async update(@Param('id') id: string, @UploadedFiles() files: Express.Multer.File[], @Body() formData: any) {
    const updateSectionDto: UpdateSectionDto = {};

    // Handle basic fields
    if (formData.pageId) updateSectionDto.pageId = formData.pageId;
    if (formData.order !== undefined) updateSectionDto.order = parseInt(formData.order);

    // Process content if type is provided
    if (formData.type) {
      // Get existing section to preserve existing content
      const existingSection = await this.sectionsService.findById(id);
      if (!existingSection) {
        throw new BadRequestException('Section not found');
      }

      const content = await this.sectionContentProcessor.processUpdateContent(
        formData.type, 
        files || [], 
        formData, 
        existingSection.content
      );
      updateSectionDto.content = content;
    }

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