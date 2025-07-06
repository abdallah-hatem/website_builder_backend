import * as fs from 'fs';
import * as path from 'path';
import { SectionContent } from '../../modules/sections/entities/section-types';

export class FileCleanupUtil {
  
  static extractFilePaths(content: SectionContent): string[] {
    const filePaths: string[] = [];

    switch (content.type) {
      case 'image-text':
        if (content.imageUrl) {
          filePaths.push(content.imageUrl);
        }
        break;

      case 'hero':
        if (content.backgroundImage) {
          filePaths.push(content.backgroundImage);
        }
        break;

      case 'gallery':
        if (content.images) {
          content.images.forEach(image => {
            if (image.url) {
              filePaths.push(image.url);
            }
          });
        }
        break;

      case 'slider':
        if (content.slides) {
          content.slides.forEach(slide => {
            if (slide.imageUrl) {
              filePaths.push(slide.imageUrl);
            }
          });
        }
        break;

      case 'text-block':
      case 'contact-form':
        // These types don't have file assets
        break;

      default:
        console.warn(`Unknown section type: ${(content as any).type}`);
        break;
    }

    return filePaths;
  }

  static async deleteFiles(filePaths: string[]): Promise<void> {
    const deletionPromises = filePaths.map(async (filePath) => {
      try {
        // Convert URL path to actual file path
        // Remove leading slash and convert to absolute path
        const relativePath = filePath.startsWith('/') ? filePath.substring(1) : filePath;
        const absolutePath = path.join(process.cwd(), relativePath);
        
        // Check if file exists before attempting to delete
        if (fs.existsSync(absolutePath)) {
          await fs.promises.unlink(absolutePath);
          console.log(`Deleted file: ${absolutePath}`);
        } else {
          console.warn(`File not found: ${absolutePath}`);
        }
      } catch (error) {
        console.error(`Error deleting file ${filePath}:`, error);
        // Don't throw error to prevent cascade delete from failing
      }
    });

    await Promise.all(deletionPromises);
  }

  static async cleanupSectionFiles(content: SectionContent): Promise<void> {
    const filePaths = this.extractFilePaths(content);
    if (filePaths.length > 0) {
      await this.deleteFiles(filePaths);
    }
  }
} 