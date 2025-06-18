import Card from '@/components/Card/Card'
import ProductListTable from '@/components/ProductListTable/ProductListTable'
import React from 'react'

function Inventory() {
  return (
    <div className='w-full'>
      <h1>Products Stock</h1>

      <div className='flex gap-4 p-5 bg-white rounded-xl shadow-lg'>
        <Card title='Overall Stock' description='The total number of unique products currently in your inventory across all quantities' content="20" icon='Layers' iconColor='text-blue-400' />
        <Card title='Low Stock Items' description='Number of products with quantities at or below the predefined low stock threshold' content="20" icon='ChevronsDown' iconColor='text-red-400' />
        <Card title='Zero Stock Items' description='Count of products that currently have a quantity of zero in stock.' content="20" icon='CircleSlash2' iconColor='text-gray-400' />
      </div>

      <div className='mt-5 flex gap-4'>
        <div className='flex-2/3 wrapper p-4'>
          <ProductListTable products={[]} type='all' />
        </div>
        <div className='flex-1/3 bg-white p-3 shadow-lg'>
          <h3 className='mb-4'>
            Low Stock Products
          </h3>
          <ProductListTable products={[]} type='low-stock' />
        </div>
      </div>
    </div>
  )
}

export default Inventory