import Card from '@/components/Card/Card'
import TableInventoryTransaction from '@/components/TableInventoryTransaction/TableInventoryTransaction';
import TableRevenueTransaction from '@/components/TableRevenueTransaction/TableRevenueTransaction'
import React from 'react'

function StockTransactions() {
    const inventoryTransaction: InventoryTransaction[] = [
        {
            id: 'inv_001',
            date: '2025-06-10T14:30:00Z', // ISO 8601 format
            product_code: 'P001',
            product_name: 'Organic Apples',
            type: 'RESTOCK',
            quantity: 50,
            unit: 'kg',
            previous_quantity: 100,
            new_quantity: 150,
            user_code: 'warehouse_mgr_01',
        },
        {
            id: 'inv_002',
            date: '2025-06-10T15:00:00Z',
            product_code: 'P002',
            product_name: 'Premium Coffee Beans',
            type: 'SALE',
            quantity: 5,
            unit: 'kg',
            previous_quantity: 75,
            new_quantity: 70,
            user_code: 'sales_rep_03',
        },
        {
            id: 'inv_003',
            date: '2025-06-10T16:15:00Z',
            product_code: 'P001',
            product_name: 'Organic Apples',
            type: 'SALE',
            quantity: 10,
            unit: 'kg',
            previous_quantity: 150,
            new_quantity: 140,
            user_code: 'sales_rep_03',
        },
        {
            id: 'inv_004',
            date: '2025-06-09T09:00:00Z',
            product_code: 'P003',
            product_name: 'Whole Wheat Bread',
            type: 'RESTOCK',
            quantity: 20,
            unit: 'kg',
            previous_quantity: 30,
            new_quantity: 50,
            user_code: 'supplier_delivery',
        },
        {
            id: 'inv_005',
            date: '2025-06-09T11:00:00Z',
            product_code: 'P002',
            product_name: 'Premium Coffee Beans',
            type: 'RETURN',
            quantity: 2,
            unit: 'kg',
            previous_quantity: 70,
            new_quantity: 72,
            user_code: 'customer_service',
        },
        {
            id: 'inv_006',
            date: '2025-06-08T10:00:00Z',
            product_code: 'P004',
            product_name: 'Artisan Cheese',
            type: 'SALE',
            quantity: 1,
            unit: 'kg',
            previous_quantity: 15,
            new_quantity: 14,
            user_code: 'sales_rep_01',
        },
        {
            id: 'inv_007',
            date: '2025-06-08T10:05:00Z',
            product_code: 'P004',
            product_name: 'Artisan Cheese',
            type: 'RESTOCK',
            quantity: 10,
            unit: 'kg',
            previous_quantity: 14,
            new_quantity: 24,
            user_code: 'warehouse_mgr_01',
        },
    ];


    return (
        <div className='w-full'>
            <h1>Inventory Movement</h1>

            <div className='flex gap-4 p-5 bg-white rounded-xl shadow-lg'>
                <Card title='Total Additions'
                    description='The total number of added quantity'
                    content="20"
                    icon='PackagePlus'
                    iconColor='text-blue-400' />
                <Card title='Total Sale'
                    description='The total quantity of product units sold.'
                    content="20"
                    icon='ShoppingBag'
                    iconColor='text-red-400' />
                <Card title='Net Change'
                    description='The overall change in stock quantity.'
                    content="+20"
                    icon='ChartNoAxesCombined'
                    iconColor='text-gray-400' />
            </div>

            <div className='bg-white p-5 rounded-lg mt-5 shadow-lg '>
                <TableInventoryTransaction transactions={inventoryTransaction} />

            </div>
        </div>
    )
}

export default StockTransactions