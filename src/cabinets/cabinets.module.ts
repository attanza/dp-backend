import { Module } from '@nestjs/common';
import { CabinetsService } from './cabinets.service';
import { CabinetsController } from './cabinets.controller';
import { Cabinet, CabinetSchema } from './cabinets.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cabinet.name, schema: CabinetSchema }]),
  ],
  controllers: [CabinetsController],
  providers: [CabinetsService],
  exports: [CabinetsService],
})
export class CabinetsModule {}
