'use client';
import ProductListTable from '@/components/ProductListTable/ProductListTable'
import ProductList from '@/components/ProductList/ProductList';
import SearchBar from '@/components/SearchBar/SearchBar'
import sampleProducts from '@/sampleData/productsData';
import React, { useState } from 'react'

function Order() {
    const [searchVal, setSearchVal] = useState("");
    return (
        <div className=''>
            <h1>Order Placement</h1>

            <div className='flex gap-4 max-h-[580px]'>
                <div className='wrapper p-4 flex-2/3'>
                    <ProductListTable products={[]} type='order_placement' />
                </div>

                <div className='wrapper p-4 flex-1/3 flex flex-col gap-3'>
                    <h3 className=''>Products List</h3>
                    <SearchBar placeholder='Search products' onSearch={setSearchVal} />
                    <ProductList products={sampleProducts} type='order'/>
                </div>
            </div>

        </div>
    )
}

export default Order