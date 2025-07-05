import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { AssetsService } from './assets.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { Asset } from './entities/asset.entity';
import { ApiResponseDto } from '../../common/dto/api-response.dto';
import { ResponseInterceptor } from '../../common/interceptors/response.interceptor';

@ApiTags('assets')
@Controller('assets')
@UseInterceptors(ResponseInterceptor)
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new asset' })
  @ApiResponse({ status: 201, description: 'Asset created successfully', type: ApiResponseDto<Asset> })
  create(@Body() createAssetDto: CreateAssetDto) {
    return this.assetsService.create(createAssetDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all assets' })
  @ApiQuery({ name: 'type', required: false, description: 'Filter by asset type' })
  @ApiResponse({ status: 200, description: 'List of all assets', type: ApiResponseDto<Asset[]> })
  findAll(@Query('type') type?: string) {
    if (type) {
      return this.assetsService.findByType(type);
    }
    return this.assetsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get asset by ID' })
  @ApiParam({ name: 'id', description: 'Asset ID' })
  @ApiResponse({ status: 200, description: 'Asset found', type: ApiResponseDto<Asset> })
  @ApiResponse({ status: 404, description: 'Asset not found' })
  findOne(@Param('id') id: string) {
    return this.assetsService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update asset by ID' })
  @ApiParam({ name: 'id', description: 'Asset ID' })
  @ApiResponse({ status: 200, description: 'Asset updated successfully', type: ApiResponseDto<Asset> })
  @ApiResponse({ status: 404, description: 'Asset not found' })
  update(@Param('id') id: string, @Body() updateAssetDto: UpdateAssetDto) {
    return this.assetsService.update(id, updateAssetDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete asset by ID' })
  @ApiParam({ name: 'id', description: 'Asset ID' })
  @ApiResponse({ status: 200, description: 'Asset deleted successfully', type: ApiResponseDto<Asset> })
  @ApiResponse({ status: 404, description: 'Asset not found' })
  remove(@Param('id') id: string) {
    return this.assetsService.delete(id);
  }
} 