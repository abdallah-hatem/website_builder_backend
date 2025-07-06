import { Module, forwardRef } from '@nestjs/common';
import { PagesController } from './pages.controller';
import { PagesService } from './pages.service';
import { PagesRepository } from './pages.repository';
import { SectionsModule } from '../sections/sections.module';

@Module({
  imports: [forwardRef(() => SectionsModule)],
  controllers: [PagesController],
  providers: [PagesService, PagesRepository],
  exports: [PagesService],
})
export class PagesModule {} 