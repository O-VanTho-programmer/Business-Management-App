import Button from '@/components/Button/Button';
import ButtonIcon from '@/components/ButtonIcon/ButtonIcon'
import { useAlert } from '@/components/AlertProvider/AlertContext';
import { Barcode, Tag, Type } from 'lucide-react';
import React, { useState } from 'react'

type Props = {
    onOpen: boolean,
    onClose: () => void,
    onAddNewCategory: (newCategory: Category) => Promise<boolean>;
}

export default function AddCategoryModal({ onOpen, onClose, onAddNewCategory }: Props) {

    if (!onOpen) return null;

    const { showAlert } = useAlert();

    const [categoryCode, setCategoryCode] = useState<string>("");
    const [categoryName, setCategoryName] = useState<string>("");
    const [description, setDescription] = useState<string>("");

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {

        if (!categoryName.trim()) {
            showAlert('Category Name is required!', 'warning');
            return;
        }
 
        setIsSubmitting(true);

        const newCategory: Category = {
            category_id: categoryCode || undefined,
            category_name: categoryName,
            description: description || undefined
        }

        try {
            const isSuccess = await onAddNewCategory(newCategory);

            if (isSuccess) {
                setCategoryName("");
                setDescription("");
                showAlert('Category added successfully!', 'success');
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    const handleCancel = () => {
        setCategoryName("");
        setDescription("");
        onClose();
    }

    return (
        <div className="overlay justify-end!">
            <form className="bg-white h-screen min-w-[400px] shadow-lg p-6 md:p-8 max-w-2xl">
                <div className='pb-4 border-b border-gray-200'>
                    <h2 className="text-lg font-semibold text-gray-800">Add New Category</h2>
                </div>

                <ButtonIcon icon='X' onClick={onClose} />
                <div className="grid grid-cols-1 gap-6 mt-4 mb-8">
                    <div>
                        <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 mb-1">
                            Category Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <Tag size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                id="categoryName"
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                                placeholder="e.g., Organic Apples"
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="categoryCode" className="block text-sm font-medium text-gray-700 mb-1">
                            Category Code (Optional)
                        </label>
                        <div className="relative">
                            <Barcode size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                id="categoryCode"
                                value={categoryCode}
                                onChange={(e) => setCategoryCode(e.target.value)}
                                placeholder="e.g., P001 (auto-generated if empty)"
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Description (Optional)
                        </label>
                        <div className="relative">
                            <Type size={18} className="absolute left-3 top-3 text-gray-400" />
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe the category"
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            ></textarea>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4 mt-8">
                        <Button isDisable={isSubmitting} title='Cancel' onClick={handleCancel} />
                        <Button isDisable={isSubmitting} title={isSubmitting ? 'Adding Category...' : 'Add Category'} onClick={handleSubmit} bg_color='blue' />
                    </div>
                </div>
            </form>
        </div>
    )
}