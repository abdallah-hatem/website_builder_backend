import { Injectable, NotFoundException } from '@nestjs/common';
import { Asset } from '@prisma/client';
import { AssetsRepository } from './assets.repository';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';

@Injectable()
export class AssetsService {
  constructor(private readonly assetsRepository: AssetsRepository) {}

  async findAll(): Promise<Asset[]> {
    return this.assetsRepository.findAll();
  }

  async findById(id: string): Promise<Asset> {
    const asset = await this.assetsRepository.findById(id);
    if (!asset) {
      throw new NotFoundException(`Asset with ID ${id} not found`);
    }
    return asset;
  }

  async findByType(type: string): Promise<Asset[]> {
    return this.assetsRepository.findByType(type);
  }

  async create(createAssetDto: CreateAssetDto): Promise<Asset> {
    return this.assetsRepository.create(createAssetDto);
  }

  async update(id: string, updateAssetDto: UpdateAssetDto): Promise<Asset> {
    await this.findById(id); // Check if asset exists
    return this.assetsRepository.update(id, updateAssetDto);
  }

  async delete(id: string): Promise<Asset> {
    await this.findById(id); // Check if asset exists
    return this.assetsRepository.delete(id);
  }
} 