import { Package } from 'lucide-react';
import React from 'react'
import AlertTag from '../AlertTag/AlertTag';

type Props = {
    products: Product[],
    pendingChanges: {[code: string]: number | null},
    onRopChange: (product_code: string, newROP: number | null) => void;
}

export default function TableSetROP({ products, pendingChanges, onRopChange }: Props) {
    return (
        <div className='bg-white w-full border border-gray-300 overflow-hidden rounded-xl shadow-lg'>
            <div className='overflow-x-auto'>

                <table className='min-w-full divide-y divide-gray-400'>
                    <thead className='bg-gray-50'>
                        <tr className='uppercase text-gray-400'>
                            <th className='py-3 px-6 text-left text-xs text-gray-500 tracking-wider font-bold'>Product</th>
                            <th className='py-3 px-6 text-left text-xs text-gray-500 tracking-wider font-bold'>Current Stock</th>
                            <th className='py-3 px-6 text-left text-xs text-gray-500 tracking-wider font-bold'>Reorder Point (ROP)</th>
                            <th className='py-3 px-6 text-left text-xs text-gray-500 tracking-wider font-bold'>Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {products.map((product) => {

                            const displayROP = (pendingChanges[product.product_code] === null || pendingChanges[product.product_code] === undefined ? product.ROP : pendingChanges[product.product_code])
                            const isLowStock = product.ROP !== undefined && product.ROP > product.quantity;
                            const isOutOfStock = product.quantity === 0;

                            return (
                                <tr key={product.product_code}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <Package size={18} className="text-gray-500 mr-2" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{product.product_name}</p>
                                                <p className="text-xs text-gray-500">CODE: {product.product_code}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {product.quantity} {product.unit}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <input
                                            type="number"
                                            min="0"
                                            value={displayROP === null || displayROP === undefined ? '' : displayROP}
                                            onChange={(e) => onRopChange(product.product_code, e.target.value === '' ? null : parseInt(e.target.value))}
                                            className="w-24 border border-gray-300 rounded-md p-2 text-sm text-center
                                 focus:ring-blue-500 focus:border-blue-500 transition-all duration-150"
                                            placeholder="Set ROP"
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {isOutOfStock ? (
                                            <AlertTag icon='CircleAlert' color='red' title='Out of Stock' />
                                        ) : isLowStock ? (
                                            <AlertTag icon='CircleAlert' color='yellow' title='Low Stock' />
                                        ) : (
                                            <AlertTag icon='CircleCheck' color='green' title='In Stock' />
                                        )}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}