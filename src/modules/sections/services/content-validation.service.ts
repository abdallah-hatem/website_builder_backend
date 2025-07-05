import { Injectable, BadRequestException } from '@nestjs/common';
import { 
  SectionContent, 
  SectionType, 
  ImageTextContent,
  SliderContent,
  HeroContent,
  TextBlockContent,
  GalleryContent,
  ContactFormContent
} from '../entities/section-types';

@Injectable()
export class ContentValidationService {
  
  validateContent(type: SectionType, content: any): SectionContent {
    // Ensure content has the correct type field
    if (!content || content.type !== type) {
      content = { ...content, type };
    }

    switch (type) {
      case 'image-text':
        return this.validateImageTextContent(content);
      case 'slider':
        return this.validateSliderContent(content);
      case 'hero':
        return this.validateHeroContent(content);
      case 'text-block':
        return this.validateTextBlockContent(content);
      case 'gallery':
        return this.validateGalleryContent(content);
      case 'contact-form':
        return this.validateContactFormContent(content);
      default:
        throw new BadRequestException(`Unsupported section type: ${type}`);
    }
  }

  private validateImageTextContent(content: any): ImageTextContent {
    const errors: string[] = [];

    if (!content.imageUrl || typeof content.imageUrl !== 'string') {
      errors.push('imageUrl is required and must be a string');
    }
    // imageAlt is optional
    if (content.imageAlt && typeof content.imageAlt !== 'string') {
      errors.push('imageAlt must be a string');
    }
    if (!content.title || typeof content.title !== 'string') {
      errors.push('title is required and must be a string');
    }
    if (!content.text || typeof content.text !== 'string') {
      errors.push('text is required and must be a string');
    }
    if (!content.imagePosition || !['left', 'right'].includes(content.imagePosition)) {
      errors.push('imagePosition is required and must be either "left" or "right"');
    }

    if (content.ctaButton) {
      if (!content.ctaButton.text || typeof content.ctaButton.text !== 'string') {
        errors.push('ctaButton.text must be a string');
      }
      if (!content.ctaButton.url || typeof content.ctaButton.url !== 'string') {
        errors.push('ctaButton.url must be a string');
      }
    }

    if (errors.length > 0) {
      throw new BadRequestException(`Invalid image-text content: ${errors.join(', ')}`);
    }

    return content as ImageTextContent;
  }

  private validateSliderContent(content: any): SliderContent {
    const errors: string[] = [];

    // autoPlay is optional
    if (content.autoPlay !== undefined && typeof content.autoPlay !== 'boolean') {
      errors.push('autoPlay must be a boolean');
    }
    // duration is optional
    if (content.duration !== undefined && (typeof content.duration !== 'number' || content.duration <= 0)) {
      errors.push('duration must be a positive number');
    }
    if (!Array.isArray(content.slides) || content.slides.length === 0) {
      errors.push('slides is required and must be a non-empty array');
    } else {
      content.slides.forEach((slide: any, index: number) => {
        if (!slide.imageUrl || typeof slide.imageUrl !== 'string') {
          errors.push(`slides[${index}].imageUrl is required and must be a string`);
        }
        // imageAlt is optional
        if (slide.imageAlt && typeof slide.imageAlt !== 'string') {
          errors.push(`slides[${index}].imageAlt must be a string`);
        }
        // title is optional
        if (slide.title && typeof slide.title !== 'string') {
          errors.push(`slides[${index}].title must be a string`);
        }
        // description is optional
        if (slide.description && typeof slide.description !== 'string') {
          errors.push(`slides[${index}].description must be a string`);
        }
      });
    }

    if (errors.length > 0) {
      throw new BadRequestException(`Invalid slider content: ${errors.join(', ')}`);
    }

    return content as SliderContent;
  }

  private validateHeroContent(content: any): HeroContent {
    const errors: string[] = [];

    if (!content.backgroundImage || typeof content.backgroundImage !== 'string') {
      errors.push('backgroundImage is required and must be a string');
    }
    if (!content.backgroundImageAlt || typeof content.backgroundImageAlt !== 'string') {
      errors.push('backgroundImageAlt is required and must be a string');
    }
    if (!content.title || typeof content.title !== 'string') {
      errors.push('title is required and must be a string');
    }
    if (!content.subtitle || typeof content.subtitle !== 'string') {
      errors.push('subtitle is required and must be a string');
    }
    if (!content.ctaButton || !content.ctaButton.text || !content.ctaButton.url) {
      errors.push('ctaButton with text and url is required');
    }
    if (!content.textAlignment || !['left', 'center', 'right'].includes(content.textAlignment)) {
      errors.push('textAlignment is required and must be "left", "center", or "right"');
    }

    if (errors.length > 0) {
      throw new BadRequestException(`Invalid hero content: ${errors.join(', ')}`);
    }

    return content as HeroContent;
  }

