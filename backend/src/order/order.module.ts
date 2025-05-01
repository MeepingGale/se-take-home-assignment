import { Module, forwardRef } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderGateway } from './order.gateway';
import { BotModule } from '../bot/bot.module';

@Module({
    imports: [forwardRef(() => BotModule)],
    providers: [OrderService, OrderGateway],
    exports: [OrderService]
})
export class OrderModule { }
