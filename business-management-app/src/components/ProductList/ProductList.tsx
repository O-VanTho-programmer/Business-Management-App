import { Amphora, CircleAlert, CirclePlus } from 'lucide-react'
import React from 'react'
import AlertTag from '../AlertTag/AlertTag'

type Props = {
    products: Product[]
    type: 'sell' | 'order',
    handleAddProduct: (product: Product) => void,
}

export default function ProductList({ products, type, handleAddProduct }: Props) {

    if (products.length === 0) {
        return (
            <p className='text-gray-500'>No products available</p>
        )
    }

    return (
        <div className='overflow-x-scroll'>
            {products.map((product) => {
                return (
                    <div key={product.product_code} className='mt-2 relative flex flex-col p-4 bg-white rounded-lg shadow-sm border border-gray-200
                       hover:border-blue-400 hover:shadow-md transition-all duration-300 ease-in-out group'>
                        <div className='flex justify-between items-center'>
                            <div className='flex items-center'>
                                <Amphora size={16} className='text-gray-500' />
                                <p className='ml-1 font-semibold text-base'>
                                    {product.product_name}
                                </p>
                            </div>

                            {product.quantity === 0 ? (
                                <AlertTag icon='CircleAlert' color='red' title='Out' />
                            ) : product.ROP && product.ROP > product.quantity ? (
                                <AlertTag icon='CircleAlert' color='yellow' title='Low' />
                            ) : null}


                        </div>

                        <span className='text'>CODE: {product.product_code}</span>

                        <span className='text'>{product.unit} • "$" {product.price}</span>

                        <span className='text-md font-medium text-gray-700 mt-2'>
                            Current Stock: {product.quantity} {product.unit}
                        </span>


                        <div className='absolute right-4 top-1/2 -translate-y-1/2
                            opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out'>
                            <button
                                onClick={() => handleAddProduct(product)}
                                className='cursor-pointer p-2 bg-blue-500 text-white rounded-full shadow-md
                           hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                           transition-colors duration-200'
                                aria-label={`Add ${product.product_name} to order`}
                            >
                                <CirclePlus size={24} /> 
                            </button>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}