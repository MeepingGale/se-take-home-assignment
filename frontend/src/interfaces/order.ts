export type OrderType = 'NORMAL' | 'VIP';
export type OrderStatus = 'PENDING' | 'COMPLETE';

export interface Order {
    id: number;
    type: OrderType;
    status: OrderStatus;
}