import { Module, forwardRef } from '@nestjs/common';
import { SectionsService } from './sections.service';
import { SectionsController } from './sections.controller';
import { SectionsRepository } from './sections.repository';
import { PrismaModule } from '../../prisma/prisma.module';
import { ContentValidationService } from './services/content-validation.service';
import { SectionContentProcessorService } from './services/section-content-processor.service';
import { PagesModule } from '../pages/pages.module';

@Module({
  imports: [PrismaModule, forwardRef(() => PagesModule)],
  controllers: [SectionsController],
  providers: [
    SectionsService, 
    SectionsRepository, 
    ContentValidationService, 
    SectionContentProcessorService
  ],
  exports: [SectionsService],
})
export class SectionsModule {} 