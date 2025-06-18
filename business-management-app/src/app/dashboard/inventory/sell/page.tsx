'use client';

import AddSaleProductPopup from '@/components/AddSaleProductPopup/AddSaleProductPopup'
import ProductListTable from '@/components/ProductListTable/ProductListTable'
import { CirclePlus } from 'lucide-react'
import React, { useState } from 'react'

function SaleProduct() {
    const [openPopup, setOpenPopup] = useState<boolean>(false);

    return (
        <div>
            <h1>Sale Product</h1>
            <div className='wrapper p-4'>
                <div className='flex gap-2 mb-6 items-center'>
                    <label>Customer:</label>
                    <input type="text" className='border-b outline-none border-gray-500 w-full' />
                </div>
                <div className='flex gap-2 mb-8 items-center justify-between'>
                    <label className='text-2xl font-semibold'>Products</label>
                    <button onClick={() => setOpenPopup(true)} className='text-gray-500 hover:text-blue-500 cursor-pointer'><CirclePlus size={30} /></button>
                </div>

                <ProductListTable products={[]} type='sell' />


            </div>
            {openPopup && (
                <AddSaleProductPopup 
                    onClose={() => setOpenPopup(false)}
                />
            )}
        </div>
    )
}

export default SaleProduct