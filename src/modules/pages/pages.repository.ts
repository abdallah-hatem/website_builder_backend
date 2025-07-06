import { Injectable } from '@nestjs/common';
import { Page } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { Repository } from '../../common/interfaces/repository.interface';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';

// Type for Page with relations
type PageWithRelations = Page & {
  children?: PageWithRelations[];
  parent?: PageWithRelations | null;
  sections?: any[];
};

@Injectable()
export class PagesRepository implements Repository<Page> {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Page[]> {
    return this.prisma.page.findMany({
      include: {
        sections: {
          orderBy: { order: 'asc' },
        },
        children: true,
        parent: true,
      },
    });
  }

  async findById(id: string): Promise<Page | null> {
    return this.prisma.page.findUnique({
      where: { id },
      include: {
        sections: {
          orderBy: { order: 'asc' },
        },
        children: true,
        parent: true,
      },
    });
  }

  async findBySlug(slug: string): Promise<Page | null> {
    return this.prisma.page.findFirst({
      where: { 
        slug,
        parentId: null // Only find root pages with this method
      },
      include: {
        sections: {
          orderBy: { order: 'asc' },
        },
        children: true,
        parent: true,
      },
    });
  }

  async findBySlugAndParent(slug: string, parentId: string | null): Promise<Page | null> {
    return this.prisma.page.findFirst({
      where: { 
        slug,
        parentId
      },
      include: {
        sections: {
          orderBy: { order: 'asc' },
        },
        children: true,
        parent: true,
      },
    });
  }

  async findChildren(parentId: string): Promise<Page[]> {
    return this.prisma.page.findMany({
      where: { parentId },
      include: {
        sections: {
          orderBy: { order: 'asc' },
        },
        children: true,
      },
      orderBy: { title: 'asc' },
    });
  }

  async findRootPages(): Promise<Page[]> {
    return this.prisma.page.findMany({
      where: { parentId: null },
      include: {
        sections: {
          orderBy: { order: 'asc' },
        },
        children: true,
      },
      orderBy: { title: 'asc' },
    });
  }

  async create(data: CreatePageDto): Promise<Page> {
    return this.prisma.page.create({
      data,
      include: {
        sections: {
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  async update(id: string, data: UpdatePageDto): Promise<Page> {
    return this.prisma.page.update({
      where: { id },
      data,
      include: {
        sections: {
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  async delete(id: string): Promise<Page> {
    return this.prisma.page.delete({
      where: { id },
      include: {
        sections: {
          orderBy: { order: 'asc' },
        },
      },
    });
  }
} 