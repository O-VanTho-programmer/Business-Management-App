'use client';

import Button from '@/components/Button/Button';
import Card from '@/components/Card/Card'
import DateRangePicker from '@/components/DateRangePicker/DateRangePicker';
import SearchBar from '@/components/SearchBar/SearchBar';
import Selector from '@/components/Selector/Selector';
import TableInventoryTransaction from '@/components/TableInventoryTransaction/TableInventoryTransaction';
import useFetchList from '@/hooks/useFetchList';
import useInventoryQuery from '@/hooks/useInventoryQuery';
import React, { useEffect, useState, useMemo } from 'react'

function StockTransactions() {
    const today = useMemo(() => new Date(), []);
    const [startDate, setStartDate] = useState<Date | null>(today);
    const [endDate, setEndDate] = useState<Date | null>(null);

    const {
        query, displayDateRange,
        changeSearchVal,
        changeStartDate, changeEndDate,
        changeTransType, changeUserType,
        resetQuery
    } = useInventoryQuery();

    const handleDateChange = (startDate: Date | null, endDate: Date | null) => {
        setStartDate(startDate);
        setEndDate(endDate);
    };

    const [filterQuery, setFilterQuery] = useState(query);

    // Always default to today's transactions on mount
    useEffect(() => {
        setStartDate(today);
        setEndDate(null);
        changeStartDate(today);
    }, []);

    const { data: transactions, loading, error } = useFetchList('inventory_transactions', filterQuery);
    const { data: summary } = useFetchList('inventory_movement_summary', "startDate=" + (startDate ? startDate.toISOString().split('T')[0] : today.toISOString().split('T')[0]) + "&endDate=" + (endDate ? endDate.toISOString().split('T')[0] : ''));

    const [selectedType, setSelectedType] = useState("");
    const types = { "All Type": "", "Restock": "RESTOCK", "Sale": "SALE", "Order": "ORDER" };

    const [selectedUserType, setSelectedUserType] = useState("");
    const userTypes = { 'All User': "", 'Owner': "OWNER", 'Employee': "EMPLOYEE" };

    const handleApplyFilter = () => {
        if (startDate) changeStartDate(startDate, endDate);
        if (endDate) changeEndDate(endDate, startDate);
        if (selectedType) changeTransType(selectedType);
        if (selectedUserType) changeUserType(selectedUserType);
    };

    const handleReset = () => {
        setSelectedType("");
        setSelectedUserType("");
        resetQuery();
        setStartDate(today);
        setEndDate(null);
        changeStartDate(today);
        changeEndDate(null);
    };

    const handleSearch = (val: string) => {
        changeSearchVal(val);
    }

    useEffect(() => {
        setFilterQuery(query);
    }, [query]);

    return (
        <div className='w-full'>
            <h1>Inventory Movement</h1>

            <div className='p-5 bg-white rounded-xl shadow-lg'>
                <div className='text-gray-600 font-medium mb-3'>
                    <span>Time Range: </span>
                    <span className="font-semibold">{displayDateRange}</span>
                </div>

                <div className='flex gap-4'>
                    <Card title='Total Additions'
                        description='The total number of added quantity'
                        content={summary[0]?.totalAdditions || "0"}
                        icon='PackagePlus'
                        iconColor='text-blue-400' />
                    <Card title='Total Sale'
                        description='The total quantity of product units sold.'
                        content={summary[0]?.totalSells || "0"}
                        icon='ShoppingBag'
                        iconColor='text-red-400' />
                    <Card title='Net Change'
                        description='The overall change in stock quantity.'
                        content={summary[0]?.netChange > 0 ? `+${summary[0]?.netChange}` : summary[0]?.netChange || "0"}
                        icon='ChartNoAxesCombined'
                        iconColor='text-gray-400' />
                </div>
            </div>

            <div className="mt-5 bg-white p-4 rounded-xl shadow-lg">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex flex-col sm:flex-row gap-4 flex-1">
                        <DateRangePicker startDate={startDate} endDate={endDate} onChange={handleDateChange} />
                        <Selector options={types} selectedType={selectedType} setSelectedType={setSelectedType} />
                        <Selector options={userTypes} selectedType={selectedUserType} setSelectedType={setSelectedUserType} />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 flex-1 items-center">
                        <div className='w-full'>
                            <SearchBar onSearch={handleSearch} />
                        </div>
                        <Button isDisable={false} title='Reset' icon='RotateCcw' onClick={handleReset} />
                        <Button isDisable={false} title='Apply Filter' bg_color='blue' onClick={handleApplyFilter} />
                    </div>
                </div>
            </div>

            <div className='bg-white p-5 rounded-lg mt-5 shadow-lg '>
                <TableInventoryTransaction transactions={transactions || []} />

            </div>
        </div>
    )
}

export default StockTransactions