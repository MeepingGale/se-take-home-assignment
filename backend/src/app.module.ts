import { Module } from '@nestjs/common';
import { OrderModule } from './order/order.module';
import { BotModule } from './bot/bot.module';

@Module({
    imports: [OrderModule, BotModule],
})
export class AppModule { }
