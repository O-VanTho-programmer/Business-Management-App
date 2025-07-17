'use client'
import InvoiceDisplayForm, { InvoiceData } from '@/components/InvoiceDisplayForm/InvoiceDisplayForm';
import { sendImageForOCR } from '@/utils/sendImageForOCR ';
import React, { useState } from 'react'

export default function InvoiceScannerPage() {
  const sampleInvoiceData: InvoiceData = {
    "store_name": "CÔNG TY TNHH CÔNG NGHỆ & GIẢI PHÁP HOÀNG GIA",
    "branch": null,
    "invoice_code": "00957AF413970D43FD9A5E4D38222F8C46",
    "tax_code": "5701392918",
    "date": "16 tháng 05 năm 2023",
    "time": null,
    "customer_name": "Công ty TNHH Đào Tạo Thiên Ứng",
    "payment_method": "Tiền mặt",
    "items": [
      {
        "product_name": "Máy điều hòa treo tường hiên Erivo V15CR32",
        "quantity": 4.00,
        "unit_price": 6300000,
        "total_price": 25200000
      },
      {
        "product_name": "Máy tính xách tay HP 1105TU, core i-10110U, 4GB,2Z6L3PA",
        "quantity": 2.00,
        "unit_price": 11500000,
        "total_price": 23000000
      },
      {
        "product_name": "Máy tính xách tay HP 15S FQ1106TU Core i3,1005G1/256GB SSD/ 15,6 inch",
        "quantity": 4.00,
        "unit_price": 9000000,
        "total_price": 36000000
      },
      {
        "product_name": "Điều hòa treo tường Casper SC-12FS32",
        "quantity": 1.00,
        "unit_price": 5600000,
        "total_price": 5600000
      }
    ],
    "subtotal": "25.200.000",
    "vat": null,
    "total_amount": "25.200.000",
  };

  const [file, setFile] = useState<File | null>(null);
  const [resultData, setResultData] = useState<InvoiceData | undefined>(undefined);
  const [resultJson, setResultJson] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRawJson, setShowRawJson] = useState(false);

  const handleSubmit = async () => {
    if (!file) return;

    setLoading(true);
    setResultJson('');
    setResultData(undefined);
    setShowRawJson(false);

    try {
      const data = await sendImageForOCR(file);

      let responseText = data.response_message;
      console.log(responseText)

      if (responseText.startsWith('```json') || responseText.startsWith('```')) {
        responseText = responseText.replace(/```json|```/g, '').trim();
      }

      setResultJson(responseText);
      const parsedInvoice = JSON.parse(responseText);

      console.log(responseText)

      // Perform a simple transformation for numerical fields if they come as strings with dots
      const transformedItems = parsedInvoice.items.map((item: any) => ({
        ...item,
        unit_price: typeof item.unit_price === 'string' ? parseFloat(item.unit_price.replace(/\./g, '')) : item.unit_price,
        total_price: typeof item.total_price === 'string' ? parseFloat(item.total_price.replace(/\./g, '')) : item.total_price
      }));

      const transformedInvoice: InvoiceData = {
        ...parsedInvoice,
        items: transformedItems,
        subtotal: typeof parsedInvoice.subtotal === 'string' ? parsedInvoice.subtotal.replace(/\./g, '') : parsedInvoice.subtotal.toString()
      };

      setResultData(transformedInvoice);
    } catch (error) {
      console.error("Error processing OCR:", error);
      setResultJson("Something went wrong in OCR API or parsing the result.");

      const errorSampleInvoiceData: InvoiceData = {
        "store_name": "Error Processing Store",
        "branch": null,
        "invoice_code": "ERROR-CODE",
        "tax_code": "N/A",
        "date": "N/A",
        "time": null,
        "customer_name": "Error Customer",
        "payment_method": "N/A",
        "items": [],
        "subtotal": "0",
        "vat": null,
        "total_amount": null,
        
      };
      setResultData(errorSampleInvoiceData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 font-sans flex flex-col items-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Invoice Scanner</h1>

      <div className="bg-white rounded-xl p-6 shadow-lg w-full max-w-2xl">
        <div className="mb-4">
          <label htmlFor="invoice-image" className="block text-gray-700 text-sm font-bold mb-2">
            Upload Invoice Image:
          </label>
          <input
            type="file"
            id="invoice-image"
            accept="image/*"
            onChange={(e) => {
              const selectedFile = e.target.files?.[0] || null;
              setFile(selectedFile);
              setResultJson('');
              setResultData(undefined);
            }}
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:border-blue-500"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading || !file}
          className={`w-full py-2 px-4 rounded-lg text-white font-semibold shadow-md
            ${loading || !file ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}
            transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2`}
        >
          {loading ? 'Processing...' : 'Submit to OCR'}
        </button>

        {/* Toggle Buttons for View */}
        {(resultJson || resultData) && ( // Only show toggle if there's data to display
          <div className="flex bg-gray-200 rounded-xl p-1 mt-6 mb-4 shadow-sm justify-center">
            <button
              onClick={() => setShowRawJson(false)}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200
                ${!showRawJson ? 'bg-white text-gray-900 shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Formatted Invoice
            </button>
            <button
              onClick={() => setShowRawJson(true)}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200
                ${showRawJson ? 'bg-white text-gray-900 shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Raw JSON
            </button>
          </div>
        )}

        {resultJson && resultData && (
          <div>
            {showRawJson ? (
              <div className="mt-4">
                <h2 className="text-xl font-semibold text-gray-700 mb-2">Raw JSON Output:</h2>
                <pre className="bg-gray-800 text-white p-4 rounded-lg text-xs overflow-x-auto">
                  <code>{resultJson}</code>
                </pre>
              </div>
            ) : (
              <div className="mt-4">
                <h2 className="text-xl font-semibold text-gray-700 mb-2">Formatted Invoice:</h2>
                <InvoiceDisplayForm invoice={resultData} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
