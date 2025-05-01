import { OnGatewayConnection, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { BotService } from './bot.service';
import { Injectable } from '@nestjs/common';

@Injectable()
@WebSocketGateway({ cors: true })
export class BotGateway implements OnGatewayInit, OnGatewayConnection {
    @WebSocketServer() server: Server;

    constructor(private botService: BotService) { }

    afterInit() {
        this.botService.setEmitCallback(() => {
            this.server.emit('bots', this.botService.getBots());
        });
    }

    handleConnection(client: Socket) {
        client.emit('bots', this.botService.getBots());
    }

    @SubscribeMessage('addBot')
    handleAddBot() {
        this.botService.add();
    }

    @SubscribeMessage('removeBot')
    handleRemoveBot() {
        this.botService.remove();
    }
}
