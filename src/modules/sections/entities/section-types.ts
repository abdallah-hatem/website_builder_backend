import { ApiProperty } from '@nestjs/swagger';

// Base interface for all section types
export interface BaseSectionContent {
  type: string;
}

// Image + Text Component
export interface ImageTextContent extends BaseSectionContent {
  type: 'image-text';
  imageUrl: string;
  imageAlt?: string;
  title: string;
  text: string;
  imagePosition: 'left' | 'right';
  ctaButton?: {
    text: string;
    url: string;
  };
}

// Slider Component
export interface SliderContent extends BaseSectionContent {
  type: 'slider';
  autoPlay?: boolean;
  duration?: number; // in seconds
  slides: Array<{
    imageUrl: string;
    imageAlt?: string;
    title?: string;
    description?: string;
    ctaButton?: {
      text: string;
      url: string;
    };
  }>;
}

// Hero Section Component
export interface HeroContent extends BaseSectionContent {
  type: 'hero';
  backgroundImage: string;
  backgroundImageAlt: string;
  title: string;
  subtitle: string;
  ctaButton: {
    text: string;
    url: string;
  };
  textAlignment: 'left' | 'center' | 'right';
}

// Text Block Component
export interface TextBlockContent extends BaseSectionContent {
  type: 'text-block';
  title?: string;
  content: string;
  textAlignment: 'left' | 'center' | 'right';
  backgroundColor?: string;
}

// Gallery Component
export interface GalleryContent extends BaseSectionContent {
  type: 'gallery';
  title?: string;
  images: Array<{
    url: string;
    alt: string;
    caption?: string;
  }>;
  layout: 'grid' | 'masonry' | 'carousel';
  columns: number;
}

// Contact Form Component
export interface ContactFormContent extends BaseSectionContent {
  type: 'contact-form';
  title: string;
  description?: string;
  fields: Array<{
    name: string;
    label: string;
    type: 'text' | 'email' | 'tel' | 'textarea' | 'select';
    required: boolean;
    placeholder?: string;
    options?: string[]; // for select fields
  }>;
  submitButtonText: string;
  successMessage: string;
}

// Union type for all possible section content types
export type SectionContent = 
  | ImageTextContent 
  | SliderContent 
  | HeroContent 
  | TextBlockContent 
  | GalleryContent 
  | ContactFormContent;

// Helper type to get content type by section type
export type GetContentByType<T extends SectionContent['type']> = 
  Extract<SectionContent, { type: T }>;

// Available section types
export const SECTION_TYPES = [
  'image-text',
  'slider', 
  'hero',
  'text-block',
  'gallery',
  'contact-form'
] as const;

export type SectionType = typeof SECTION_TYPES[number]; 