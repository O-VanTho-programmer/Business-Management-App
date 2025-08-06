'use client';

import AddSaleProductPopup from '@/components/AddSaleProductPopup/AddSaleProductPopup'
import { useAlert } from '@/components/AlertProvider/AlertContext';
import Button from '@/components/Button/Button';
import ProductListTable from '@/components/ProductListTable/ProductListTable'
import api from '@/lib/axios';
import { CirclePlus } from 'lucide-react'
import React, { useState } from 'react'
import SaleTransactionHistory from '@/components/SaleTransactionHistory/SaleTransactionHistory';
import useFetchList from '@/hooks/useFetchList';

function SaleProduct() {
    const { showAlert } = useAlert();
    const { data: historySaleTrans } = useFetchList("sale_transaction");

    const [customerName, setCustomerName] = useState<string>("");
    const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
    const [openPopup, setOpenPopup] = useState<boolean>(false);

    const handleChangeQuantity = (product_id: string, quantity_change: number) => {
        setSelectedProducts(prev =>
            prev.map(product => product.product_id === product_id ? { ...product, quantity_change: quantity_change } : product)
        )
    }

    const handleSell = async () => {
        if (selectedProducts.length === 0) {
            showAlert("Please add product(s) for selling", 'warning');
            return;
        }

        try {
            const res = await api.post('/action/sell_products', {
                products: selectedProducts,
                userId: 'U123',
                customerName
            })

            if (res.status === 200) {
                showAlert("Update sale product successfully!", 'success');
                setSelectedProducts([]);
            }
        } catch (error) {
            console.log("Error handling selling product", error);
            showAlert('Error during updating sale product', 'error');
        }
    }

    return (
        <div>
            <h1>Sale Product</h1>
            <div className='wrapper p-4'>
                <div className='mb-6 flex justify-between'>
                    <div className='flex gap-2 items-center'>
                        <label>Customer:</label>
                        <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} type="text" className='border-b outline-none border-gray-500 w-full' />
                    </div>
                    <Button icon='ShoppingBasket' onClick={handleSell} isDisable={false} title='Add Sale' bg_color='blue'/>
                </div>
                <div className='flex gap-2 mb-8 items-center justify-between'>
                    <label className='text-2xl font-semibold'>Products</label>
                    <button onClick={() => setOpenPopup(true)} className='text-gray-500 hover:text-blue-500 cursor-pointer'><CirclePlus size={30} /></button>
                </div>

                <ProductListTable products={selectedProducts || []} onQuantityChange={handleChangeQuantity} type='sell' />


            </div>

            <SaleTransactionHistory type='sell' trans={historySaleTrans || []} />

            {openPopup && (
                <AddSaleProductPopup
                    selectedProducts={selectedProducts}
                    setSelectedProducts={setSelectedProducts}
                    onClose={() => setOpenPopup(false)}
                />
            )}
        </div>
    )
}

export default SaleProduct