import { Order } from "./order";

export interface Bot {
    id: number;
    currentOrder: Order;
}