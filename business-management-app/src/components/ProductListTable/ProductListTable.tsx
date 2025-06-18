import React from 'react'

type Props = {
    products: Product[]
    type: 'all' | 'low-stock' | 'order_placement' | 'sell'
}

export default function ProductListTable({ products, type }: Props) {
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
        <div className='wrapper border border-gray-300 overflow-hidden rounded-xl shadow-lg'>
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
                            <th className='py-3 px-6 text-left text-xs text-gray-500 tracking-wider font-bold'>Quantity</th>
                            {type === 'all' && (
                                <th className='py-3 px-6 text-left text-xs text-gray-500 tracking-wider font-bold'>Last Update</th>
                            )}

                            {type === 'sell' && (
                                <>
                                    <th className='py-3 px-6 text-left text-xs text-gray-500 tracking-wider font-bold'>Unit Price</th>
                                    <th className='py-3 px-6 text-left text-xs text-gray-500 tracking-wider font-bold'>Total</th>
                                </>
                            )}

                        </tr>
                    </thead>

                    <tbody className='divide-y divide-gray-400 text-gray-900'>
                        {products.map((product) => {
                            return (
                                <tr key={product.product_code} className='h-[50px]'>
                                    <td className='py-4 px-6 whitespace-nowrap text-sm'>{product.product_code}</td>
                                    <td className='py-4 px-6 whitespace-nowrap text-sm'>{product.product_name}</td>
                                    {type === 'order_placement' && (
                                        <>
                                            <td className='py-4 px-6 whitespace-nowrap text-sm'>{product.previous_quantity}</td>
                                            <td className='py-4 px-6 whitespace-nowrap text-sm'>{product.new_quantity}</td>
                                        </>
                                    )}
                                    <td className='py-4 px-6 whitespace-nowrap text-sm'>{product.quantity} {product.unit}</td>
                                    {product.update_date && (
                                        <td className='py-4 px-6 whitespace-nowrap text-sm'>{product.update_date}</td>
                                    )}

                                </tr>
                            )
                        })}
                    </tbody>
                    <tfoot>
                        {type === 'sell' && (
                            <tr className='h-[50px]'>
                                <td colSpan={2} className='font-bold text-lg py-4 px-6 whitespace-nowrap'>Total Price</td>
                                <td className='py-4 px-6 whitespace-nowrap text-sm'></td>
                                <td className='py-4 px-6 whitespace-nowrap text-sm'></td>
                                <td className='font-bold text-lg py-4 px-6 text-left whitespace-nowrap '>{totalPrice}</td>
                            </tr>
                        )}
                    </tfoot>
                </table>
            </div>
        </div>
    )
}