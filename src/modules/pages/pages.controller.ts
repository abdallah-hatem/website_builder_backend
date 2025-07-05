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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { PagesService } from './pages.service';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { Page } from './entities/page.entity';
import { ApiResponseDto } from '../../common/dto/api-response.dto';
import { ResponseInterceptor } from '../../common/interceptors/response.interceptor';

@ApiTags('pages')
@Controller('pages')
@UseInterceptors(ResponseInterceptor)
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new page' })
  @ApiResponse({ status: 201, description: 'Page created successfully', type: ApiResponseDto<Page> })
  @ApiResponse({ status: 409, description: 'Page with this slug already exists' })
  create(@Body() createPageDto: CreatePageDto) {
    return this.pagesService.create(createPageDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all pages' })
  @ApiResponse({ status: 200, description: 'List of all pages', type: ApiResponseDto<Page[]> })
  findAll() {
    return this.pagesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get page by ID' })
  @ApiParam({ name: 'id', description: 'Page ID' })
  @ApiResponse({ status: 200, description: 'Page found', type: ApiResponseDto<Page> })
  @ApiResponse({ status: 404, description: 'Page not found' })
  findOne(@Param('id') id: string) {
    return this.pagesService.findById(id);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get page by slug' })
  @ApiParam({ name: 'slug', description: 'Page slug' })
  @ApiResponse({ status: 200, description: 'Page found', type: ApiResponseDto<Page> })
  @ApiResponse({ status: 404, description: 'Page not found' })
  findBySlug(@Param('slug') slug: string) {
    return this.pagesService.findBySlug(slug);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update page by ID' })
  @ApiParam({ name: 'id', description: 'Page ID' })
  @ApiResponse({ status: 200, description: 'Page updated successfully', type: ApiResponseDto<Page> })
  @ApiResponse({ status: 404, description: 'Page not found' })
  @ApiResponse({ status: 409, description: 'Page with this slug already exists' })
  update(@Param('id') id: string, @Body() updatePageDto: UpdatePageDto) {
    return this.pagesService.update(id, updatePageDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete page by ID' })
  @ApiParam({ name: 'id', description: 'Page ID' })
  @ApiResponse({ status: 200, description: 'Page deleted successfully', type: ApiResponseDto<Page> })
  @ApiResponse({ status: 404, description: 'Page not found' })
  remove(@Param('id') id: string) {
    return this.pagesService.delete(id);
  }
} 