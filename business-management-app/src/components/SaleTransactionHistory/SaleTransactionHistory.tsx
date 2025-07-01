import React from 'react';

import { SaleTransaction } from '@/types/SaleTransaction';
type Props = {
    trans: SaleTransaction[]
}

const SaleTransactionHistory = ({trans}: Props) => {
    return (
        <div className="bg-white rounded-xl shadow-lg p-4 mt-8 w-full">
            <h2 className="text-xl font-semibold mb-4">Order History</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="px-4 py-2 text-left">Order ID</th>
                            <th className="px-4 py-2 text-left">Date</th>
                            <th className="px-4 py-2 text-left">User</th>
                            <th className="px-4 py-2 text-left">Products</th>
                            <th className="px-4 py-2 text-left">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {trans.map((order) => (
                            <tr key={order.trans_id} className="border-b last:border-b-0">
                                <td className="px-4 py-2 font-mono">{order.trans_id}</td>
                                <td className="px-4 py-2">{order.trans_date}</td>
                                <td className="px-4 py-2">{order.username}</td>
                                <td className="px-4 py-2 flex flex-wrap gap-1">
                                    {order.products.map((p, i) => (
                                        <span key={i} className="inline-block bg-gray-100 px-2 py-1 rounded">
                                            {p.product_name} x{p.change_quantity}
                                        </span>
                                    ))}
                                </td>
                                <td className="px-4 py-2">${order.total_amount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SaleTransactionHistory;
