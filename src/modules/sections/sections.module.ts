import { Module, forwardRef } from '@nestjs/common';
import { SectionsController } from './sections.controller';
import { SectionsService } from './sections.service';
import { SectionsRepository } from './sections.repository';
import { ContentValidationService } from './services/content-validation.service';
import { PagesModule } from '../pages/pages.module';

@Module({
  imports: [forwardRef(() => PagesModule)],
  controllers: [SectionsController],
  providers: [SectionsService, SectionsRepository, ContentValidationService],
  exports: [SectionsService],
})
export class SectionsModule {} 