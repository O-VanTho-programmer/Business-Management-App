import React from 'react';

// Define interfaces for the invoice data structure
interface InvoiceItem {
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface InvoiceData {
  store_name: string;
  branch: string | null;
  invoice_code: string;
  tax_code: string;
  date: string;
  time: string | null;
  customer_name: string;
  payment_method: string;
  items: InvoiceItem[];
  subtotal: string;
  vat: string | null;
  total_amount: string | null;
}

interface InvoiceDisplayFormProps {
  invoice: InvoiceData;
}

export default function InvoiceDisplayForm({ invoice }: InvoiceDisplayFormProps) {

  const formatCurrency = (amount: number | string) => {

    const numAmount = typeof amount === 'string' ? parseFloat(amount.replace(/\./g, '')) : amount;
    return new Intl.NumberFormat('vi-VN', { // Using Vietnamese locale for currency format
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0, 
      maximumFractionDigits: 0, 
    }).format(numAmount);
  };

  return (
    <div className="bg-gray-100 p-4 sm:p-6 lg:p-8 min-h-screen font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Invoice Details</h1>

        {/* Store Information */}
        <div className="mb-8 border-b pb-4 border-gray-200">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">Store Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600 text-sm">
            <div>
              <p><span className="font-medium">Store Name:</span> {invoice.store_name}</p>
              {invoice.branch && <p><span className="font-medium">Branch:</span> {invoice.branch}</p>}
              <p><span className="font-medium">Tax Code:</span> {invoice.tax_code}</p>
            </div>
            <div>
              <p><span className="font-medium">Invoice Code:</span> {invoice.invoice_code}</p>
              <p><span className="font-medium">Date:</span> {invoice.date}</p>
              {invoice.time && <p><span className="font-medium">Time:</span> {invoice.time}</p>}
            </div>
          </div>
        </div>

        {/* Customer & Payment Information */}
        <div className="mb-8 border-b pb-4 border-gray-200">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">Customer & Payment</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600 text-sm">
            <p><span className="font-medium">Customer Name:</span> {invoice.customer_name}</p>
            <p><span className="font-medium">Payment Method:</span> {invoice.payment_method}</p>
          </div>
        </div>

        {/* Items List */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">Items Purchased</h2>
          <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product Name
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unit Price
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Price
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoice.items.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {item.product_name}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                      {item.quantity}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                      {formatCurrency(item.unit_price)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 font-semibold">
                      {formatCurrency(item.total_price)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Totals */}
        <div className="flex justify-end mt-6">
          <div className="w-full max-w-xs space-y-2 text-gray-800">
            <div className="flex justify-between text-base font-semibold">
              <span>Subtotal:</span>
              <span>{formatCurrency(invoice.subtotal)}</span>
            </div>
            {invoice.vat && (
              <div className="flex justify-between text-sm text-gray-600">
                <span>VAT:</span>
                <span>{invoice.vat}</span>
              </div>
            )}
            {/* Total is subtotal - VAT if VAT exists, or just subtotal */}
            <div className="flex justify-between text-lg font-bold text-blue-600 border-t pt-2 border-gray-300">
              <span>Grand Total:</span>
              <span>{formatCurrency(invoice.total_amount || invoice.subtotal)}</span> {/* Assuming subtotal is the final total if VAT is null */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};