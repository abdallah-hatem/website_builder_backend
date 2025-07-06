import { Injectable, NotFoundException, ConflictException, Inject, forwardRef } from '@nestjs/common';
import { Page } from '@prisma/client';
import { PagesRepository } from './pages.repository';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { SectionsService } from '../sections/sections.service';

// Type for Page with relations
type PageWithRelations = Page & {
  children?: PageWithRelations[];
  parent?: PageWithRelations | null;
  sections?: any[];
  fullPath?: string;
};

@Injectable()
export class PagesService {
  constructor(
    private readonly pagesRepository: PagesRepository,
    @Inject(forwardRef(() => SectionsService))
    private readonly sectionsService: SectionsService
  ) {}

  async findAll(): Promise<Page[]> {
    return this.pagesRepository.findAll();
  }

  async findById(id: string): Promise<Page> {
    const page = await this.pagesRepository.findById(id);
    if (!page) {
      throw new NotFoundException(`Page with ID ${id} not found`);
    }
    return page;
  }

  async findBySlug(slug: string): Promise<Page | null> {
    return this.pagesRepository.findBySlug(slug);
  }

  async findByFullPath(fullPath: string): Promise<Page | null> {
    // Split the path into segments
    const segments = fullPath.split('/').filter(segment => segment !== '');
    
    if (segments.length === 0) {
      return null;
    }
    
    // Start with root pages (no parent)
    let currentPage: Page | null = null;
    let currentParentId: string | null = null;
    
    for (const segment of segments) {
      const page = await this.pagesRepository.findBySlugAndParent(segment, currentParentId);
      if (!page) {
        return null;
      }
      currentPage = page;
      currentParentId = page.id;
    }
    
    return currentPage;
  }

  async getAllSlugs(): Promise<string[]> {
    const pages = await this.pagesRepository.findAll();
    return pages.map(page => page.slug);
  }

  async getAllFullPaths(): Promise<string[]> {
    const pages = await this.pagesRepository.findAll();
    return pages.map(page => this.buildFullPath(page));
  }

  async getChildren(parentId: string): Promise<PageWithRelations[]> {
    return this.pagesRepository.findChildren(parentId);
  }

  async getRootPages(): Promise<PageWithRelations[]> {
    return this.pagesRepository.findRootPages();
  }

  async getPageHierarchy(): Promise<PageWithRelations[]> {
    const rootPages = await this.pagesRepository.findRootPages();
    
    // Recursively build the hierarchy
    const buildHierarchy = async (pages: PageWithRelations[]): Promise<PageWithRelations[]> => {
      for (const page of pages) {
        if (page.children && page.children.length > 0) {
          page.children = await buildHierarchy(page.children);
        }
        page.fullPath = this.buildFullPath(page);
      }
      return pages;
    };

    return buildHierarchy(rootPages);
  }

  private buildFullPath(page: PageWithRelations): string {
    const segments: string[] = [];
    let currentPage: PageWithRelations | null = page;
    
    // Build path from current page up to root
    while (currentPage) {
      segments.unshift(currentPage.slug);
      currentPage = currentPage.parent;
    }
    
    return '/' + segments.join('/');
  }

  async create(createPageDto: CreatePageDto): Promise<Page> {
    // Check if parent exists (if parentId is provided)
    if (createPageDto.parentId) {
      await this.findById(createPageDto.parentId); // This will throw NotFoundException if parent doesn't exist
    }
    
    // Check for slug uniqueness within the same parent
    const existingPage = await this.pagesRepository.findBySlugAndParent(
      createPageDto.slug, 
      createPageDto.parentId || null
    );
    if (existingPage) {
      throw new ConflictException('Page with this slug already exists in this location');
    }
    
    return this.pagesRepository.create(createPageDto);
  }

  async update(id: string, updatePageDto: UpdatePageDto): Promise<Page> {
    await this.findById(id); // Check if page exists
    
    if (updatePageDto.slug) {
      const existingPage = await this.pagesRepository.findBySlug(updatePageDto.slug);
      if (existingPage && existingPage.id !== id) {
        throw new ConflictException('Page with this slug already exists');
      }
    }
    
    return this.pagesRepository.update(id, updatePageDto);
  }

  async delete(id: string): Promise<Page> {
    const page = await this.findById(id); // Check if page exists
    
    // Delete all sections associated with this page (and their files)
    await this.sectionsService.deleteByPageId(id);
    
    return this.pagesRepository.delete(id);
  }
} 