import { Module } from '@nestjs/common';

import { AppController } from './controller';
import { AuthModule } from './modules/auth.module';
import { DatabaseModule } from './modules/database.module';
import { PKLModule } from './modules/pkl.module';

@Module({
  imports: [
    // Import all modules
    DatabaseModule,
    AuthModule,
    PKLModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
