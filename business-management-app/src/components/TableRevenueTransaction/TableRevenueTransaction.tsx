import formatCurrency from '@/utils/formatCurrency'
import { TrendingDown, TrendingUp, Package, User, Calendar, DollarSign, Hash } from 'lucide-react'
import React from 'react'

type Props = {
  transactions: RevenueTransaction[]
}

function TableRevenueTransaction({ transactions }: Props) {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="p-4 bg-gray-100 rounded-full">
            <Package className="h-8 w-8 text-gray-400" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-gray-900">No transactions found</h3>
            <p className="text-sm text-gray-500">There are no revenue transactions in the selected date range.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Table Header with Summary */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Revenue Transactions</h3>
              <p className="text-sm text-gray-600">Detailed view of all sales and orders</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Sales</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Orders</span>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>Date & Time</span>
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <div className="flex items-center space-x-2">
                  <Package className="h-4 w-4 text-gray-400" />
                  <span>Product Details</span>
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  <span>Unit Price</span>
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <div className="flex items-center space-x-2">
                  <Hash className="h-4 w-4 text-gray-400" />
                  <span>Quantity</span>
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  <span>Total Amount</span>
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span>Customer</span>
                </div>
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((trans, index) => (
              <tr 
                key={trans.id} 
                className={`hover:bg-gray-50 transition-colors duration-150 ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                }`}
              >
                {/* Date & Time */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {trans.date}
                  </div>
                </td>

                {/* Product Details */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Package className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">
                        {trans.product_name}
                      </div>
                      <div className="text-xs text-gray-500 font-mono">
                        #{trans.product_id}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Unit Price */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 font-medium">
                    {formatCurrency(trans.price_unit)}
                  </div>
                </td>

                {/* Quantity */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                    {trans.quantity}
                  </div>
                </td>

                {/* Total Amount */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`flex items-center space-x-2 ${
                    trans.type === 'SELL' ? 'text-green-700' : 'text-red-700'
                  }`}>
                    <div className={`p-2 rounded-lg ${
                      trans.type === 'SELL' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {trans.type === 'SELL' ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <div className={`text-sm font-bold ${
                        trans.type === 'SELL' ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {formatCurrency(trans.total_price)}
                      </div>
                      <div className={`text-xs ${
                        trans.type === 'SELL' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {trans.type === 'SELL' ? 'Sale' : 'Order'}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Customer */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <User className="h-4 w-4 text-gray-600" />
                    </div>
                    <div className="text-sm text-gray-900 font-medium">
                      {trans.customer || 'N/A'}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <span>Total Transactions: <span className="font-semibold text-gray-900">{transactions.length}</span></span>
            <span>•</span>
            <span>Sales: <span className="font-semibold text-green-700">{transactions.filter(t => t.type === 'SELL').length}</span></span>
            <span>•</span>
            <span>Orders: <span className="font-semibold text-red-700">{transactions.filter(t => t.type === 'ORDER').length}</span></span>
          </div>
          <div className="text-xs text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TableRevenueTransaction