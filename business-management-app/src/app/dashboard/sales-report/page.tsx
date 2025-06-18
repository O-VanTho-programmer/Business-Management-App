import Card from '@/components/Card/Card'
import TableInventoryTransaction from '@/components/TableInventoryTransaction/TableInventoryTransaction'
import TableRevenueTransaction from '@/components/TableRevenueTransaction/TableRevenueTransaction'
import React from 'react'

function SaleReport() {


    const revenueTransaction: RevenueTransaction[] = [
        {
            id: '1',
            date: 'May 18, 2025 1:17 PM',
            product_code: 'AmsDA',
            product_name: 'Product',
            price_unit: 12,
            quantity: 20,
            total_price: 240,
            type: 'IN',
            user_code: 'usercodene',
        },
        {
            id: '2',
            date: 'May 18, 2025 1:17 PM',
            product_code: 'AmsDA',
            product_name: 'Product',
            price_unit: 12,
            quantity: 20,
            total_price: 240,
            type: 'IN',
            user_code: 'usercodene',
        }
    ]
    return (
        <div>
            <h1>Sale Report</h1>

            <div className='flex gap-4 p-5 bg-white rounded-xl shadow-lg'>
                <Card title='Total Revenue'
                    content="$200,000,000"
                    icon='BanknoteArrowUp'
                    iconColor='text-green-500' />
                <Card title='Order Cost'
                    content="120"
                    icon='BanknoteArrowDown'
                    iconColor='text-red-500' />
                <Card title='Sales Number'
                    content="120"
                    icon='ShoppingBag'
                    iconColor='text-blue-500' />
                <Card title='Top Product'
                    content="Chicken Breast"
                    icon='Award'
                    iconColor='text-yellow-500' />
            </div>

            <div className='bg-white p-5 rounded-lg mt-5 shadow-lg '>
                <TableRevenueTransaction transactions={revenueTransaction} />
            </div>
        </div>
    )
}

export default SaleReport