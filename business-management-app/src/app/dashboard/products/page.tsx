'use client';
import Button from '@/components/Button/Button'
import SearchBar from '@/components/SearchBar/SearchBar'
import React, { useState } from 'react'

function Products() {
  const [searchVal, setSearchVal] = useState<string>("");
  return (

    <div>
      <h1>Products List</h1>
      <div className='flex justify-end items-center mb-6 gap-4'>
        <Button isDisable={false} icon='Tag' title='Add Category' bg_color='gray' />

        <Button isDisable={false} icon='PlusCircle' title='Add Product' text_color='text-white' bg_color='blue' />
      </div>

      <div className='bg-white p-4 rounded-md shadow-md mb-6'>
        <SearchBar onSearch={setSearchVal} bg_color='' placeholder='Search products by name or code' />

        
      </div>

      <div className='flex'>
        <div>

        </div>
      </div>
    </div>
  )
}

export default Products