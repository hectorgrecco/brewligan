import { Module } from '@nestjs/common';
import { PackageModule } from './modules/packages/package.module';

@Module({
  imports: [PackageModule],
  controllers: [],
  providers: [],
})

export class AppModule { }
