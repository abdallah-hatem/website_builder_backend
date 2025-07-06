import { Injectable, BadRequestException } from '@nestjs/common';
import { generateFileUrl } from '../../../common/utils/file-upload.util';

@Injectable()
export class SectionContentProcessorService {
  async processContent(type: string, files: Express.Multer.File[], formData: any): Promise<any> {
    switch (type) {
      case 'image-text':
        return this.processImageTextSection(files, formData);
      case 'hero':
        return this.processHeroSection(files, formData);
      case 'gallery':
        return this.processGallerySection(files, formData);
      case 'slider':
        return this.processSliderSection(files, formData);
      case 'text-block':
        return this.processTextBlockSection(formData);
      case 'contact-form':
        return this.processContactFormSection(formData);
      default:
        throw new BadRequestException(`Unsupported section type: ${type}`);
    }
  }

  async processUpdateContent(type: string, files: Express.Multer.File[], formData: any, existingContent: any): Promise<any> {
    switch (type) {
      case 'image-text':
        return this.processImageTextSectionUpdate(files, formData, existingContent);
      case 'hero':
        return this.processHeroSectionUpdate(files, formData, existingContent);
      case 'gallery':
        return this.processGallerySectionUpdate(files, formData, existingContent);
      case 'slider':
        return this.processSliderSectionUpdate(files, formData, existingContent);
      case 'text-block':
        return this.processTextBlockSection(formData);
      case 'contact-form':
        return this.processContactFormSection(formData);
      default:
        throw new BadRequestException(`Unsupported section type: ${type}`);
    }
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

  private async processImageTextSectionUpdate(files: Express.Multer.File[], formData: any, existingContent: any) {
    const imageFile = files.find(file => file.fieldname === 'image');
    const { text_1, text_2, text_3, imageAlt, imagePosition, ctaButtonUrl } = formData;

    return {
      type: 'image-text' as const,
      imageUrl: imageFile ? generateFileUrl(imageFile.filename) : existingContent.imageUrl,
      imageAlt: imageAlt || (imageFile ? imageFile.originalname : existingContent.imageAlt),
      title: text_1 !== undefined ? text_1 : existingContent.title,
      text: text_2 !== undefined ? text_2 : existingContent.text,
      imagePosition: imagePosition || existingContent.imagePosition,
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

  private async processHeroSectionUpdate(files: Express.Multer.File[], formData: any, existingContent: any) {
    const backgroundImageFile = files.find(file => file.fieldname === 'backgroundImage');
    const { text_1, text_2, text_3, backgroundImageAlt, textAlignment, ctaButtonUrl } = formData;

    return {
      type: 'hero' as const,
      backgroundImage: backgroundImageFile ? generateFileUrl(backgroundImageFile.filename) : existingContent.backgroundImage,
      backgroundImageAlt: backgroundImageAlt || (backgroundImageFile ? backgroundImageFile.originalname : existingContent.backgroundImageAlt),
      title: text_1 !== undefined ? text_1 : existingContent.title,
      subtitle: text_2 !== undefined ? text_2 : existingContent.subtitle,
      textAlignment: textAlignment || existingContent.textAlignment,
      ctaButton: (text_3 && ctaButtonUrl) ? { text: text_3, url: ctaButtonUrl } : existingContent.ctaButton
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

  private async processGallerySectionUpdate(files: Express.Multer.File[], formData: any, existingContent: any) {
    const imageFiles = files.filter(file => file.fieldname === 'images');
    const { text_1, layout, columns } = formData;

    let galleryImages = existingContent.images;
    if (imageFiles && imageFiles.length > 0) {
      galleryImages = imageFiles.map(file => ({
        url: generateFileUrl(file.filename),
        alt: file.originalname,
        caption: ''
      }));
    }

    return {
      type: 'gallery' as const,
      title: text_1 !== undefined ? text_1 : existingContent.title,
      images: galleryImages,
      layout: layout || existingContent.layout,
      columns: columns ? parseInt(columns) : existingContent.columns
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

  private async processSliderSectionUpdate(files: Express.Multer.File[], formData: any, existingContent: any) {
    const imageFiles = files.filter(file => file.fieldname === 'images');
    const { autoPlay, duration, slideData } = formData;

    let slides = existingContent.slides;
    if (imageFiles && imageFiles.length > 0) {
      let parsedSlideData: any[] = [];
      if (slideData) {
        try {
          parsedSlideData = JSON.parse(slideData);
        } catch (error) {
          throw new BadRequestException('Invalid slide data JSON format');
        }
      }

      slides = imageFiles.map((file, index) => ({
        imageUrl: generateFileUrl(file.filename),
        imageAlt: file.originalname,
        title: parsedSlideData[index]?.title || '',
        description: parsedSlideData[index]?.description || '',
        ...(parsedSlideData[index]?.ctaButton && { ctaButton: parsedSlideData[index].ctaButton })
      }));
    }

    return {
      type: 'slider' as const,
      autoPlay: autoPlay !== undefined ? (autoPlay === 'true') : existingContent.autoPlay,
      duration: duration !== undefined ? parseInt(duration) : existingContent.duration,
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