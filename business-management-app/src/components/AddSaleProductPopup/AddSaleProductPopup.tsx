import React, { useState } from 'react'
import sampleProducts from '@/sampleData/productsData'
import ProductList from '../ProductList/ProductList'
import SearchBar from '../SearchBar/SearchBar'

type Props = {
  onClose: () => void,

}

export default function AddSaleProductPopup({ onClose }: Props) {
  const [searchVal, setSearchVal] = useState<string>("");

  return (
    <div className='overlay'>
      <div className='h-full w-full absolute' onClick={onClose}></div>
      <div className='popup'>
        <div className='wrapper p-4 flex-1/3 flex flex-col gap-3 h-full'>
          <SearchBar placeholder='Search products' onSearch={setSearchVal} />
          <ProductList products={sampleProducts} type='sell'/>
        </div>
      </div>
    </div>


  )
}