import { Injectable } from '@nestjs/common';
import { Section as PrismaSection } from '@prisma/client';
import { Section } from './entities/section.entity';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { SectionContent, SectionType } from './entities/section-types';

@Injectable()
export class SectionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Section[]> {
    const sections = await this.prisma.section.findMany({
      orderBy: { order: 'asc' },
    });
    return sections.map(this.mapPrismaToEntity);
  }

  async findById(id: string): Promise<Section | null> {
    const section = await this.prisma.section.findUnique({
      where: { id },
    });
    return section ? this.mapPrismaToEntity(section) : null;
  }

  async findByPageId(pageId: string): Promise<Section[]> {
    const sections = await this.prisma.section.findMany({
      where: { pageId },
      orderBy: { order: 'asc' },
    });
    return sections.map(this.mapPrismaToEntity);
  }

  async create(data: CreateSectionDto): Promise<Section> {
    const section = await this.prisma.section.create({
      data: {
        type: data.type,
        content: data.content as any, // Prisma expects JsonValue, we validate this beforehand
        order: data.order,
        pageId: data.pageId,
      },
    });
    return this.mapPrismaToEntity(section);
  }

  async update(id: string, data: UpdateSectionDto): Promise<Section> {
    const section = await this.prisma.section.update({
      where: { id },
      data: {
        ...(data.type && { type: data.type }),
        ...(data.content && { content: data.content as any }),
        ...(data.order !== undefined && { order: data.order }),
        ...(data.pageId && { pageId: data.pageId }),
      },
    });
    return this.mapPrismaToEntity(section);
  }

  async delete(id: string): Promise<Section> {
    const section = await this.prisma.section.delete({
      where: { id },
    });
    return this.mapPrismaToEntity(section);
  }

  private mapPrismaToEntity(prismaSection: PrismaSection): Section {
    return {
      id: prismaSection.id,
      type: prismaSection.type as SectionType,
      content: prismaSection.content as unknown as SectionContent,
      order: prismaSection.order,
      pageId: prismaSection.pageId,
    };
  }
} 