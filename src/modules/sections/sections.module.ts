import { Module } from '@nestjs/common';
import { SectionsController } from './sections.controller';
import { SectionsService } from './sections.service';
import { SectionsRepository } from './sections.repository';
import { ContentValidationService } from './services/content-validation.service';

@Module({
  controllers: [SectionsController],
  providers: [SectionsService, SectionsRepository, ContentValidationService],
  exports: [SectionsService],
})
export class SectionsModule {} 