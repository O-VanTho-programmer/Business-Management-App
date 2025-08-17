import { Discount } from '@/types/Discount';
import { CircleCheck, CircleX, Edit, Trash2 } from 'lucide-react';
import React from 'react'

type Props = {
    discounts: Discount[];
    onEditDiscount: (id: string) => void;
    onDeleteDiscount: (id: string) => void;
}

export default function DiscountTable({ discounts, onEditDiscount, onDeleteDiscount }: Props) {
    if (!discounts || discounts.length === 0) {
        return (
            <div className="p-4 text-center text-gray-500">
                No discounts available.
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden w-full">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount Limit</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Minimum</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                            <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">Actions</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {discounts.length === 0 ? (
                            <tr>
                                <td colSpan={10} className="px-6 py-10 text-center text-gray-500 text-lg">No discounts found.</td>
                            </tr>
                        ) : (
                            discounts.map((discount) => (
                                <tr key={discount.code} className='h-[64px]'>

                                    <td className="px-6 h-[inherit] whitespace-nowrap text-sm font-medium text-gray-900 flex items-center gap-1">
                                        {discount.status === "ACTIVE" ? (
                                            <span className='text-green-400'><CircleCheck size={20} /></span>
                                        ) : (
                                            <span className='text-red-400'><CircleX size={20} /></span>
                                        )}
                                        {discount.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {discount.used}/{discount.usage_limit}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{discount.code}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-500 font-semibold flex items-center">
                                        {discount.type === "PERCENTAGE" ? `${discount.value} %` : `${discount.value} $`}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{discount.discount_limit}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{discount.order_minimum}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {discount.start_time}
                                        <p className="text-xs text-gray-500">{discount.start_date}</p>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {discount.end_time}
                                        <p className="text-xs text-gray-500">{discount.end_date}</p>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end space-x-2">
                                            <button
                                                onClick={() => onEditDiscount(discount.code)}
                                                className="text-blue-600 hover:text-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-full p-1"
                                                title="Edit Discount"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => onDeleteDiscount(discount.code)}
                                                className="text-red-600 hover:text-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 rounded-full p-1"
                                                title="Delete Discount"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}