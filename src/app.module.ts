import { Module } from '@nestjs/common';

import { AuthModule } from './modules/auth.module';
import { GlobalModule } from './modules/global.module';

@Module({
  imports: [GlobalModule, AuthModule],
})
export class AppModule {}
