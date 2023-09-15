import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { mongoosePagination } from 'mongoose-paginate-ts';
import 'dotenv/config';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.DB_URL, {
      connectionFactory: (connection) => {
        connection.plugin(mongoosePagination);
        return connection;
      },
    }),
  ],
})
export class DatabaseModule {}
