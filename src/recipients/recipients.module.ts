import { Module } from '@nestjs/common';
import { RecipientsService } from './recipients.service';

import { MongooseModule } from '@nestjs/mongoose';
import { RecipientsController } from './recipients.controller';
import { Recipient, RecipientSchema } from './recipients.schema';
import { UsersModule } from '../users/users.module';
import { AssetsCategoriesModule } from '../assets-categories/assets-categories.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Recipient.name, schema: RecipientSchema },
    ]),
    UsersModule,
    AssetsCategoriesModule,
  ],
  controllers: [RecipientsController],
  providers: [RecipientsService],
  exports: [RecipientsService],
})
export class RecipientsModule {}
