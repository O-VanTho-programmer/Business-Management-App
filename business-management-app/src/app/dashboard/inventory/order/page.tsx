'use client';
import ProductListTable from '@/components/ProductListTable/ProductListTable'
import ProductList from '@/components/ProductList/ProductList';
import SearchBar from '@/components/SearchBar/SearchBar'
import OrderHistory from '@/components/OrderHistory/OrderHistory';
import React, { useEffect, useState } from 'react'
import { useAlert } from '@/components/AlertProvider/AlertContext';
import useFetchList from '@/hooks/useFetchList';
import Loading from '@/components/Loading/Loading';
import Button from '@/components/Button/Button';
import api from '@/lib/axios';
import useProductQuery from '@/hooks/useProductQuery';

function Order() {
    const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
    const { showAlert } = useAlert();

    const { query, changeSearchVal } = useProductQuery();
    const { data: products, loading, error } = useFetchList("products", query);

    useEffect(() => {
        console.log(selectedProducts);
    }, [selectedProducts])

    const handleAddProduct = (product: Product) => {
        setSelectedProducts(prev => {
            let existIndex = prev.findIndex(p => p.product_code === product.product_code);

            if (existIndex !== -1) {
                let updated = [...prev];
                let existProduct = updated[existIndex];

                updated[existIndex] = {
                    ...existProduct,
                    quantity_change: (existProduct.quantity_change || 1) + 1
                }

                return updated;
            }

            return [...prev, { ...product, quantity_change: 1 }];
        })
    }

    const handleChangeQuantity = (product_code: string, quantity_change: number) => {
        setSelectedProducts(prev =>
            prev.map(product => product.product_code === product_code ? { ...product, quantity_change: quantity_change } : product)
        )
    }

    const handleDeleteOrderProduct = (product_code: string) => {
        setSelectedProducts(prev => prev.filter(p => p.product_code !== product_code));
    }

    const handlePlaceOrder = async () => {
        if (selectedProducts.length === 0) {
            showAlert('Please select at least one product to place an order.', 'warning');
            return;
        }

        try {
            const res = await api.post('/action/place_order', {
                products: selectedProducts,
                userId: 'U123',
            });

            if (res.status === 200) {
                setSelectedProducts([]);
                showAlert('Order placed successfully!', 'success');
            }
        } catch (error) {
            console.error("Error placing order:", error);
            showAlert('Failed to place order. Please try again.', 'error');
        }
    }

    const { data: orderHistory } = useFetchList("orders");

    useEffect(() => {
        console.log(orderHistory);
    }, [orderHistory])

    if (loading) {
        return <Loading state='loading' />;
    }

    return (
        <div className=''>
            <div className='mt-4 flex justify-between items-center gap-4 w-2/3 pr-4'>
                <h1>Order Placement</h1>
                <Button onClick={handlePlaceOrder} text_color='text-white' icon='PackagePlus' bg_color='blue' title='Place Order' isDisable={false} />
            </div>

            <div className='flex gap-4 max-h-[580px]'>
                <div className='wrapper p-4 flex-2/3'>
                    <ProductListTable onDeleteProduct={handleDeleteOrderProduct} onQuantityChange={handleChangeQuantity} products={selectedProducts} type='order_placement' />
                </div>

                <div className='wrapper p-4 flex-1/3 flex flex-col gap-3'>
                    <h3 className=''>Products List</h3>
                    <SearchBar placeholder='Search products' onSearch={changeSearchVal} />
                    <ProductList handleAddProduct={handleAddProduct} products={products} type='order' />
                </div>
            </div>

            {/* Order History Section */}
            <OrderHistory orders={orderHistory || []} />
        </div>
    )
}

export default Order