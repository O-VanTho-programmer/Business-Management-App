'use client';

import React, { useState } from 'react'
import AlertTag from '../AlertTag/AlertTag'
import ChangeQuantityModal from '../Modals/ChangeQuantityModal/ChangeQuantityModal';
import { Edit, Trash2, Package, TrendingUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import AddProductModal from '../Modals/AddProductModal/AddProductModal';
import formatCurrency from '@/utils/formatCurrency';

type Props = {
    products: Product[]
    type: 'all' | 'low-stock' | 'order_placement' | 'sell' | 'product_list',
    onQuantityChange?: (product_id: string, quantity_change: number) => void,
    onDeleteProduct?: (product_id: string) => void,
    onEditProduct?: (newProduct: Product) => Promise<boolean>;
    categories?: Category[];
    categoriesLoading?: boolean,
    categoriesError?: any,
}

export default function ProductListTable({ products, type, onQuantityChange, onDeleteProduct, onEditProduct, categories, categoriesError, categoriesLoading }: Props) {
    const [openModalChangeQuantity, setOpenModalChangeQuantity] = useState<boolean>(false);
    const [openModalEditProduct, setOpenModalEditProduct] = useState<boolean>(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    if (products.length === 0) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
                <div className="text-center">
                    <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No products available</h3>
                    <p className="text-gray-500">Start by adding products to your inventory</p>
                </div>
            </div>
        )
    }

    const getTableHeader = () => {
        const baseHeaders = [
            { key: 'code', label: 'Product Code', icon: Package },
            { key: 'product', label: 'Product Name', icon: null }
        ];

        switch (type) {
            case 'order_placement':
                return [
                    ...baseHeaders,
                    { key: 'prev', label: 'Previous Qty', icon: null },
                    { key: 'new', label: 'New Qty', icon: null },
                    { key: 'added', label: 'Added Quantity', icon: TrendingUp },
                    { key: 'actions', label: 'Actions', icon: null }
                ];
            case 'sell':
                return [
                    ...baseHeaders,
                    { key: 'quantity', label: 'Quantity', icon: Package },
                    { key: 'unitPrice', label: 'Unit Price', icon: "" },
                    { key: 'total', label: 'Total', icon: "" },
                    { key: 'actions', label: 'Actions', icon: null }
                ];
            case 'product_list':
                return [
                    ...baseHeaders,
                    { key: 'category', label: 'Category', icon: null },
                    { key: 'quantity', label: 'Stock Level', icon: Package },
                    { key: 'price', label: 'Price', icon: "" },
                    { key: 'rop', label: 'ROP', icon: AlertTriangle },
                    { key: 'actions', label: 'Actions', icon: null }
                ];
            case 'all':
                return [
                    ...baseHeaders,
                    { key: 'quantity', label: 'Stock Level', icon: Package },
                    { key: 'lastUpdate', label: 'Last Updated', icon: Clock },
                    { key: 'status', label: 'Status', icon: CheckCircle }
                ];
            default:
                return [
                    ...baseHeaders,
                    { key: 'quantity', label: 'Quantity', icon: Package },
                    { key: 'status', label: 'Status', icon: CheckCircle }
                ];
        }
    };

    const getStatusBadge = (product: Product) => {
        if (product.quantity === 0) {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    <div className="w-2 h-2 bg-red-400 rounded-full mr-1.5"></div>
                    Out of Stock
                </span>
            );
        }
        if (product.ROP && product.ROP >= product.quantity) {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mr-1.5"></div>
                    Low Stock
                </span>
            );
        }
        return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-1.5"></div>
                In Stock
            </span>
        );
    };

    const headers = getTableHeader();

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Table Header */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <Package className="h-5 w-5 text-gray-600" />
                        <h3 className="text-lg font-semibold text-gray-900">
                            {type === 'sell' && 'Sale Items'}
                            {type === 'order_placement' && 'Order Items'}
                            {type === 'product_list' && 'Product Inventory'}
                            {type === 'all' && 'All Products'}
                            {type === 'low-stock' && 'Low Stock Items'}
                        </h3>
                    </div>
                    <div className="text-sm text-gray-500">
                        {products.length} {products.length === 1 ? 'item' : 'items'}
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            {headers.map((header) => (
                                <th
                                    key={header.key}
                                    className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200"
                                >
                                    <div className="flex items-center space-x-2">
                                        {header.icon && <header.icon className="h-4 w-4" />}
                                        <span>{header.label}</span>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {products.map((product, index) => (
                            <tr
                                key={product.product_id}
                                className={`hover:bg-gray-50 transition-colors duration-150 ${
                                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                }`}
                            >
                                {/* Product Code */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <Package className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <div className="ml-3">
                                            <div className="text-sm font-medium text-gray-900 font-mono">
                                                {product.product_id}
                                            </div>
                                        </div>
                                    </div>
                                </td>

                                {/* Product Name */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">
                                        {product.product_name}
                                    </div>
                                </td>

                                {/* Order Placement Specific */}
                                {type === 'order_placement' && product.quantity_change && (
                                    <>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {product.quantity}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {product.quantity + product.quantity_change}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => {
                                                    setSelectedProduct(product);
                                                    setOpenModalChangeQuantity(true);
                                                }}
                                                className="inline-flex items-center px-3 py-1 border border-blue-300 rounded-full text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors duration-200"
                                            >
                                                <TrendingUp className="h-3 w-3 mr-1" />
                                                {product.quantity_change} {product.unit}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => onDeleteProduct?.(product.product_id)}
                                                className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors duration-200"
                                                title="Remove from order"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </>
                                )}

                                {/* Sell Specific */}
                                {type === 'sell' && product.price && product.quantity_change && onDeleteProduct && (
                                    <>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => {
                                                    setSelectedProduct(product);
                                                    setOpenModalChangeQuantity(true);
                                                }}
                                                className="inline-flex items-center px-3 py-1 border border-green-300 rounded-full text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 transition-colors duration-200"
                                            >
                                                <Package className="h-3 w-3 mr-1" />
                                                {product.quantity_change} {product.unit}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                            {formatCurrency(product.price)}/{product.unit}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                                            {formatCurrency(product.price * product.quantity_change)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => onDeleteProduct(product.product_id)}
                                                className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors duration-200"
                                                title="Remove from sale"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </>
                                )}

                                {/* Product List Specific */}
                                {(type === 'product_list' && onDeleteProduct && onEditProduct) && (
                                    <>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {product.category || "Uncategorized"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <div className="flex items-center">
                                                <Package className="h-4 w-4 text-gray-400 mr-2" />
                                                {product.quantity} {product.unit}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                            {formatCurrency(product?.price || 0)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {product.ROP ? (
                                                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-orange-100 text-orange-800">
                                                    <AlertTriangle className="h-3 w-3 mr-1" />
                                                    {product.ROP}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400">Not set</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end space-x-1">
                                                <button
                                                    onClick={() => {
                                                        setSelectedProduct(product);
                                                        setOpenModalEditProduct(true);
                                                    }}
                                                    className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                                                    title="Edit product"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => onDeleteProduct(product.product_id)}
                                                    className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors duration-200"
                                                    title="Delete product"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </>
                                )}

                                {/* All Products Specific */}
                                {type === 'all' && (
                                    <>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <div className="flex items-center">
                                                <Package className="h-4 w-4 text-gray-400 mr-2" />
                                                {product.quantity} {product.unit}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div className="flex items-center">
                                                <Clock className="h-4 w-4 text-gray-400 mr-2" />
                                                {product.update_date}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(product)}
                                        </td>
                                    </>
                                )}

                                {/* Low Stock Specific */}
                                {(type === 'low-stock') && (
                                    <>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <div className="flex items-center">
                                                <Package className="h-4 w-4 text-gray-400 mr-2" />
                                                {product.quantity} {product.unit}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(product)}
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modals */}
            <ChangeQuantityModal
                product={selectedProduct}
                onOpen={openModalChangeQuantity}
                onSaveNewQuantity={onQuantityChange}
                onClose={() => { setSelectedProduct(null); setOpenModalChangeQuantity(false) }}
                type={type}
            />

            {openModalEditProduct && selectedProduct && onEditProduct && (
                <AddProductModal
                    categories={categories}
                    categoriesError={categoriesError}
                    categoriesLoading={categoriesLoading}
                    product={selectedProduct}
                    onAddNewProduct={onEditProduct}
                    onOpen={true}
                    onClose={() => { setSelectedProduct(null); setOpenModalEditProduct(false); }}
                />
            )}
        </div>
    )
}