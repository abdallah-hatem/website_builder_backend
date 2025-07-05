# Section Components System

This system provides a flexible way to create different types of content sections with strongly typed validation.

## Available Component Types

### 1. Image Text Component (`image-text`)
A component with an image on one side and text content on the other.

```json
{
  "type": "image-text",
  "pageId": "page123",
  "order": 1,
  "content": {
    "type": "image-text",
    "imageUrl": "https://example.com/image.jpg",
    "imageAlt": "Beautiful landscape photo",
    "title": "Welcome to Our Service",
    "text": "We provide amazing solutions for your business needs. Our team is dedicated to delivering excellence.",
    "imagePosition": "left",
    "ctaButton": {
      "text": "Learn More",
      "url": "/about"
    }
  }
}
```

### 2. Hero Section (`hero`)
A full-width hero section with background image and call-to-action.

```json
{
  "type": "hero",
  "pageId": "page123",
  "order": 1,
  "content": {
    "type": "hero",
    "backgroundImage": "https://example.com/hero-bg.jpg",
    "backgroundImageAlt": "City skyline at sunset",
    "title": "Transform Your Business Today",
    "subtitle": "Join thousands of companies who trust our platform",
    "ctaButton": {
      "text": "Get Started Free",
      "url": "/signup"
    },
    "textAlignment": "center"
  }
}
```

### 3. Slider Component (`slider`)
An image carousel with multiple slides.

```json
{
  "type": "slider",
  "pageId": "page123",
  "order": 2,
  "content": {
    "type": "slider",
    "autoPlay": true,
    "duration": 5,
    "slides": [
      {
        "imageUrl": "https://example.com/slide1.jpg",
        "imageAlt": "Product showcase",
        "title": "Revolutionary Product",
        "description": "Experience the future of technology",
        "ctaButton": {
          "text": "Shop Now",
          "url": "/products"
        }
      },
      {
        "imageUrl": "https://example.com/slide2.jpg",
        "imageAlt": "Team collaboration",
        "title": "Built for Teams",
        "description": "Collaborate seamlessly with your team"
      }
    ]
  }
}
```

### 4. Text Block (`text-block`)
Simple text content with alignment options.

```json
{
  "type": "text-block",
  "pageId": "page123",
  "order": 3,
  "content": {
    "type": "text-block",
    "title": "About Our Mission",
    "content": "We believe in creating technology that empowers people and businesses to achieve their goals. Our platform combines cutting-edge innovation with user-friendly design.",
    "textAlignment": "center",
    "backgroundColor": "#f8f9fa"
  }
}
```

### 5. Gallery (`gallery`)
A collection of images with different layout options.

```json
{
  "type": "gallery",
  "pageId": "page123",
  "order": 4,
  "content": {
    "type": "gallery",
    "title": "Our Portfolio",
    "images": [
      {
        "url": "https://example.com/gallery1.jpg",
        "alt": "Project showcase 1",
        "caption": "E-commerce Platform"
      },
      {
        "url": "https://example.com/gallery2.jpg",
        "alt": "Project showcase 2",
        "caption": "Mobile Application"
      },
      {
        "url": "https://example.com/gallery3.jpg",
        "alt": "Project showcase 3",
        "caption": "Web Dashboard"
      }
    ],
    "layout": "grid",
    "columns": 3
  }
}
```

### 6. Contact Form (`contact-form`)
A customizable contact form with various field types.

```json
{
  "type": "contact-form",
  "pageId": "page123",
  "order": 5,
  "content": {
    "type": "contact-form",
    "title": "Get in Touch",
    "description": "We'd love to hear from you. Send us a message and we'll respond as soon as possible.",
    "fields": [
      {
        "name": "name",
        "label": "Full Name",
        "type": "text",
        "required": true,
        "placeholder": "Enter your full name"
      },
      {
        "name": "email",
        "label": "Email Address",
        "type": "email",
        "required": true,
        "placeholder": "your@email.com"
      },
      {
        "name": "company",
        "label": "Company",
        "type": "text",
        "required": false,
        "placeholder": "Your company name"
      },
      {
        "name": "subject",
        "label": "Subject",
        "type": "select",
        "required": true,
        "options": ["General Inquiry", "Support", "Sales", "Partnership"]
      },
      {
        "name": "message",
        "label": "Message",
        "type": "textarea",
        "required": true,
        "placeholder": "Tell us about your project..."
      }
    ],
    "submitButtonText": "Send Message",
    "successMessage": "Thank you! We'll get back to you soon."
  }
}
```

## API Usage

### Creating a Section
```bash
POST /sections
Content-Type: application/json

{
  "type": "image-text",
  "pageId": "page123",
  "order": 1,
  "content": {
    "imageUrl": "https://example.com/image.jpg",
    "imageAlt": "Example image",
    "title": "Section Title",
    "text": "Section content",
    "imagePosition": "left"
  }
}
```

### Validation
The system automatically validates that:
- The `type` field matches one of the supported component types
- The `content` structure matches the expected schema for that type
- All required fields are present
- Field types and values are correct (e.g., `imagePosition` must be "left" or "right")

### Error Examples
```json
{
  "statusCode": 400,
  "message": "Invalid image-text content: imagePosition is required and must be either \"left\" or \"right\", title is required and must be a string"
}
```

## Frontend Integration
Each section type has a specific structure that your frontend components can consume:

```typescript
// Frontend React component example
const renderSection = (section: Section) => {
  switch (section.type) {
    case 'image-text':
      return <ImageTextComponent content={section.content} />;
    case 'hero':
      return <HeroComponent content={section.content} />;
    case 'slider':
      return <SliderComponent content={section.content} />;
    // ... other cases
  }
};
```

This strongly-typed system ensures that your frontend components receive exactly the data structure they expect, reducing bugs and improving developer experience. 