import React, { useState } from 'react'
import ProductList from '../ProductList/ProductList'
import SearchBar from '../SearchBar/SearchBar'
import useFetchList from '@/hooks/useFetchList'
import useProductQuery from '@/hooks/useProductQuery'
import Loading from '../Loading/Loading'

type Props = {
  onClose: () => void,
  selectedProducts: Product[],
  setSelectedProducts: React.Dispatch<React.SetStateAction<Product[]>>
}

export default function AddSaleProductPopup({ onClose, selectedProducts, setSelectedProducts }: Props) {

  const { query, changeSearchVal } = useProductQuery();
  const { data: products, error, loading } = useFetchList('products', query);

  const addProduct = (product: Product) => {
    setSelectedProducts(prev => {
      let existIndex = prev.findIndex(p => p.product_code === product.product_code);

      if (existIndex !== -1) {
        let update = [...prev];
        let existProduct = update[existIndex];
        update[existIndex] = {
          ...existProduct,
          quantity_change: (existProduct.quantity_change || 1) + 1
        };
        return update;
      }

      return [...prev, { ...product, quantity_change: 1 }];
    });
  }

  return (
    <div className='overlay'>
      <div className='h-full w-full absolute' onClick={onClose}></div>
      <div className='popup'>
        <div className='wrapper p-4 flex-1/3 flex flex-col gap-3 h-full'>
          <SearchBar placeholder='Search products' onSearch={changeSearchVal} />

          {loading ? (
            <Loading state='loading' />

          ) : (
            <ProductList handleAddProduct={addProduct} selectedProducts={selectedProducts} products={products} type='sell' />
          )}
        </div>
      </div>
    </div>


  )
}