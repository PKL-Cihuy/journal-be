import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { JournalController, PKLController } from '@/controller';
import { AuthMiddleware } from '@/middleware/auth.middleware';
import { FileService, JournalService, PKLService } from '@/service';

@Module({
  controllers: [PKLController, JournalController],
  providers: [PKLService, JournalService, FileService],
})
export class PKLModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(PKLController, JournalController);
  }
}
