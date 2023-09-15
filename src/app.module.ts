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

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    AuthModule,
    AssetsCategoriesModule,
    AssetsModule,
    NotifiesModule,
    RecipientsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
