'use client';

import React, { useState } from 'react'
import AlertTag from '../AlertTag/AlertTag'
import ChangeQuantityModal from '../Modals/ChangeQuantityModal/ChangeQuantityModal';
import { Trash2 } from 'lucide-react';

type Props = {
    products: Product[]
    type: 'all' | 'low-stock' | 'order_placement' | 'sell',
    onQuantityChange?: (product_code: string, quantity_change: number) => void
    onDeleteProduct?: (product_code: string) => void
}

export default function ProductListTable({ products, type, onQuantityChange, onDeleteProduct }: Props) {
    const [openModalChangeQuantity, setOpenModalChangeQuantity] = useState<boolean>(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    if (products.length === 0) {
        return (
            <div className='wrapper border border-gray-300 overflow-hidden rounded-xl shadow-lg p-6'>
                <p className='text-gray-500'>No products available</p>
            </div>
        )
    }

    const totalPrice = products.reduce((acc, product) => {
        if (type === 'sell' && product.price && product.quantity) {
            return acc + product.price * product.quantity
        }
        return acc
    }, 0)

    return (
        <div className='overflow-y-scroll! max-h-[500px] wrapper border border-gray-300 rounded-xl shadow-lg'>
            <div className='overflow-x-auto'>
                <table className='w-full divide-y divide-gray-400'>
                    <thead className='bg-gray-50'>
                        <tr className='uppercase text-gray-400'>
                            <th className='py-3 px-6 text-left text-xs text-gray-500 tracking-wider font-bold'>Code</th>
                            <th className='py-3 px-6 text-left text-xs text-gray-500 tracking-wider font-bold'>Product</th>
                            {type === 'order_placement' && (
                                <>
                                    <th className='py-3 px-6 text-left text-xs text-gray-500 tracking-wider font-bold'>Prev</th>
                                    <th className='py-3 px-6 text-left text-xs text-gray-500 tracking-wider font-bold'>New</th>
                                </>
                            )}

                            <th className='py-3 px-6 text-left text-xs text-gray-500 tracking-wider font-bold'>{type === 'order_placement' ? "Added Quantity" : "Quantity"}</th>

                            {type === 'all' && (
                                <th className='py-3 px-6 text-left text-xs text-gray-500 tracking-wider font-bold'>Last Update</th>
                            )}

                            {type === 'sell' && (
                                <>
                                    <th className='py-3 px-6 text-left text-xs text-gray-500 tracking-wider font-bold'>Unit Price</th>
                                    <th className='py-3 px-6 text-left text-xs text-gray-500 tracking-wider font-bold'>Total</th>
                                </>
                            )}
                            {(type === 'low-stock' || type === 'all') && (
                                <th className='py-3 px-6 text-left text-xs text-gray-500 tracking-wider font-bold'>Status</th>
                            )}

                            {(type === 'order_placement') && (
                                <th className='py-3 px-6 text-left text-xs text-gray-500 tracking-wider font-bold'></th>
                            )}
                        </tr>
                    </thead>

                    <tbody className='divide-y divide-gray-400 text-gray-900'>
                        {products.map((product) => {

                            return (
                                <tr key={product.product_code} className='h-[50px]'>
                                    <td className='py-4 px-6 whitespace-nowrap text-sm'>{product.product_code}</td>
                                    <td className='py-4 px-6 whitespace-nowrap text-sm'>{product.product_name}</td>
                                    {type === 'order_placement' && product.quantity_change && (
                                        <>
                                            <td className='py-4 px-6 whitespace-nowrap text-sm'>{product.quantity}</td>
                                            <td className='py-4 px-6 whitespace-nowrap text-sm'>{product.quantity + product.quantity_change}</td>
                                            <td className='py-4 px-6 whitespace-nowrap text-sm cursor-pointer text-blue-600 hover:text-blue-800'
                                                onClick={() => {
                                                    setSelectedProduct(product);
                                                    setOpenModalChangeQuantity(true);
                                                }}>

                                                {product.quantity_change} {product.unit}
                                            </td>
                                            <td className='py-4 px-6 whitespace-nowrap text-sm'>
                                                <div className="flex items-center justify-end space-x-2">
                                                    <button
                                                        onClick={() => onDeleteProduct?.(product.product_code)}
                                                        className="cursor-pointer text-red-600 hover:text-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 rounded-full p-1"
                                                        title="Delete Product"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </>
                                    )}

                                    {type === 'sell' && product.price && product.quantity_change && (
                                        <>
                                            <td className='py-4 px-6 whitespace-nowrap text-sm cursor-pointer text-blue-600 hover:text-blue-800'
                                                onClick={() => {
                                                    setSelectedProduct(product);
                                                    setOpenModalChangeQuantity(true);
                                                }}>

                                                {product.quantity_change} {product.unit}
                                            </td>
                                            <td className='py-4 px-6 whitespace-nowrap text-sm'>${product.price}/{product.unit}</td>
                                            <td className='py-4 px-6 whitespace-nowrap text-sm'>${product.price * product.quantity_change}</td>
                                        </>
                                    )}

                                    {type === 'all' && (
                                        <>
                                            <td className='py-4 px-6 whitespace-nowrap text-sm'>{product.quantity} {product.unit}</td>
                                            <td className='py-4 px-6 whitespace-nowrap text-sm'>{product.update_date}</td>
                                        </>
                                    )}
                                    {(type === 'low-stock' || type === 'all') && (
                                        product.quantity === 0 ? (
                                            <td className='py-4 px-6'>
                                                <AlertTag icon='CircleAlert' color='red' title='Out' />
                                            </td>
                                        ) : product.ROP && product.ROP > product.quantity ? (
                                            <td className='py-4 px-6'>
                                                <AlertTag icon='CircleAlert' color='yellow' title='Low' />
                                            </td>
                                        ) : null
                                    )}

                                </tr>
                            )
                        })}
                    </tbody>
                    <tfoot>
                        {type === 'sell' && (
                            <tr className='h-[50px] text-blue-700'>
                                <td colSpan={2} className='font-bold text-lg py-4 px-6 whitespace-nowrap'>Total Price</td>
                                <td className='py-4 px-6 whitespace-nowrap text-sm'></td>
                                <td className='py-4 px-6 whitespace-nowrap text-sm'></td>
                                <td className='font-bold text-lg py-4 px-6 text-left whitespace-nowrap '>${totalPrice}</td>
                            </tr>
                        )}
                    </tfoot>
                </table>
            </div>

            <ChangeQuantityModal
                product={selectedProduct}
                onOpen={openModalChangeQuantity}
                onSaveNewQuantity={onQuantityChange}
                onClose={() => setOpenModalChangeQuantity(false)}
                type={type}
            />
        </div >
    )
}