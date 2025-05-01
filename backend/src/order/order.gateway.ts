import { OnGatewayConnection, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OrderService } from './order.service';
import { OrderType } from './order.model';
import { Injectable } from '@nestjs/common';

@Injectable()
@WebSocketGateway({ cors: true })
export class OrderGateway implements OnGatewayInit, OnGatewayConnection {
    @WebSocketServer() server: Server;

    constructor(private orderService: OrderService) { }

    afterInit() {
        this.orderService.setEmitCallback(() => {
            this.server.emit('orders', this.orderService.getOrders());
        });
    }

    handleConnection(client: Socket) {
        client.emit('orders', this.orderService.getOrders());
    }

    @SubscribeMessage('newOrder')
    handleNewOrder(client: Socket, data: { type: OrderType }) {
        this.orderService.create(data.type);
    }
}
