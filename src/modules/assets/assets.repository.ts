import { Injectable } from '@nestjs/common';
import { Asset } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { Repository } from '../../common/interfaces/repository.interface';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';

@Injectable()
export class AssetsRepository implements Repository<Asset> {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Asset[]> {
    return this.prisma.asset.findMany({
      orderBy: { uploadedAt: 'desc' },
    });
  }

  async findById(id: string): Promise<Asset | null> {
    return this.prisma.asset.findUnique({
      where: { id },
    });
  }

  async findByType(type: string): Promise<Asset[]> {
    return this.prisma.asset.findMany({
      where: { type },
      orderBy: { uploadedAt: 'desc' },
    });
  }

  async create(data: CreateAssetDto): Promise<Asset> {
    return this.prisma.asset.create({
      data,
    });
  }

  async update(id: string, data: UpdateAssetDto): Promise<Asset> {
    return this.prisma.asset.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Asset> {
    return this.prisma.asset.delete({
      where: { id },
    });
  }
} 