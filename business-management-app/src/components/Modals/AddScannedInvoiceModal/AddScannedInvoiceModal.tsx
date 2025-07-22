import Button from '@/components/Button/Button';
import ButtonIcon from '@/components/ButtonIcon/ButtonIcon';
import { InvoiceItem } from '@/components/InvoiceDisplayForm/InvoiceDisplayForm';
import formatCurrency from '@/utils/formatCurrency';
import { Edit, Save } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react'

type Props = {
  isOpen: boolean,
  onClose: () => void,
  invoiceItems: InvoiceItem[],
  onAddScannedProducts: (items: InvoiceItem[]) => void,
  title: string
}

export default function AddScannedPInvoiceModal({ isOpen, onClose, invoiceItems, onAddScannedProducts, title }: Props) {

  if (!isOpen) {
    return;
  }

  const [orderItems, setOrderItems] = useState(
    invoiceItems.map((item, index) => ({
      ...item,
      id: `${item.product_name}-${index}`,
      isSelected: false,
      isEditing: false,
    }))
  );

  useEffect(() => {
    setOrderItems(
      invoiceItems.map((item, index) => ({
        ...item,
        id: `${item.product_name}-${index}`,
        isSelected: false,
        isEditing: false,
      }))
    );
  }, [invoiceItems, isOpen]);

  const [isSelectedAll, setIsSelectedAll] = useState<boolean>(false);

  const handleSelectAll = () => {
    setOrderItems(prevItems =>
      prevItems.map(item => ({
        ...item,
        isSelected: true
      }))
    )
  }

  const handleDeselectAll = () => {
    setOrderItems(prevItems =>
      prevItems.map(item => ({
        ...item,
        isSelected: false
      }))
    )
  }

  const handleToggleSelect = useCallback((id: string) => {
    setOrderItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, isSelected: !item.isSelected, isEditing: !item.isSelected } : item
      )
    );
  }, []);

  const handleEditToggle = useCallback((id: string) => {
    setOrderItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, isEditing: !item.isEditing } : item
      )
    );
  }, []);

  const handleQuantityChange = useCallback((id: string, newQuantity: number) => {
    setOrderItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity: newQuantity, total_price: newQuantity * item.unit_price } : item
      )
    );
  }, []);

  const handleUnitPriceChange = useCallback((id: string, newUnitPrice: number) => {
    setOrderItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, unit_price: newUnitPrice, total_price: item.quantity * newUnitPrice } : item
      )
    );
  }, []);

  const handleConfirm = () => {
    // Remove {id, isSelected, isEditing} fileds
    const finalOrder = orderItems.filter(item => item.isSelected).map(({ id, isSelected, isEditing, ...rest }) => rest);
    onAddScannedProducts(finalOrder);
    onClose();
  };

  const totalSelectedAmount = orderItems
    .filter(item => item.isSelected)
    .reduce((sum, item) => sum + item.total_price, 0);

  if (!isOpen) return null;

  return (
    <div className="overlay justify-end!">
      <div className='z-0 h-full w-full absolute' onClick={onClose}></div>

      <div className={`z-10 bg-white p-4 h-full w-full md:w-1/2 lg:w-1/3 shadow-xl`}>
        <div className='pb-4 border-b border-gray-200'>
          <h2 className="text-lg font-semibold text-gray-800">Add New Product</h2>
        </div>

        <ButtonIcon icon='X' onClick={onClose} />

        <div className="p-4 overflow-y-auto h-[calc(100%-65px)] bg-gray-100">
          <div className='flex justify-between items-center mb-6'>
            <h3 className="text-2xl font-bold text-gray-800">Select Products for Order</h3>
            <Button title='Select All' isDisable={false} bg_color={isSelectedAll ? 'blue' : 'gray'} 
              onClick={() => {
                if(!isSelectedAll){
                  handleSelectAll();
                  setIsSelectedAll(true);
                }else {
                  handleDeselectAll();
                  setIsSelectedAll(false);
                }
              }} />
          </div>
          <div className="space-y-4 mb-6">
            {orderItems.length === 0 ? (
              <p className="text-gray-600 text-center py-4">No products scanned in this invoice.</p>
            ) : (
              orderItems.map((item) => (
                <div
                  key={item.id}
                  className={`bg-white p-4 rounded-lg shadow-sm border ${item.isSelected ? 'border-blue-400' : 'border-gray-200'}
                          flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-all duration-200`}
                >
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{item.product_name}</p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Qty:</span>
                      {item.isSelected && item.isEditing ? (
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 0)}
                          className="w-20 ml-2 border border-gray-300 rounded-md text-sm p-1"
                          min="0"
                        />
                      ) : (
                        <span className="ml-1">{item.quantity}</span>
                      )}
                      <span className="ml-3 font-medium">Unit Price:</span>
                      {item.isSelected && item.isEditing ? (
                        <input
                          type="number"
                          value={item.unit_price}
                          onChange={(e) => handleUnitPriceChange(item.id, parseFloat(e.target.value) || 0)}
                          className="w-28 ml-2 border border-gray-300 rounded-md text-sm p-1"
                          min="0"
                          step="any"
                        />
                      ) : (
                        <span className="ml-1">{formatCurrency(item.unit_price)}</span>
                      )}
                    </p>
                    <p className="text-md font-bold text-gray-900 mt-1">
                      Total: {formatCurrency(item.total_price)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 mt-2 sm:mt-0">
                    {item.isSelected && (
                      <button
                        onClick={() => handleEditToggle(item.id)}
                        className="p-2 rounded-full text-gray-600 hover:bg-gray-200 transition-colors"
                        title={item.isEditing ? "Save Edits" : "Edit Item"}
                      >
                        {item.isEditing ? <Save size={20} /> : <Edit size={20} />}
                      </button>
                    )}
                    <button
                      onClick={() => handleToggleSelect(item.id)}
                      className={`px-3 py-1 rounded-lg text-sm font-semibold transition-colors duration-200
                              ${item.isSelected
                          ? 'bg-red-500 text-white hover:bg-red-600'
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                    >
                      {item.isSelected ? 'Remove' : 'Add to Order'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md mt-6">
            <span className="text-lg font-bold text-gray-800">Total Selected:</span>
            <span className="text-xl font-bold text-blue-600">{formatCurrency(totalSelectedAmount)}</span>
          </div>

          <button
            onClick={handleConfirm}
            disabled={orderItems.filter(item => item.isSelected).length === 0}
            className={`w-full mt-4 py-3 px-4 rounded-lg text-white font-semibold shadow-md
                    ${orderItems.filter(item => item.isSelected).length === 0
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
              } transition-colors duration-200`}
          >
            Confirm Order ({orderItems.filter(item => item.isSelected).length} items)
          </button>
        </div>
      </div>
    </div>
  )
}