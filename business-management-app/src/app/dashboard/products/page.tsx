'use client';
import Button from '@/components/Button/Button'
import AddProductModal from '@/components/Modals/AddProductModal/AddProductModal';
import ProductListTable from '@/components/ProductListTable/ProductListTable';
import SearchBar from '@/components/SearchBar/SearchBar'
import Selector from '@/components/Selector/Selector';
import useFetchList from '@/hooks/useFetchList';
import useProductQuery from '@/hooks/useProductQuery';
import api from '@/lib/axios';
import React, { useState } from 'react'
import { useAlert } from '@/components/AlertProvider/AlertContext';

function Products() {
  const { showAlert } = useAlert();
  const [openAddProductModel, setOpenAddProductModel] = useState<boolean>(false);

  const {
    query,
    changeSearchVal,
    changeStockFilter,
    resetStockFilter,
    category_id, changeCategoryFilter,
    resetQuery
  } = useProductQuery();

  const { data: products, loading, error } = useFetchList('products', query);

  const { data: categories, loading: isLoadingCategory, error: errorCategory } = useFetchList('categories');
  const categoryOptions = categories?.reduce((acc: Record<string, string>, category: any) => {
    acc[category.category_name] = category.category_id;
    return acc;
  }, {}) || {};

  const handleAddNewProduct = async (newProduct: Product) => {
    try {
      const res = await api.post('/action/add_product', {
        newProduct
      })

      if (res.status === 200) {
        showAlert('Product added successfully!', 'success');
        resetQuery();
        return true;
      }
    } catch (error) {
      showAlert('Error adding product. Please try again.', 'error');
      console.error('Error adding product:', error);
      return false;
    }

    return false;
  }

  const handleDeleteProduct = (product_code: string) => {

  }

  const handleEditProduct = (product_code: string) => {

  }

  return (

    <div>
      <h1>Products List</h1>
      <div className='flex justify-end items-center mb-6 gap-4'>
        <Button isDisable={false} icon='Tag' title='Add Category' bg_color='gray' />
        <Button onClick={() => setOpenAddProductModel(true)} isDisable={false} icon='PlusCircle' title='Add Product' bg_color='blue' />
      </div>

      <div className='bg-white p-4 rounded-md shadow-md mb-6'>
        <div className='flex gap-4'>
          <div className='flex w-1/4 items-center'>
            <label className='mr-2'>Category:</label>
            <Selector
              options={{ 'All': '', ...categoryOptions }}
              selectedType={category_id}
              setSelectedType={changeCategoryFilter}
            />
          </div>
          <div className='w-3/4'>
            <SearchBar onSearch={changeSearchVal} bg_color='' placeholder='Search products by name or code' />
          </div>
        </div>
        <div className='mt-4'>
          <ProductListTable products={products} type='product_list' onDeleteProduct={handleDeleteProduct} onEditProduct={handleEditProduct} />
        </div>
      </div>

      <div className='flex'>
        <div>

        </div>
      </div>

      <AddProductModal
        onOpen={openAddProductModel}
        onClose={() => setOpenAddProductModel(false)}
        onAddNewProduct={handleAddNewProduct}
        categories={categories}
        categoriesLoading={isLoadingCategory}
        categoriesError={errorCategory}
      />
    </div>
  )
}

export default Products