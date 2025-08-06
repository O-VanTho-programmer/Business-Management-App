import AlertTag from '@/components/AlertTag/AlertTag';
import ButtonIcon from '@/components/ButtonIcon/ButtonIcon';
import TagFilter from '@/components/TagFilter/TagFilter';
import useFetchList from '@/hooks/useFetchList';
import { Discount } from '@/types/Discount';
import { Calendar, ChevronDownIcon, Package, Plus, X } from 'lucide-react';
import React, { FormEvent, useState } from 'react'

type Props = {
  discount?: Discount | null;
  isOpen: boolean;
  isSaving: boolean;
  onSave: (discount: Discount, isUpdateMode: boolean, selectedCategories: Category[], selectedProducts: Product[]) => void;
  onClose: () => void;
}

export default function AddDiscountModal({ discount, isSaving, isOpen, onSave, onClose }: Props) {
  if (!isOpen) return null;

  const isUpdateMode = discount === null ? false : true;

  const [name, setName] = useState(discount?.name || '');
  const [description, setDescription] = useState(discount?.description || '');
  const [code, setCode] = useState(discount?.code || '');
  const [scope, setScope] = useState((!discount?.products?.length && !discount?.categories?.length) ? 'All' : 'Custom');
  const [type, setType] = useState<Discount['type']>(discount?.type || 'PERCENTAGE');
  const [value, setValue] = useState<number>(discount?.value || 0);
  const [discountLimit, setDiscountLimit] = useState<string>(discount?.discount_limit || '');
  const [usageLimit, setUsageLimit] = useState<string>(discount?.usage_limit || '');
  const [orderMinimum, setOrderMinimum] = useState<string>(discount?.order_minimum || '');
  const [status, setStatus] = useState<Discount['status']>(discount?.status || 'ACTIVE');
  
  const formatDateForInput = (dateString?: string) => {
    if (!dateString) return '';

    const date = new Date(dateString);
    return date.toISOString().slice(0, 10);
  };

  const formatTimeForInput = (timeString?: string) => {
    if (!timeString) return '00:00';
    
    // Accepts formats like "12:00 AM", "1:30 PM", etc.
    const match = timeString.match(/^(\d{1,2}):(\d{2})\s*([AP]M)?$/i);
    if (!match) return timeString; 

    let hour = parseInt(match[1], 10);
    const minute = match[2];
    const ampm = match[3]?.toUpperCase();

    if (ampm === 'PM' && hour !== 12) hour += 12;
    if (ampm === 'AM' && hour === 12) hour = 0;

    // Pad hour and minute to 2 digits
    const hourStr = hour.toString().padStart(2, '0');
    const minuteStr = minute.padStart(2, '0');
    return `${hourStr}:${minuteStr}`;
  };

  const [startDate, setStartDate] = useState(formatDateForInput(discount?.start_date));
  const [startTime, setStartTime] = useState(formatTimeForInput(discount?.start_time));
  const [endDate, setEndDate] = useState(formatDateForInput(discount?.end_date));
  const [endTime, setEndTime] = useState(formatTimeForInput(discount?.end_time));

  const { data: allProducts } = useFetchList('products');
  const { data: allCategories } = useFetchList('categories');

  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  const [selectedCategories, setSelectedCategories] = useState<Category[]>(discount?.categories || []);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>(discount?.products || []);

  const generateCode = () => {
    const randomCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    setCode(randomCode);
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const newDiscount: Discount = {
      name: name,
      code: code,
      description: description,
      type: type,
      value: value,
      discount_limit: discountLimit,
      usage_limit: usageLimit,
      used: discount?.used || 0,
      order_minimum: orderMinimum,
      status: status,
      start_time: startTime,
      end_time: endTime,
      start_date: startDate,
      end_date: endDate,
      categories: selectedCategories,
      products: selectedProducts
    }

    onSave(newDiscount, isUpdateMode, selectedCategories, selectedProducts);
  }

  const handleAddCategory = (category: Category) => {
    setSelectedCategories(prev => [...prev, category]);
  }

  const handleRemoveCategory = (categoryId: string | undefined) => {
    if (!categoryId) return;

    setSelectedCategories(prev => prev.filter(cat => cat.category_id !== categoryId));
  }

  const handleToggleProduct = (product: Product) => {
    setSelectedProducts(prev => prev.includes(product) ? prev.filter(p => p.product_id !== product.product_id) : [...prev, product]);
  }

  return (
    <div className="overlay justify-end!">
      <form onSubmit={handleSubmit} className={`h-screen min-w-[400px] shadow-lg p-6 md:px-10 md:py-4 lg:min-w-[800px] bg-white overflow-y-scroll relative transition-all duration-500 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <h3 className='mb-4'>{discount ? "Update Discount" : "Add Discount"}</h3>
        <ButtonIcon icon='X' onClick={onClose} />

        <div className='flex gap-4'>
          <div className='flex-1/2 flex flex-col gap-4'>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={isSaving}
              />
            </div>

            <div className=''>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                disabled={isSaving}
              ></textarea>
            </div>

            <div className="flex items-end gap-2 ">
              <div className="flex-1">
                <div className='flex items-center mb-1'>
                  <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">Code</label>
                  <button
                    type="button"
                    onClick={generateCode}
                    className="ml-2 px-2 py-1 text-gray-700 rounded-lg border border-gray-400 hover:bg-gray-200 transition-colors text-sm  font-medium cursor-pointer"
                    disabled={isSaving}
                  >
                    Generate
                  </button>
                </div>
                <input
                  type="text"
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                  disabled={isSaving}
                />
              </div>
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value as Discount['type'])}
                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                disabled={isSaving}
              >
                <option value="PERCENTAGE">Percentage</option>
                <option value="FIXED_AMOUNT">Fixed Amount</option>
              </select>
            </div>

            <div>
              <label htmlFor="value" className="block text-sm font-medium text-gray-700 mb-1">Value</label>
              <div className="relative">
                <input
                  type="number"
                  id="value"
                  value={value}
                  onChange={(e) => setValue(parseFloat(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-blue-500 focus:border-blue-500 pr-8"
                  required
                  min="0"
                  step={type === 'PERCENTAGE' ? "1" : "0.01"}
                  disabled={isSaving}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                  {type === 'PERCENTAGE' ? '%' : '$'}
                </span>
              </div>
            </div>

            <div>
              <label htmlFor="discountLimit" className="block text-sm font-medium text-gray-700 mb-1">Discount Limit</label>
              <div className="relative">
                <input
                  type="text"
                  id="discountLimit"
                  value={discountLimit}
                  onChange={(e) => setDiscountLimit(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-blue-500 focus:border-blue-500 pr-8"
                  placeholder="e.g., 100 $"
                  disabled={isSaving}
                />
              </div>
            </div>

            <div>
              <label htmlFor="orderMinimum" className="block text-sm font-medium text-gray-700 mb-1">Order Minimum</label>
              <div className="relative">
                <input
                  type="text"
                  id="orderMinimum"
                  value={orderMinimum}
                  onChange={(e) => setOrderMinimum(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 50 $"
                  disabled={isSaving}
                />
              </div>
            </div>

            <div>
              <label htmlFor="usageLimit" className="block text-sm font-medium text-gray-700 mb-1">Usage Limit</label>
              <div className="relative">
                <input
                  type="number"
                  id="usageLimit"
                  value={usageLimit}
                  onChange={(e) => setUsageLimit(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                  min="1"
                  disabled={isSaving}
                />
              </div>
            </div>
          </div>

          <div className='flex-1/2'>
            <div>
              <label htmlFor="scope" className="block text-sm font-medium text-gray-700 mb-1">Scope</label>
              <select
                id="scope"
                value={scope}
                onChange={(e) => setScope(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                disabled={isSaving}
              >
                <option value={"All"}>All</option>
                <option value={"Custom"}>Custom</option>
              </select>
            </div>
            {scope === 'Custom' && (
              <div className='mt-5'>
                <div className='mb-4'>
                  <h4 className='text-sm font-medium text-gray-700 mb-2'>Apply to all products in the category</h4>

                  <div className="space-y-2 relative">
                    {selectedCategories.length === 0 ? (
                      <p className="text-gray-500 text-sm py-2 px-3 bg-gray-50 rounded-lg border border-gray-200">No categories selected.</p>
                    ) : (
                      selectedCategories.map(cat => (
                        <div key={cat.category_id} className="flex items-center justify-between bg-gray-100 p-3 rounded-lg shadow-sm border border-gray-200">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-200 rounded-md">
                              <Package size={20} className="text-gray-600" />
                            </div>

                            <span className='text-gray-700'>{cat.category_name}</span>
                          </div>
                          <button
                            onClick={() => handleRemoveCategory(cat.category_id)}
                            className="text-gray-500 hover:text-gray-700 p-1 rounded-full transition-colors"
                            aria-label="Remove category"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  <button onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)} type='button' className='mt-2 w-full flex items-center cursor-pointer gap-1 text-sm font-medium justify-center py-2 border-2 border-transparent hover:border-blue-500 rounded-lg transition-all duration-300'>
                    <Plus size={16} /> Choose Category
                  </button>
                </div>
                {/* Category Dropdown */}
                {isCategoryDropdownOpen && (
                  <div className='absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-xl max-h-60 overflow-y-auto'>
                    {allCategories.map((category: Category) => {
                      const isSelected = selectedCategories.some(cat => cat.category_id === category.category_id);

                      return (
                        <div key={category.category_id} onClick={() => handleAddCategory(category)} className={`p-3 hover:bg-gray-100 cursor-pointer transition-colors border ${isSelected ? 'border-blue-500' : 'border-transparent'}`}>
                          <span className='text-sm text-gray-800'>{category.category_name}</span>
                        </div>
                      )
                    })}
                  </div>
                )}

                <div className='relative'>
                  <h4 className='text-sm font-medium text-gray-700 mb-1'>Apply to specific product</h4>
                  <div
                    className="flex items-center justify-between p-3 border border-gray-300 rounded-lg cursor-pointer bg-white shadow-sm hover:border-gray-400 transition-colors"
                    onClick={() => setIsProductDropdownOpen(!isProductDropdownOpen)}
                  >
                    <span className="text-sm text-gray-500">
                      {selectedProducts.length > 0 ? `${selectedProducts.length} sản phẩm đã chọn` : 'Chọn sản phẩm...'}
                    </span>
                    <ChevronDownIcon size={20} className={`text-gray-500 transition-transform ${isProductDropdownOpen ? 'rotate-180' : 'rotate-0'}`} />
                  </div>

                  {/* Product Dropdown */}
                  {isProductDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                      {allProducts.map((product: Product) => {
                        const isSelected = selectedProducts.some(p => p.product_id === product.product_id);
                        return (
                          <div
                            key={product.product_id}
                            className="flex items-center p-3 hover:bg-gray-100 cursor-pointer transition-colors"
                            onClick={() => handleToggleProduct(product)}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              readOnly
                              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="ml-3 text-sm text-gray-800">{product.product_name}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div className='flex flex-wrap items-center justify-start gap-1 mt-2 max-w-[344px]'>
                    {selectedProducts.map((product: Product) => {
                      return (
                        <span className='px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-600'>
                          {product.product_name}
                        </span>
                      )
                    })}
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>

        {/* Start Date, End Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <div className="relative">
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={isSaving}
              />
             </div>
          </div>
          <div>
            <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
            <div className="relative">
              <input
                type="time"
                id="startTime"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={isSaving}
              />
            </div>
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <div className="relative">
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={isSaving}
              />
            </div>
          </div>
          <div>
            <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
            <div className="relative">
              <input
                type="time"
                id="endTime"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={isSaving}
              />
            </div>
          </div>
        </div>

        {/* Active Toggle */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg shadow-sm mt-4">
          <span className="text-sm font-medium text-gray-700">Status: {status === 'ACTIVE' ? 'Active' : 'Inactive'}</span>
          <button
            type="button"
            onClick={() => setStatus(prev => prev === 'ACTIVE' ? 'IN_ACTIVE' : 'ACTIVE')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200
                      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                      ${status === 'ACTIVE' ? 'bg-blue-600' : 'bg-gray-200'}`}
            disabled={isSaving}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200
                        ${status === 'ACTIVE' ? 'translate-x-6' : 'translate-x-1'}`}
            />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg shadow-sm hover:bg-gray-300 transition-colors"
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : (discount ? 'Update Discount' : 'Add Discount')}
          </button>
        </div>
      </form>
    </div>
  )
}