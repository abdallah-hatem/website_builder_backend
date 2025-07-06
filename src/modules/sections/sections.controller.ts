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

    let content: any;

    switch (type) {
      case 'image-text':
        content = await this.processImageTextSection(files, formData);
        break;
      case 'hero':
        content = await this.processHeroSection(files, formData);
        break;
      case 'gallery':
        content = await this.processGallerySection(files, formData);
        break;
      case 'slider':
        content = await this.processSliderSection(files, formData);
        break;
      case 'text-block':
        content = this.processTextBlockSection(formData);
        break;
      case 'contact-form':
        content = this.processContactFormSection(formData);
        break;
      default:
        throw new BadRequestException(`Unsupported section type: ${type}`);
    }

    const createSectionDto: CreateSectionDto = {
      type,
      pageId,
      order: parseInt(order),
      content,
    };

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

  private async processImageTextSection(files: Express.Multer.File[], formData: any) {
    const imageFile = files.find(file => file.fieldname === 'image');
    if (!imageFile) {
      throw new BadRequestException('Image file is required for image-text section');
    }

    const { text_1, text_2, text_3, imageAlt, imagePosition, ctaButtonUrl } = formData;

    return {
      type: 'image-text' as const,
      imageUrl: generateFileUrl(imageFile.filename),
      imageAlt: imageAlt || imageFile.originalname,
      title: text_1,
      text: text_2,
      imagePosition: imagePosition as 'left' | 'right',
      ...(text_3 && ctaButtonUrl && {
        ctaButton: { text: text_3, url: ctaButtonUrl }
      })
    };
  }

  private async processHeroSection(files: Express.Multer.File[], formData: any) {
    const backgroundImageFile = files.find(file => file.fieldname === 'backgroundImage');
    if (!backgroundImageFile) {
      throw new BadRequestException('Background image file is required for hero section');
    }

    const { text_1, text_2, text_3, backgroundImageAlt, textAlignment, ctaButtonUrl } = formData;

    return {
      type: 'hero' as const,
      backgroundImage: generateFileUrl(backgroundImageFile.filename),
      backgroundImageAlt: backgroundImageAlt || backgroundImageFile.originalname,
      title: text_1,
      subtitle: text_2,
      textAlignment: textAlignment as 'left' | 'center' | 'right',
      ctaButton: { text: text_3, url: ctaButtonUrl }
    };
  }

  private async processGallerySection(files: Express.Multer.File[], formData: any) {
    const imageFiles = files.filter(file => file.fieldname === 'images');
    if (!imageFiles || imageFiles.length === 0) {
      throw new BadRequestException('At least one image is required for gallery section');
    }

    const { text_1, layout = 'grid', columns = '3' } = formData;

    const galleryImages = imageFiles.map(file => ({
      url: generateFileUrl(file.filename),
      alt: file.originalname,
      caption: ''
    }));

    return {
      type: 'gallery' as const,
      title: text_1 || undefined,
      images: galleryImages,
      layout: layout as 'grid' | 'masonry' | 'carousel',
      columns: parseInt(columns)
    };
  }

  private async processSliderSection(files: Express.Multer.File[], formData: any) {
    const imageFiles = files.filter(file => file.fieldname === 'images');
    if (!imageFiles || imageFiles.length === 0) {
      throw new BadRequestException('At least one image is required for slider section');
    }

    const { autoPlay, duration, slideData } = formData;

    let parsedSlideData: any[] = [];
    if (slideData) {
      try {
        parsedSlideData = JSON.parse(slideData);
      } catch (error) {
        throw new BadRequestException('Invalid slide data JSON format');
      }
    }

    const slides = imageFiles.map((file, index) => ({
      imageUrl: generateFileUrl(file.filename),
      imageAlt: file.originalname,
      title: parsedSlideData[index]?.title || '',
      description: parsedSlideData[index]?.description || '',
      ...(parsedSlideData[index]?.ctaButton && { ctaButton: parsedSlideData[index].ctaButton })
    }));

    return {
      type: 'slider' as const,
      autoPlay: autoPlay ? autoPlay === 'true' : undefined,
      duration: duration ? parseInt(duration) : undefined,
      slides
    };
  }

  private processTextBlockSection(formData: any) {
    const { text_1, text_2, textAlignment, backgroundColor } = formData;

    return {
      type: 'text-block' as const,
      title: text_1 || undefined,
      content: text_2,
      textAlignment: textAlignment as 'left' | 'center' | 'right',
      backgroundColor: backgroundColor || undefined
    };
  }

  private processContactFormSection(formData: any) {
    const { text_1, text_2, text_3, text_4, formFields } = formData;

    let parsedFields: any[] = [];
    if (formFields) {
      try {
        parsedFields = JSON.parse(formFields);
      } catch (error) {
        throw new BadRequestException('Invalid form fields JSON format');
      }
    }

    return {
      type: 'contact-form' as const,
      title: text_1,
      description: text_2 || undefined,
      fields: parsedFields,
      submitButtonText: text_3,
      successMessage: text_4
    };
  }
} 