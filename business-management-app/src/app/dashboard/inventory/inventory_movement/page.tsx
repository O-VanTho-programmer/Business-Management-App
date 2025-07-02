'use client';

import Button from '@/components/Button/Button';
import Card from '@/components/Card/Card'
import SearchBar from '@/components/SearchBar/SearchBar';
import Selector from '@/components/Selector/Selector';
import TableInventoryTransaction from '@/components/TableInventoryTransaction/TableInventoryTransaction';
import TableRevenueTransaction from '@/components/TableRevenueTransaction/TableRevenueTransaction'
import useFetchList from '@/hooks/useFetchList';
import React, { useState } from 'react'

function StockTransactions() {

    const { data: transactions, loading, error } = useFetchList('inventory_transactions');
    const handleChangeSearchVal = () => {

    }

    const [selectedType, setSelectedType] = useState("");
    const types = { "All Type": "", "Restock": "RESTOCK", "Sale": "SALE", "Order": "ORDER" };

    const [selectedUserType, setSelectedUserType] = useState("");
    const userTypes = {"All User": "", 'Owner': "OWNER", 'Employee': "EMPLOYEE"};

    return (
        <div className='w-full'>
            <h1>Inventory Movement</h1>

            <div className='p-5 bg-white rounded-xl shadow-lg'>
                <div className=''>
                    <span>Time Range:</span>
                </div>

                <div className='flex gap-4'>
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
            </div>

            <div className="mt-3 bg-white p-4 rounded-xl shadow-lg flex items-center gap-4">
                <Selector options={types} selectedType={selectedType} setSelectedType={setSelectedType} />
                <Selector options={userTypes} selectedType={selectedUserType} setSelectedType={setSelectedUserType} />
                <SearchBar onSearch={handleChangeSearchVal} />
                <Button isDisable={false} title='Reset' icon='RotateCcw' />
                <Button isDisable={false} title='Apply Filter' bg_color='blue' text_color='text-white' />
            </div>

            <div className='bg-white p-5 rounded-lg mt-5 shadow-lg '>
                <TableInventoryTransaction transactions={transactions || []} />

            </div>
        </div>
    )
}

export default StockTransactions