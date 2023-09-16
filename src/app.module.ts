import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AssetsCategoriesModule } from './assets-categories/assets-categories.module';
import { AssetsModule } from './assets/assets.module';
import { NotifiesModule } from './notifies/notifies.module';
import { RecipientsModule } from './recipients/recipients.module';
import { StorageModule } from './storage/storage.module';
import { AttachmentsModule } from './attachments/attachments.module';
import { CabinetsModule } from './cabinets/cabinets.module';
import { FilingsModule } from './filings/filings.module';

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    AuthModule,
    AssetsCategoriesModule,
    AssetsModule,
    NotifiesModule,
    RecipientsModule,
    StorageModule,
    AttachmentsModule,
    CabinetsModule,
    FilingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
