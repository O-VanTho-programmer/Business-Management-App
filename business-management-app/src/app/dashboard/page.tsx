import Card from '@/components/Card/Card';
import ProductListTable from '@/components/ProductListTable/ProductListTable';
import React from 'react'

function page() {
  const date = new Date().toLocaleDateString('vn-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });

  return (
    <div>
      <h1 className='leading-[42px]! mt-6 font-medium!'>Hello!</h1>
      <p className='mt-2'>{date}</p>

      <div className='flex gap-4 mt-8'>
        <Card title='Add Products' description='Place orders to restock inventory.' icon='CirclePlus' iconColor='text-blue-400' />
        <Card title='Revenue Record' description='Track the revenue generated from product sales.' icon='ChartNoAxesCombined' iconColor='text-green-400' />
      </div>

      <div className='flex gap-4'>
        <div className='flex-3/5'>
          <h2 className='mt-8 mb-4 text-lg font-semibold'>Product List</h2>
          <ProductListTable products={[]} type='low-stock' />
        </div>

        <div className='flex-2/5'>
          <h2 className='mt-8 mb-4 text-lg font-semibold'>Recent Activity</h2>
          <div className='flex '>
            <span className='text-[var(--description-clr)]'>Restock</span>
            <span className='text-[var(--description-clr)]'>Sale</span>
            <span className='text-[var(--description-clr)]'>Wasted</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default page