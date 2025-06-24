'use client';
import ProductListTable from '@/components/ProductListTable/ProductListTable'
import ProductList from '@/components/ProductList/ProductList';
import SearchBar from '@/components/SearchBar/SearchBar'
import React, { useEffect, useState } from 'react'
import useFetchList from '@/hooks/useFetchList';
import useQuery from '@/hooks/useQuery';

function Order() {
    const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
    const { query, updateQuery, resetQuery } = useQuery("");
    const { products, loading, error } = useFetchList("products", query);

    useEffect(() => {
        console.log(selectedProducts);
    },[selectedProducts])

    const handleAddProduct = (product: Product) => {
        setSelectedProducts(prev => {
            let existIndex = prev.findIndex(p => p.product_code === product.product_code);

            if (existIndex !== -1) {
                let updated = [...prev];
                let existProduct = updated[existIndex];

                updated[existIndex] = {
                    ...existProduct,
                    new_quantity: (existProduct.new_quantity || 1) + 1
                }

                return updated;
            }

            return [...prev, { ...product, new_quantity: 1 }];
        })
    }

    const [queryCollection, setQueryCollection] = useState({
        search: '',
        stock: ''
    });

    const changeSearchVal = (val: string) => {
        setQueryCollection(prev => {
            const updated = {
                ...prev,
                search: val
            }
            updateQuery(updated);

            return updated;
        });
    }

    return (
        <div className=''>
            <h1>Order Placement</h1>

            <div className='flex gap-4 max-h-[580px]'>
                <div className='wrapper p-4 flex-2/3'>
                    <ProductListTable products={selectedProducts} type='order_placement' />
                </div>

                <div className='wrapper p-4 flex-1/3 flex flex-col gap-3'>
                    <h3 className=''>Products List</h3>
                    <SearchBar placeholder='Search products' onSearch={changeSearchVal} />
                    <ProductList handleAddProduct={handleAddProduct} products={products} type='order' />
                </div>
            </div>
        </div>
    )
}

export default Order