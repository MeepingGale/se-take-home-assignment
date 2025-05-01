import { Module, forwardRef } from '@nestjs/common';
import { BotService } from './bot.service';
import { BotGateway } from './bot.gateway';
import { OrderModule } from '../order/order.module';

@Module({
  imports: [forwardRef(() => OrderModule)],
  providers: [BotService, BotGateway],
  exports: [BotService]
})
export class BotModule {}
