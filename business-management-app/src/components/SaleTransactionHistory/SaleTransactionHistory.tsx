import React from 'react';
import { SaleTransaction } from '@/types/SaleTransaction';
import { History, Calendar, User, ShoppingBag, DollarSign, Receipt, TrendingUp, Package } from 'lucide-react';
import formatCurrency from '@/utils/formatCurrency';
import formatDate from '@/utils/formatDate';

type Props = {
    trans: SaleTransaction[],
    type: 'order' | 'sell'
}

const SaleTransactionHistory = ({ trans, type }: Props) => {
    const getTransactionIcon = () => {
        return type === 'order' ? <Package className="h-5 w-5" /> : <Receipt className="h-5 w-5" />;
    };

    const getTransactionTitle = () => {
        return type === 'order' ? "Purchase Orders" : "Sales Transactions";
    };

    const getTransactionSubtitle = () => {
        return type === 'order' 
            ? "Track all incoming inventory orders" 
            : "Monitor completed sales transactions";
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            {getTransactionIcon()}
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                {getTransactionTitle()}
                            </h2>
                            <p className="text-sm text-gray-600">
                                {getTransactionSubtitle()}
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">
                            {trans.length}
                        </div>
                        <div className="text-sm text-gray-500">
                            {trans.length === 1 ? 'Transaction' : 'Transactions'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-6">
                {trans.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <History className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No {type === 'order' ? 'orders' : 'transactions'} yet
                        </h3>
                        <p className="text-gray-500">
                            {type === 'order' 
                                ? 'Orders will appear here once they are created' 
                                : 'Sales transactions will appear here once completed'
                            }
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {trans.map((transaction, index) => (
                            <div 
                                key={transaction.trans_id} 
                                className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors border border-gray-200"
                            >
                                {/* Transaction Header */}
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center space-x-3">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm font-medium text-gray-500">ID:</span>
                                            <span className="font-mono text-sm bg-white px-2 py-1 rounded border text-gray-700">
                                                {transaction.trans_id}
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-1 text-gray-500">
                                            <Calendar className="h-4 w-4" />
                                            <span className="text-sm">
                                                {transaction.trans_date}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="text-right">
                                            <div className="text-lg font-bold text-green-600">
                                                {formatCurrency(transaction.total_amount)}
                                            </div>
                                            <div className="text-xs text-gray-500">Total Amount</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Transaction Details */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {/* User Information */}
                                    <div className="flex items-center space-x-2">
                                        <User className="h-4 w-4 text-gray-500" />
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {transaction.username}
                                            </div>
                                            <div className="text-xs text-gray-500">Processed by</div>
                                        </div>
                                    </div>

                                    {/* Customer Information (for sales) */}
                                    {type === 'sell' && transaction.customer && (
                                        <div className="flex items-center space-x-2">
                                            <ShoppingBag className="h-4 w-4 text-gray-500" />
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {transaction.customer}
                                                </div>
                                                <div className="text-xs text-gray-500">Customer</div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Products Count */}
                                    <div className="flex items-center space-x-2">
                                        <Package className="h-4 w-4 text-gray-500" />
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {transaction.products.length} {transaction.products.length === 1 ? 'item' : 'items'}
                                            </div>
                                            <div className="text-xs text-gray-500">Products</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Products List */}
                                <div className="mt-3 pt-3 border-t border-gray-200">
                                    <div className="flex flex-wrap gap-2">
                                        {transaction.products.map((product, productIndex) => (
                                            <div 
                                                key={productIndex}
                                                className="inline-flex items-center space-x-2 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm"
                                            >
                                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                <span className="text-sm font-medium text-gray-900">
                                                    {product.product_name}
                                                </span>
                                                <span className="text-sm text-gray-500">
                                                    × {product.change_quantity} {product.unit}
                                                </span>
                                                <span className="text-sm font-medium text-green-600">
                                                    {formatCurrency(product.price_at_trans * product.change_quantity)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer with Summary */}
            {trans.length > 0 && (
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                                <TrendingUp className="h-4 w-4" />
                                <span>Total Transactions: {trans.length}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <DollarSign className="h-4 w-4" />
                                <span>
                                    Total Value: {formatCurrency(
                                        trans.reduce((sum, t) => sum + t.total_amount, 0)
                                    )}
                                </span>
                            </div>
                        </div>
                        <div className="text-sm text-gray-500">
                            Last updated: {new Date().toLocaleDateString()}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SaleTransactionHistory;
