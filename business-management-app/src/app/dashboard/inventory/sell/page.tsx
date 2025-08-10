'use client';

import AddSaleProductPopup from '@/components/AddSaleProductPopup/AddSaleProductPopup'
import { useAlert } from '@/components/AlertProvider/AlertContext';
import Button from '@/components/Button/Button';
import ProductListTable from '@/components/ProductListTable/ProductListTable'
import api from '@/lib/axios';
import { CirclePlus, ShoppingCart, User, Receipt, DollarSign, Percent } from 'lucide-react'
import React, { useState } from 'react'
import SaleTransactionHistory from '@/components/SaleTransactionHistory/SaleTransactionHistory';
import useFetchList from '@/hooks/useFetchList';
import DiscountApply from '@/components/DiscountApply/DiscountApply';
import { Discount } from '@/types/Discount';
import formatCurrency from '@/utils/formatCurrency';

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

    const handleUnselectProduct = (product_id: string) => {
        setSelectedProducts(prev => prev.filter(p => p.product_id !== product_id));
    }

    const [appliedDiscount, setAppliedDiscount] = useState<Discount>();

    const calculateSubtotal = selectedProducts.reduce((acc, product) => {
        if (product.price && product.quantity_change) {
            return acc + product.price * product.quantity_change;
        }
        return acc;
    }, 0);

    const calculateDiscountedTotal = selectedProducts.reduce((acc, product) => {
        if (product.discounted_price !== undefined) {
            return acc + product.discounted_price;
        } else if (product.price && product.quantity_change) {
            return acc + product.price * product.quantity_change;
        }
        return acc;
    }, 0);

    const calculateTotal = () => {
        // If products have discounted prices, use them; otherwise use the old calculation
        if (selectedProducts.some(product => product.discounted_price !== undefined)) {
            return calculateDiscountedTotal;
        }

        let total = calculateSubtotal;
        if (appliedDiscount) {
            if (appliedDiscount.type === 'PERCENTAGE') {
                total = total - (total * appliedDiscount.value / 100);
            } else {
                total = total - appliedDiscount.value;
            }
        }

        return Math.max(0, total); // Ensure total doesn't go below 0
    };

    const handleApplyDiscount = async (discountCode: string) => {
        try {
            const res = await api.post(`valid_discount`, {
                discount_code: discountCode,
                selectedProducts
            });

            if (res.status === 200) {
                setAppliedDiscount(res.data.discount);
                setSelectedProducts(res.data.updatedProducts);
                showAlert(res.data.message, 'success');
            } else {
                showAlert(res.data.message, 'error');
            }
        } catch (error: any) {
            console.error('Error applying discount:', error);
        }
    }

    const handleRemoveDiscount = () => {
        setAppliedDiscount(undefined);
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            {/* Header Section */}
            <div className="bg-white shadow-sm border-b border-gray-200 mt-4">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <ShoppingCart className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Sales Transaction</h1>
                                <p className="text-sm text-gray-500">Create and manage customer sales</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-900">
                                    {selectedProducts.length} {selectedProducts.length === 1 ? 'item' : 'items'} selected
                                </p>
                                <p className="text-xs text-gray-500">Ready for checkout</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Customer Information Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center space-x-2 mb-4">
                                <User className="h-5 w-5 text-gray-600" />
                                <h2 className="text-lg font-semibold text-gray-900">Customer Information</h2>
                            </div>
                            <div className="flex items-end space-x-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Customer Name
                                    </label>
                                    <input
                                        value={customerName}
                                        onChange={(e) => setCustomerName(e.target.value)}
                                        type="text"
                                        placeholder="Enter customer name"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    />
                                </div>
                                <div className="flex items-end">
                                    <Button
                                        icon='ShoppingBasket'
                                        onClick={handleSell}
                                        isDisable={selectedProducts.length === 0}
                                        title='Complete Sale'
                                        bg_color='blue'
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Products Section */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center space-x-2">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <CirclePlus className="h-5 w-5 text-green-600" />
                                    </div>
                                    <h2 className="text-lg font-semibold text-gray-900">Selected Products</h2>
                                </div>
                                <button
                                    onClick={() => setOpenPopup(true)}
                                    className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm"
                                >
                                    <CirclePlus className="h-4 w-4 mr-2" />
                                    Add Product
                                </button>
                            </div>

                            {selectedProducts.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                        <ShoppingCart className="h-8 w-8 text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No products selected</h3>
                                    <p className="text-gray-500 mb-4">Add products to start a sale transaction</p>
                                    <button
                                        onClick={() => setOpenPopup(true)}
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        <CirclePlus className="h-4 w-4 mr-2" />
                                        Add First Product
                                    </button>
                                </div>
                            ) : (
                                <ProductListTable
                                    products={selectedProducts || []}
                                    onQuantityChange={handleChangeQuantity}
                                    onDeleteProduct={handleUnselectProduct}
                                    type='sell'
                                />
                            )}
                        </div>

                        {/* Discount Section */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center space-x-2 mb-4">
                                <Percent className="h-5 w-5 text-gray-600" />
                                <h2 className="text-lg font-semibold text-gray-900">Discounts & Promotions</h2>
                            </div>
                            <DiscountApply
                                onApplyDiscount={handleApplyDiscount}
                                onRemoveDiscount={handleRemoveDiscount}
                            />
                        </div>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
                            <div className="flex items-center space-x-2 mb-6">
                                <Receipt className="h-5 w-5 text-gray-600" />
                                <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
                            </div>

                            <div className="space-y-4">
                                {/* Order Stats */}
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="bg-blue-50 rounded-lg p-4 text-center">
                                        <p className="text-2xl font-bold text-blue-600">
                                            {selectedProducts.length}
                                        </p>
                                        <p className="text-sm text-blue-700">Items</p>
                                    </div>
                                    <div className="bg-green-50 rounded-lg p-4 text-center">
                                        <p className="text-2xl font-bold text-green-600">
                                            {selectedProducts.reduce((acc, product) => acc + (product.quantity_change || 0), 0)}
                                        </p>
                                        <p className="text-sm text-green-700">Quantity</p>
                                    </div>
                                </div>

                                {/* Price Breakdown */}
                                <div className="space-y-3 border-t border-gray-200 pt-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Subtotal:</span>
                                        <span className="font-semibold text-gray-900">{formatCurrency(calculateSubtotal)}</span>
                                    </div>

                                    {appliedDiscount && (
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-600">
                                                Discount ({appliedDiscount.code}):
                                            </span>
                                            <span className="text-red-600 font-medium">
                                                {appliedDiscount.type === 'PERCENTAGE'
                                                    ? `-${appliedDiscount.value}%`
                                                    : `-${formatCurrency(appliedDiscount.value)}`
                                                }
                                            </span>
                                        </div>
                                    )}

                                    <div className="border-t border-gray-200 pt-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-lg font-semibold text-gray-900">Total:</span>
                                            <span className="text-2xl font-bold text-blue-600">
                                                {formatCurrency(calculateTotal())}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="space-y-3 pt-4">
                                    <Button
                                        icon='ShoppingBasket'
                                        onClick={handleSell}
                                        isDisable={selectedProducts.length === 0}
                                        title='Complete Sale'
                                        bg_color='blue'
                                    />
                                    {selectedProducts.length > 0 && (
                                        <button
                                            onClick={() => setSelectedProducts([])}
                                            className="w-full px-4 py-3 text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                                        >
                                            Clear Cart
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Transaction History */}
                <div className="mt-12">
                    <SaleTransactionHistory type='sell' trans={historySaleTrans || []} />
                </div>
            </div>

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