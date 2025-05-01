"use client";

import { OrderType } from "@interfaces/order";
import { useSocket } from "@libs/socket";

export default function HomePage() {
    const { orders, bots, createOrder, addBot, removeBot } = useSocket();

    const onCreateOrder = async (orderType: OrderType) => {
        createOrder(orderType)
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8 text-center">{"McDonald's"}</h1>

            <div className="flex flex-wrap gap-4 justify-center mb-8">
                <button
                    onClick={() => onCreateOrder("NORMAL")}
                    className="bg-yellow-400 hover:bg-yellow-500 px-4 py-2 rounded"
                >
                    New Normal Order
                </button>
                <button
                    onClick={() => onCreateOrder("VIP")}
                    className="bg-red-400 hover:bg-red-500 px-4 py-2 rounded"
                >
                    New VIP Order
                </button>
                <button
                    onClick={addBot}
                    className="bg-green-400 hover:bg-green-500 px-4 py-2 rounded"
                >
                    + Bot
                </button>
                <button
                    onClick={removeBot}
                    className="bg-blue-400 hover:bg-blue-500 px-4 py-2 rounded"
                >
                    - Bot
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-2xl font-semibold mb-4">PENDING</h2>
                    <ul style={{ height: '50vh', overflow: 'hidden', overflowY: 'scroll' }}
                        className="bg-white p-4 rounded shadow">
                        {orders && orders.pending?.map((order) => (
                            <li style={{ color: 'gray' }} key={order.id} className="border-b py-2">
                                #{order.id} ({order.type})
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h2 className="text-2xl font-semibold mb-4">COMPLETED</h2>
                    <ul style={{ height: '50vh', overflow: 'hidden', overflowY: 'scroll' }}
                        className="bg-white p-4 rounded shadow">
                        {orders && orders.completed?.map((order) => (
                            <li style={{ color: 'green' }} key={order.id} className="border-b py-2">
                                #{order.id} ({order.type})
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="mt-8">
                <h2 className="text-2xl font-semibold mb-4">BOTS</h2>
                <ul style={{ height: '15vh', overflow: 'hidden', overflowY: 'scroll' }}
                    className="bg-white p-4 rounded shadow">
                    {bots.map((bot) => (
                        <li style={{ color: 'goldenrod' }} key={bot.id} className="border-b py-2">
                            Bot #{bot.id}{" "}
                            {bot.currentOrder ? `(Processing #${bot.currentOrder.id})` : "(Idle)"}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
