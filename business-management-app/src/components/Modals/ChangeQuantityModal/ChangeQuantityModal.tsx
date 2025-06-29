import { useAlert } from '@/components/AlertProvider/AlertContext';
import { X } from 'lucide-react';
import React, { useState } from 'react'

type Props = {
  type: 'all' | 'low-stock' | 'order_placement' | 'sell',
  product: Product | null,
  onOpen: boolean,
  onClose: () => void,
  onSaveNewQuantity?: (product_code: string, quantity_change: number) => void
}

export default function ChangeQuantityModal({ onOpen, product, onClose, onSaveNewQuantity, type }: Props) {

  const [quantityInput, setQuantityInput] = useState<number>(1);
  const { showAlert } = useAlert(); 

  if (product === null || !onOpen) {
    return null;
  }

  const handleSave = () => {
    if(type === 'sell' && product.quantity < quantityInput){
      showAlert("Not enough available quantity!", 'error');
      return;
    }

    if (onSaveNewQuantity && product) {
      onSaveNewQuantity(product.product_code, quantityInput);
    }

    onClose();
  }

  if (type !== 'sell' && type !== 'order_placement') {
    return null;
  }

  return (
    <div>
      <div className="overlay">
        <div className="bg-white rounded-lg p-6 shadow-xl max-w-sm w-full relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 rounded-full p-1"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            {type === 'sell' ? 'Adjust quantity to Sell' : 'Add Quantity to Order'}
          </h2>

          <div className="mb-4">
            <p className="text-gray-700 text-lg font-semibold">{product.product_name}</p>
            <p className="text-gray-500 text-sm">Product Code: {product.product_code}</p>
            <p className="text-gray-500 text-sm">Current Stock: {product.quantity} {product.unit}</p>
          </div>

          <div className="mb-6">
            <label htmlFor="quantity-input" className="block text-gray-700 text-sm font-bold mb-2">
              {type === 'sell' ? 'Quantity to Sell:' : 'Quantity to Add:'}
            </label>
            <input
              type="number"
              id="quantity-input"
              value={quantityInput}
              onChange={(e) => setQuantityInput(parseInt(e.target.value) || 0)}
              min={1}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSave();
                }
              }}
            />
          </div>

          {type === 'sell' ? (
            <p className="text-gray-600 mb-6 text-sm">
              Projected Stock after selling: <span className="font-bold">{product.quantity - quantityInput} {product.unit}</span><br />
              Total Price: <span className="font-bold">${((product.price || 0) * quantityInput).toFixed(2)}</span>
            </p>
          ) : (
            <p className="text-gray-600 mb-6 text-sm">
              Projected Stock after adding: <span className="font-bold">{product.quantity + quantityInput} {product.unit}</span>
            </p>
          )}

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}