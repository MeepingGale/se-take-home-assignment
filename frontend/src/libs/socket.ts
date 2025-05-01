'use client';

import { io, Socket } from 'socket.io-client';
import { useEffect, useState } from 'react';
import { Order, OrderType } from '@interfaces/order';
import { Bot } from '@interfaces/bot';

const SOCKET_URL = 'http://localhost:3001';

let socket: Socket | null = null;

export function useSocket() {
    const [orders, setOrders] = useState<{ pending: Order[]; completed: Order[] }>({ pending: [], completed: [] });
    const [bots, setBots] = useState<Bot[]>([]);

    useEffect(() => {
        if (!socket) {
            socket = io(SOCKET_URL);
        }

        socket.on('orders', (data: { pending: Order[]; completed: Order[] }) => {
            setOrders(data);
        });

        socket.on('bots', (data: Bot[]) => {
            setBots(data);
        });

        return () => {
            socket?.disconnect();
            socket = null;
        };
    }, []);

    const createOrder = (type: OrderType) => {
        socket?.emit('newOrder', { type });
    };

    const addBot = () => {
        socket?.emit('addBot');
    };

    const removeBot = () => {
        socket?.emit('removeBot');
    };

    return {
        orders,
        bots,
        createOrder,
        addBot,
        removeBot,
    };
}
