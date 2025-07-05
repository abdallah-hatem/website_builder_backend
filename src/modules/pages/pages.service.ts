import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { Page } from '@prisma/client';
import { PagesRepository } from './pages.repository';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';

@Injectable()
export class PagesService {
  constructor(private readonly pagesRepository: PagesRepository) {}

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

  async create(createPageDto: CreatePageDto): Promise<Page> {
    const existingPage = await this.pagesRepository.findBySlug(createPageDto.slug);
    if (existingPage) {
      throw new ConflictException('Page with this slug already exists');
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
    await this.findById(id); // Check if page exists
    return this.pagesRepository.delete(id);
  }
} 