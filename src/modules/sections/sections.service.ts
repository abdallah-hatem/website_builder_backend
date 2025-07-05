import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Section } from './entities/section.entity';
import { SectionsRepository } from './sections.repository';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { ContentValidationService } from './services/content-validation.service';

@Injectable()
export class SectionsService {
  constructor(
    private readonly sectionsRepository: SectionsRepository,
    private readonly contentValidationService: ContentValidationService,
  ) {}

  getSectionTypes() {
    return {
      types: [
        {
          type: 'image-text',
          name: 'Image & Text',
          description: 'A component with an image on one side and text content on the other',
          example: {
            type: 'image-text',
            imageUrl: 'https://example.com/image.jpg',
            imageAlt: 'Example image',
            title: 'Amazing Title',
            text: 'This is some amazing content text.',
            imagePosition: 'left',
            ctaButton: { text: 'Learn More', url: '/about' }
          }
        },
        {
          type: 'hero',
          name: 'Hero Section',
          description: 'A full-width hero section with background image and call-to-action',
          example: {
            type: 'hero',
            backgroundImage: 'https://example.com/hero-bg.jpg',
            backgroundImageAlt: 'City skyline',
            title: 'Transform Your Business',
            subtitle: 'Join thousands of companies',
            ctaButton: { text: 'Get Started', url: '/signup' },
            textAlignment: 'center'
          }
        },
        {
          type: 'slider',
          name: 'Image Slider',
          description: 'An image carousel with multiple slides',
          example: {
            type: 'slider',
            autoPlay: true,
            duration: 5,
            slides: [
              {
                imageUrl: 'https://example.com/slide1.jpg',
                imageAlt: 'Slide 1',
                title: 'Slide Title',
                description: 'Slide description',
                ctaButton: { text: 'View More', url: '/products' }
              },
              {
                imageUrl: 'https://example.com/slide2.jpg',
                imageAlt: 'Slide 2',
                title: 'Another Slide',
                description: 'Another description'
              }
            ]
          }
        },
        {
          type: 'text-block',
          name: 'Text Block',
          description: 'Simple text content with alignment options',
          example: {
            type: 'text-block',
            title: 'About Us',
            content: 'We are a company dedicated to excellence and innovation.',
            textAlignment: 'center',
            backgroundColor: '#f8f9fa'
          }
        },
        {
          type: 'gallery',
          name: 'Image Gallery',
          description: 'A collection of images with different layout options',
          example: {
            type: 'gallery',
            title: 'Our Portfolio',
            images: [
              { url: 'https://example.com/img1.jpg', alt: 'Project 1', caption: 'E-commerce Platform' },
              { url: 'https://example.com/img2.jpg', alt: 'Project 2', caption: 'Mobile App' },
              { url: 'https://example.com/img3.jpg', alt: 'Project 3', caption: 'Web Dashboard' }
            ],
            layout: 'grid',
            columns: 3
          }
        },
        {
          type: 'contact-form',
          name: 'Contact Form',
          description: 'A customizable contact form with various field types',
          example: {
            type: 'contact-form',
            title: 'Contact Us',
            description: 'Get in touch with us and we will respond as soon as possible.',
            fields: [
              { name: 'name', label: 'Full Name', type: 'text', required: true, placeholder: 'Your full name' },
              { name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'your@email.com' },
              { name: 'subject', label: 'Subject', type: 'select', required: true, options: ['General', 'Support', 'Sales'] },
              { name: 'message', label: 'Message', type: 'textarea', required: true, placeholder: 'Your message here...' }
            ],
            submitButtonText: 'Send Message',
            successMessage: 'Thank you for your message! We will get back to you soon.'
          }
        }
      ]
    };
  }

  async findAll(): Promise<Section[]> {
    return this.sectionsRepository.findAll();
  }

  async findById(id: string): Promise<Section> {
    const section = await this.sectionsRepository.findById(id);
    if (!section) {
      throw new NotFoundException(`Section with ID ${id} not found`);
    }
    return section;
  }

  async findByPageId(pageId: string): Promise<Section[]> {
    return this.sectionsRepository.findByPageId(pageId);
  }

  async create(createSectionDto: CreateSectionDto): Promise<Section> {
    // Check for duplicate order on the same page
    await this.validateUniqueOrder(createSectionDto.pageId, createSectionDto.order);

    // Validate content structure based on section type
    const validatedContent = this.contentValidationService.validateContent(
      createSectionDto.type,
      createSectionDto.content
    );

    // Create section with validated content
    const sectionData = {
      ...createSectionDto,
      content: validatedContent,
    };

    return this.sectionsRepository.create(sectionData);
  }

  async update(id: string, updateSectionDto: UpdateSectionDto): Promise<Section> {
    const existingSection = await this.findById(id); // Check if section exists
    
    // Check for duplicate order if order or pageId is being updated
    if (updateSectionDto.order !== undefined || updateSectionDto.pageId) {
      const newPageId = updateSectionDto.pageId || existingSection.pageId;
      const newOrder = updateSectionDto.order !== undefined ? updateSectionDto.order : existingSection.order;
      
      // Only validate if the combination is actually changing
      if (newPageId !== existingSection.pageId || newOrder !== existingSection.order) {
        await this.validateUniqueOrder(newPageId, newOrder, id);
      }
    }
    
    // If content is being updated, validate it
    if (updateSectionDto.content && updateSectionDto.type) {
      const validatedContent = this.contentValidationService.validateContent(
        updateSectionDto.type,
        updateSectionDto.content
      );
      updateSectionDto.content = validatedContent;
    }

    return this.sectionsRepository.update(id, updateSectionDto);
  }

  async delete(id: string): Promise<Section> {
    await this.findById(id); // Check if section exists
    return this.sectionsRepository.delete(id);
  }

  private async validateUniqueOrder(pageId: string, order: number, excludeId?: string): Promise<void> {
    const existingSections = await this.sectionsRepository.findByPageId(pageId);
    
    const duplicateSection = existingSections.find(section => 
      section.order === order && section.id !== excludeId
    );

    if (duplicateSection) {
      throw new BadRequestException(
        `A section with order ${order} already exists on this page. Please choose a different order number.`
      );
    }
  }
} 