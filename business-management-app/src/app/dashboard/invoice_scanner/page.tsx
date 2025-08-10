'use client'
import InvoiceDisplayForm, { InvoiceData, InvoiceItem } from '@/components/InvoiceDisplayForm/InvoiceDisplayForm';
import AddScannedInvoiceModal from '@/components/Modals/AddScannedInvoiceModal/AddScannedInvoiceModal';
import api from '@/lib/axios';
import { sendImageForOCR } from '@/utils/sendImageForOCR ';
import { ShoppingBag, Upload, FileText, Code, Receipt, Camera, CheckCircle, AlertCircle } from 'lucide-react';
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
    "total_amount": "89.800.000",
  };

  const [file, setFile] = useState<File | null>(null);
  const [resultData, setResultData] = useState<InvoiceData | undefined>(undefined);
  const [resultJson, setResultJson] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRawJson, setShowRawJson] = useState(false);

  const [isOrderModalOpen, setIsOrderModalOpen] = useState<boolean>(false);

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

      setResultData(sampleInvoiceData);
    } finally {
      setLoading(false);
    }
  };

  const handleAddScannedProduct = async (items: InvoiceItem[]) => {
    try {
      const res = await api.post('/action/place_order_from_scanned_invoice', {
        items
      })

      if(res.status === 200){
        console.log("Success");
      }
    } catch (error) {
      console.log("Error add scanned products", error);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">

      <div className="max-w-6xl mx-auto py-8">
        {/* Upload Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center space-x-3">
              <div className="p-3 bg-blue-100 rounded-full">
                <Camera className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">Upload Invoice Image</h2>
            </div>
            
            <div className="max-w-md mx-auto">
              <label 
                htmlFor="invoice-image" 
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-3 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG, JPEG up to 10MB</p>
                </div>
                <input
                  id="invoice-image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const selectedFile = e.target.files?.[0] || null;
                    setFile(selectedFile);
                    setResultJson('');
                    setResultData(undefined);
                  }}
                />
              </label>
            </div>

            {file && (
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Selected: {file.name}</span>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading || !file}
              className={`inline-flex items-center px-8 py-3 rounded-lg text-white font-semibold shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                loading || !file 
                  ? 'bg-gray-400 cursor-not-allowed focus:ring-gray-400' 
                  : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-600 transform hover:scale-105'
              }`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <FileText className="h-5 w-5 mr-2" />
                  Process with OCR
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Section */}
        {(resultJson || resultData) && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* View Toggle Header */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">OCR Results</h3>
                    <p className="text-sm text-gray-600">Choose your preferred view format</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="flex bg-white rounded-lg p-1 shadow-sm border border-gray-200">
                    <button
                      onClick={() => setShowRawJson(false)}
                      className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer ${
                        !showRawJson 
                          ? 'bg-blue-600 text-white shadow-sm' 
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <Receipt className="h-4 w-4 mr-2" />
                      Formatted View
                    </button>
                    <button
                      onClick={() => setShowRawJson(true)}
                      className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer ${
                        showRawJson 
                          ? 'bg-blue-600 text-white shadow-sm' 
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <Code className="h-4 w-4 mr-2" />
                      Raw JSON
                    </button>
                  </div>
                  
                  {resultData && resultData.items.length > 0 && (
                    <button
                      onClick={() => setIsOrderModalOpen(true)}
                      className="flex items-center px-4 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transform hover:scale-105"
                    >
                      <ShoppingBag size={18} className="mr-2" />
                      Add to Order
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="p-6">
              {showRawJson ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <Code className="h-5 w-5 text-gray-600" />
                    <h4 className="text-lg font-medium text-gray-900">Raw JSON Output</h4>
                  </div>
                  <div className="bg-gray-900 text-green-400 p-6 rounded-lg overflow-x-auto">
                    <pre className="text-sm">
                      <code>{resultJson}</code>
                    </pre>
                  </div>
                </div>
              ) : (
                                 <div className="space-y-4">
                   <div className="flex items-center space-x-2 mb-4">
                     <Receipt className="h-5 w-5 text-gray-600" />
                     <h4 className="text-lg font-medium text-gray-900">Formatted Invoice</h4>
                   </div>
                   {resultData && <InvoiceDisplayForm invoice={resultData} />}
                 </div>
              )}
            </div>
          </div>
        )}

        {/* Sample Data Section */}
        {!resultData && !loading && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 bg-gray-100 rounded-full">
                <AlertCircle className="h-8 w-8 text-gray-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-gray-900">No Invoice Data</h3>
                <p className="text-sm text-gray-500">
                  Upload an invoice image above to see the extracted data here.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {resultData && (
        <AddScannedInvoiceModal
          isOpen={isOrderModalOpen}
          onClose={() => setIsOrderModalOpen(false)}
          invoiceItems={resultData.items}
          onAddScannedProducts={handleAddScannedProduct}
          title='Order'
        />
      )}
    </div>
  );
};
