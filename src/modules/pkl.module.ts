import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { FileController, JournalController, PKLController } from '@/controller';
import { AuthMiddleware } from '@/middleware/auth.middleware';
import {
  FileServeService,
  FileService,
  JournalService,
  PKLService,
} from '@/service';

@Module({
  controllers: [PKLController, JournalController, FileController],
  providers: [PKLService, JournalService, FileService, FileServeService],
})
export class PKLModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(PKLController, JournalController, FileController);
  }
}
