import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { OrderService } from '../order/order.service';
import { Bot } from './bot.modal';

@Injectable()
export class BotService {
    private bots: Bot[] = [];
    private botId = 1;
    private emitBots: () => void = () => { };

    constructor(
        @Inject(forwardRef(() => OrderService))
        private readonly orderService: OrderService
    ) { }

    setEmitCallback(callback: () => void) {
        this.emitBots = callback;
    }

    getBots() {
        return this.bots.map(({ id, currentOrder }) => ({ id, currentOrder }))
    }

    add() {
        const bot = {
            id: this.botId++,
            busy: false,
            currentOrder: null,
            timeout: null
        };
        this.bots.push(bot);
        this.emitBots();
        this.assignOrders();
    }

    remove() {
        const bot = this.bots.pop();

        if (!bot) return;

        if (bot.currentOrder) {
            this.orderService.markOrderAsPending(bot.currentOrder.id);
            bot.currentOrder = null;
        }

        if (bot.timeout) {
            clearTimeout(bot.timeout);
            bot.timeout = null;
        }

        this.emitBots();
    }

    assignOrders() {
        for (const bot of this.bots) {
            if (bot.currentOrder) continue;

            const order = this.orderService.nextPending();

            if (!order) return;

            bot.currentOrder = order;

            this.emitBots();

            bot.timeout = setTimeout(() => {
                this.orderService.markComplete(order);
                bot.currentOrder = null;
                bot.timeout = null;
                this.emitBots();
                this.assignOrders();
            }, 10000);
        }
    }
}