  private validateTextBlockContent(content: any): TextBlockContent {
    const errors: string[] = [];

    // title is optional
    if (content.title && typeof content.title !== 'string') {
      errors.push('title must be a string');
    }
    if (!content.content || typeof content.content !== 'string') {
      errors.push('content is required and must be a string');
    }
    if (!content.textAlignment || !['left', 'center', 'right'].includes(content.textAlignment)) {
      errors.push('textAlignment is required and must be "left", "center", or "right"');
    }
    // backgroundColor is optional
    if (content.backgroundColor && typeof content.backgroundColor !== 'string') {
      errors.push('backgroundColor must be a string');
    }

    if (errors.length > 0) {
      throw new BadRequestException(`Invalid text-block content: ${errors.join(', ')}`);
    }

    return content as TextBlockContent;
  }

  private validateGalleryContent(content: any): GalleryContent {
    const errors: string[] = [];

    // title is optional
    if (content.title && typeof content.title !== 'string') {
      errors.push('title must be a string');
    }
    if (!Array.isArray(content.images) || content.images.length === 0) {
      errors.push('images is required and must be a non-empty array');
    } else {
      content.images.forEach((image: any, index: number) => {
        if (!image.url || typeof image.url !== 'string') {
          errors.push(`images[${index}].url is required and must be a string`);
        }
        if (!image.alt || typeof image.alt !== 'string') {
          errors.push(`images[${index}].alt is required and must be a string`);
        }
        // caption is optional
        if (image.caption && typeof image.caption !== 'string') {
          errors.push(`images[${index}].caption must be a string`);
        }
      });
    }
    
    if (!content.layout || !['grid', 'masonry', 'carousel'].includes(content.layout)) {
      errors.push('layout is required and must be "grid", "masonry", or "carousel"');
    }
    if (!content.columns || typeof content.columns !== 'number' || content.columns < 1) {
      errors.push('columns is required and must be a positive number');
    }

    if (errors.length > 0) {
      throw new BadRequestException(`Invalid gallery content: ${errors.join(', ')}`);
    }

    return content as GalleryContent;
  }

  private validateContactFormContent(content: any): ContactFormContent {
    const errors: string[] = [];

    if (!content.title || typeof content.title !== 'string') {
      errors.push('title is required and must be a string');
    }
    // description is optional
    if (content.description && typeof content.description !== 'string') {
      errors.push('description must be a string');
    }
    if (!Array.isArray(content.fields) || content.fields.length === 0) {
      errors.push('fields is required and must be a non-empty array');
    } else {
      content.fields.forEach((field: any, index: number) => {
        if (!field.name || typeof field.name !== 'string') {
          errors.push(`fields[${index}].name is required and must be a string`);
        }
        if (!field.label || typeof field.label !== 'string') {
          errors.push(`fields[${index}].label is required and must be a string`);
        }
        if (!field.type || !['text', 'email', 'tel', 'textarea', 'select'].includes(field.type)) {
          errors.push(`fields[${index}].type must be one of: text, email, tel, textarea, select`);
        }
        if (typeof field.required !== 'boolean') {
          errors.push(`fields[${index}].required is required and must be a boolean`);
        }
        // placeholder is optional
        if (field.placeholder && typeof field.placeholder !== 'string') {
          errors.push(`fields[${index}].placeholder must be a string`);
        }
        // options is optional
        if (field.options && !Array.isArray(field.options)) {
          errors.push(`fields[${index}].options must be an array`);
        }
      });
    }
    if (!content.submitButtonText || typeof content.submitButtonText !== 'string') {
      errors.push('submitButtonText is required and must be a string');
    }
    if (!content.successMessage || typeof content.successMessage !== 'string') {
      errors.push('successMessage is required and must be a string');
    }

    if (errors.length > 0) {
      throw new BadRequestException(`Invalid contact-form content: ${errors.join(', ')}`);
    }

    return content as ContactFormContent;
  }
} 