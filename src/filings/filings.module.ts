import { Module } from '@nestjs/common';
import { FilingsService } from './filings.service';
import { FilingsController } from './filings.controller';
import { Filing, FilingSchema } from './filings.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Filing.name, schema: FilingSchema }]),
  ],
  controllers: [FilingsController],
  providers: [FilingsService],
  exports: [FilingsService],
})
export class FilingsModule {}
