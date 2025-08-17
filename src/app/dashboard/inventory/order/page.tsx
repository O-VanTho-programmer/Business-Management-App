'use client';
import ProductListTable from '@/components/ProductListTable/ProductListTable'
import ProductList from '@/components/ProductList/ProductList';
import SearchBar from '@/components/SearchBar/SearchBar'
import React, { useEffect, useState } from 'react'
import { useAlert } from '@/components/AlertProvider/AlertContext';
import useFetchList from '@/hooks/useFetchList';
import Loading from '@/components/Loading/Loading';
import Button from '@/components/Button/Button';
import api from '@/lib/axios';
import useProductQuery from '@/hooks/useProductQuery';
import SaleTransactionHistory from '@/components/SaleTransactionHistory/SaleTransactionHistory';

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
            let existIndex = prev.findIndex(p => p.product_id === product.product_id);

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

    const handleChangeQuantity = (product_id: string, quantity_change: number) => {
        setSelectedProducts(prev =>
            prev.map(product => product.product_id === product_id ? { ...product, quantity_change: quantity_change } : product)
        )
    }

    const handleDeleteOrderProduct = (product_id: string) => {
        setSelectedProducts(prev => prev.filter(p => p.product_id !== product_id));
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

    if (loading) {
        return <Loading state='loading' />;
    }

    return (
        <div className=''>
            <div className='mt-4 flex justify-between items-center gap-4 w-2/3 pr-4'>
                <h1>Order Placement</h1>

                <div className='flex gap-2'>
                    <button onClick={() => window.location.href = '/dashboard/invoice_scanner'} type="button"
                        className="relative overflow-hidden flex whitespace-nowrap items-center py-2 px-4 shadow-sm gap-2 rounded-lg
                    transition-all duration-300 ease-in-out transform cursor-pointer
                    focus:outline-none focus:ring-2 focus:ring-offset-2
                    font-semibold bg-white text-gray-800 border border-gray-300 hover:scale-105 hover:shadow-lg
                    hover:bg-gradient-to-r hover:from-purple-500 hover:via-pink-500 hover:to-red-500 hover:text-white focus:ring-blue-500">
                        Scan Invoice
                        <span className="absolute text-white top-0 right-0 px-4 py-1 text-xs tracking-wider text-center uppercase whitespace-no-wrap origin-bottom-left transform rotate-45 -translate-y-full translate-x-1/3 dark:bg-violet-600">New</span>
                    </button>

                    <Button onClick={handlePlaceOrder} icon='PackagePlus' bg_color='blue' title='Place Order' isDisable={false} />
                </div>
            </div>

            <div className='flex gap-4 max-h-[580px] mb-6'>
                <div className='wrapper p-4 flex-2/3'>
                    <ProductListTable onDeleteProduct={handleDeleteOrderProduct} onQuantityChange={handleChangeQuantity} products={selectedProducts} type='order_placement' />
                </div>

                <div className='wrapper p-4 flex-1/3 flex flex-col gap-3'>
                    <h3 className=''>Products List</h3>
                    <SearchBar placeholder='Search products by name or code' onSearch={changeSearchVal} />
                    <ProductList handleAddProduct={handleAddProduct} products={products} type='order' />
                </div>
            </div>

            {/* Order History Section */}
            <SaleTransactionHistory type='order' trans={orderHistory || []} />

        </div >
    )
}

export default Order