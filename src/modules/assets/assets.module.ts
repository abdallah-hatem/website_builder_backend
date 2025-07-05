import { Module } from '@nestjs/common';
import { AssetsController } from './assets.controller';
import { AssetsService } from './assets.service';
import { AssetsRepository } from './assets.repository';

@Module({
  controllers: [AssetsController],
  providers: [AssetsService, AssetsRepository],
  exports: [AssetsService],
})
export class AssetsModule {} 