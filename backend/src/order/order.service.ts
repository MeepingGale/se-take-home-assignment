import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { BotService } from '../bot/bot.service';
import { Order, OrderType } from './order.model';

@Injectable()
export class OrderService {
    private orderId = 1;
    private pending: Order[] = [];
    private completed: Order[] = [];
    private emitOrders: () => void = () => { };

    constructor(
        @Inject(forwardRef(() => BotService))
        private readonly botService: BotService
    ) { }

    setEmitCallback(callback: () => void) {
        this.emitOrders = callback;
    }

    getOrders() {
        return { pending: this.pending, completed: this.completed };
    }

    create(type: OrderType) {
        const order: Order = { id: this.orderId++, type, status: 'PENDING', processing: false };
        const index = this.pending.findLastIndex(o => o.type === 'VIP');

        if (type === 'VIP' && index !== -1) {
            this.pending.splice(index + 1, 0, order);
        } else if (type === 'VIP') {
            this.pending.unshift(order);
        } else {
            this.pending.push(order);
        }

        this.emitOrders();
        this.botService.assignOrders();
    }

    nextPending() {
        for (const order of this.pending) {
            if (order.processing) continue;
            order.processing = true;
            return order;
        }

        return null
    }

    markComplete(order: Order) {
        order.status = 'COMPLETE';
        order.processing = false;
        const index = this.pending.findIndex((pendingOrder => pendingOrder.id === order.id));
        this.pending.splice(index, 1);
        this.completed.push(order);
        this.emitOrders();
    }

    markOrderAsPending(orderId: number): void {
        const order = this.pending.find((o) => o.id === orderId);
        if (order && order.status !== 'COMPLETE') {
            order.status = 'PENDING';
            order.processing = false;
            this.emitOrders();
        }
    }
}
