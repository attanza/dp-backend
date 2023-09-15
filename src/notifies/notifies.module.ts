import { Module } from '@nestjs/common';
import { NotifiesService } from './notifies.service';
import { NotifiesController } from './notifies.controller';
import { AssetsModule } from 'src/assets/assets.module';
import { Notify, NotifySchema } from './notifies.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Notify.name, schema: NotifySchema }]),
    AssetsModule,
  ],
  controllers: [NotifiesController],
  providers: [NotifiesService],
})
export class NotifiesModule {}
