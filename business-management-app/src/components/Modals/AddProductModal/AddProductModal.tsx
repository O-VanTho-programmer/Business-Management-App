import { useAlert } from '@/components/AlertProvider/AlertContext';
import Button from '@/components/Button/Button';
import ButtonIcon from '@/components/ButtonIcon/ButtonIcon';
import useFetchList from '@/hooks/useFetchList';
import { AlertTriangle, Barcode, ChevronDown, DollarSign, Package, Scale, Tag, X } from 'lucide-react';
import React, { useState } from 'react'

type Props = {
    product?: Product | null,
    onOpen: boolean,
    onClose: () => void,
    onAddNewProduct: (newProduct: Product) => Promise<boolean>,
    categories?: Category[],
    categoriesLoading?: boolean,
    categoriesError?: any,
}


export default function AddProductModal({ product, onOpen, onClose, onAddNewProduct, categories, categoriesError, categoriesLoading }: Props) {
    const { showAlert } = useAlert();

    let localCategories = categories;
    let localCategoriesError = categoriesError;
    let localCategoriesLoading = categoriesLoading;

    if (!categories) {
        const { data, error, loading } = useFetchList('categories');
        localCategories = data || [];
        localCategoriesError = error;
        localCategoriesLoading = loading;
    }

    const getCategoryIdFromName = (categoryName: string | undefined) => {
        console.log(product)
        console.log(localCategories);
        if (!categoryName || !localCategories) return '';
        const found = localCategories.find((cat: Category) => cat.category_name === categoryName);
        return found ? found.category_id : '';
    };

    const [productName, setProductName] = useState(product?.product_name || '');
    const [productCode, setProductCode] = useState(product?.product_code || '');
    const [quantity, setQuantity] = useState<number | ''>(product?.quantity || '');
    const [unit, setUnit] = useState<string | ''>(product?.unit || '');
    const [price, setPrice] = useState<number | ''>(product?.price || '');
    const [cost, setCost] = useState<number | ''>(product?.cost || '');
    const [rop, setRop] = useState<number | ''>(product?.ROP || '');
    const [category, setCategory] = useState(() => product ? getCategoryIdFromName(product.category) : '');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const resetInputFields = () => {
        setProductName('');
        setProductCode('');
        setQuantity('');
        setUnit('');
        setPrice('');
        setCost('');
        setRop('');
        setCategory('');
    }

    const handleSubmit = async () => {
        if (!productName.trim() || !quantity || !unit || !price || !cost || !category) {
            showAlert('Please fill in all required fields!', 'warning');
            return;
        }

        setIsSubmitting(true);

        const newProduct: Product = {
            product_code: productCode,
            product_name: productName,
            quantity: quantity as number,
            unit: unit,
            price: price as number,
            cost: cost as number,
            ROP: rop as number,
            category: category,
        }

        try {
            const isSuccess = await onAddNewProduct(newProduct);

            if (isSuccess) {
                resetInputFields();
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    const handleCancel = () => {
        resetInputFields();
        onClose();
    }

    if (!onOpen) {
        return null;
    }

    return (
        <div className="overlay justify-end!">

            <form onSubmit={handleSubmit} className="bg-white h-screen shadow-lg p-6 md:p-8 max-w-2xl">
                <div className='pb-4 border-b border-gray-200'>
                    <h2 className="text-lg font-semibold text-gray-800">Add New Product</h2>
                </div>

                <ButtonIcon icon='X' onClick={onClose} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 mb-8">
                    <div>
                        <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-1">
                            Product Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <Package size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                id="productName"
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                                placeholder="e.g., Organic Apples"
                                className={`w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${product && product?.product_name !== productName ? "bg-blue-100 border-blue-400!" : ""}`}
                                required
                            />
                        </div>
                    </div>

                    {/* Product Code */}
                    <div>
                        <label htmlFor="productCode" className="block text-sm font-medium text-gray-700 mb-1">
                            Product Code (Optional)
                        </label>
                        <div className="relative">
                            <Barcode size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                id="productCode"
                                value={productCode}
                                onChange={(e) => setProductCode(e.target.value)}
                                placeholder="e.g., P001 (auto-generated if empty)"
                                className={`w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${product && product?.product_name !== productName ? "bg-blue-100 border-blue-400!" : ""}`}
                            />
                        </div>
                    </div>

                    {/* Quantity */}
                    <div>
                        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                            Quantity <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <Scale size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="number"
                                id="quantity"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value === '' ? '' : parseInt(e.target.value))}
                                placeholder="e.g., 100"
                                min="0"
                                className={`w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${product && quantity !== '' && product?.quantity !== quantity ? "bg-blue-100 border-blue-400!" : ""}`}
                                required
                            />
                        </div>
                    </div>

                    {/* Unit */}
                    <div>
                        <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">
                            Unit <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <Tag size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                id="unit"
                                value={unit}
                                onChange={(e) => setUnit(e.target.value)}
                                placeholder="e.g., pcs, kg, bags"
                                className={`w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${product && product?.unit !== unit ? "bg-blue-100 border-blue-400!" : ""}`}
                                required
                            />
                        </div>
                    </div>

                    {/* Price */}
                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                            Price <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <DollarSign size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="number"
                                id="price"
                                value={price}
                                onChange={(e) => setPrice(e.target.value === '' ? '' : parseFloat(e.target.value))}
                                placeholder="e.g., 1.50"
                                min="0"
                                step="0.01"
                                className={`w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${product && product?.price !== price ? "bg-blue-100 border-blue-400!" : ""}`}
                                required
                            />
                        </div>
                    </div>

                    {/* Cost */}
                    <div>
                        <label htmlFor="cost" className="block text-sm font-medium text-gray-700 mb-1">
                            Cost <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <DollarSign size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="number"
                                id="cost"
                                value={cost}
                                onChange={(e) => setCost(e.target.value === '' ? '' : parseFloat(e.target.value))}
                                placeholder="e.g., 0.80"
                                min="0"
                                step="0.01"
                                className={`w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${product && product?.cost !== cost ? "bg-blue-100 border-blue-400!" : ""}`}
                                required
                            />
                        </div>
                    </div>

                    {/* Reorder Point (ROP) */}
                    <div>
                        <label htmlFor="rop" className="block text-sm font-medium text-gray-700 mb-1">
                            Reorder Point (ROP)
                        </label>
                        <div className="relative">
                            <AlertTriangle size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="number"
                                id="rop"
                                value={rop}
                                onChange={(e) => setRop(e.target.value === '' ? '' : parseInt(e.target.value))}
                                placeholder="e.g., 50"
                                min="0"
                                className={`w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${product && product?.ROP !== rop ? "bg-blue-100 border-blue-400!" : ""}`}
                            />
                        </div>
                    </div>

                    {/* Category */}
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                            Category <span className="text-red-500">*</span>
                        </label>

                        <div className="relative">
                            <Tag size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            {localCategoriesLoading ? (
                                <input
                                    type="text"
                                    value="Loading categories..."
                                    readOnly
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                                />
                            ) : localCategoriesError ? (
                                <input
                                    type="text"
                                    value="Error loading categories"
                                    readOnly
                                    className="w-full pl-10 pr-3 py-2 border border-red-300 rounded-lg bg-red-50 text-red-700"
                                />
                            ) : (
                                <select
                                    id="category"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className={`block w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none bg-white cursor-pointe ${product && product?.category !== category ? "bg-blue-100 border-blue-400!" : ""}`}
                                    required
                                >
                                    <option value="" hidden>Select a Category</option>
                                    {localCategories && localCategories.map((cat) => (
                                        <option key={cat.category_id} value={cat.category_id}>{cat.category_name}</option>
                                    ))}
                                </select>
                            )}
                            <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4 mt-8">
                    <Button isDisable={isSubmitting} title='Cancel' onClick={handleCancel} />
                    <Button isDisable={isSubmitting} title={isSubmitting ? 'Adding Product...' : 'Add Product'} onClick={handleSubmit} bg_color='blue' />
                </div>
            </form >
        </div >
    );
};