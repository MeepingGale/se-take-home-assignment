import { Order } from "../order/order.model";

export interface Bot {
    id: number;
    currentOrder: Order;
    timeout: NodeJS.Timeout;
}