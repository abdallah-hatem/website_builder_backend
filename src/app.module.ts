import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "./prisma/prisma.module";
import { PagesModule } from "./modules/pages/pages.module";
import { SectionsModule } from "./modules/sections/sections.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    PagesModule,
    SectionsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
