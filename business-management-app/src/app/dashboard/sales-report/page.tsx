'use client'
import Card from '@/components/Card/Card'
import ChartView from '@/components/ChartView/ChartView'
import DateRangeFilter from '@/components/DateRangeFilter/DateRangeFilter'
import TableRevenueTransaction from '@/components/TableRevenueTransaction/TableRevenueTransaction'
import useFetchList from '@/hooks/useFetchList'
import useInventoryQuery from '@/hooks/useInventoryQuery'
import useRevenueTransactionSummary from '@/hooks/useRevenueTransactionSummary'
import { BarChart2, Table } from 'lucide-react'
import React, { useEffect, useState } from 'react'

function SaleReport() {
    const [view, setView] = useState<"table" | "chart">("table");

    const { query, changeStartDate, changeEndDate, displayDateRange } = useInventoryQuery();
    const { data: transactions } = useFetchList('revenue_transactions', query);
    const { totalProfit, totalCost, revenue, topProductName, topProductTotalQuantitySold } = useRevenueTransactionSummary(query);

    const INITIAL_DATE_RANGE = 'this_month';

    const handleChangeDateRange = (range: 'today' | 'this_week' | 'this_month' | 'this_year') => {
        const today = new Date();
        let start: Date;
        let end: Date;

        switch (range) {
            case 'today':
                start = new Date(today.setHours(0, 0, 0, 0));
                end = new Date(today.setHours(23, 59, 59, 999));
                break;
            case 'this_week':
                const dayOfWeek = today.getDay();
                const diffToMonday = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
                start = new Date(today.setDate(diffToMonday));
                start.setHours(0, 0, 0, 0);
                end = new Date();
                end.setHours(23, 59, 59, 999);
                break;
            case 'this_month':
                start = new Date(today.getFullYear(), today.getMonth(), 1);
                end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                end.setHours(23, 59, 59, 999);
                break;
            case 'this_year':
                start = new Date(today.getFullYear(), 0, 1);
                end = new Date(today.getFullYear(), 11, 31);
                end.setHours(23, 59, 59, 999);
                break;
            default:
                return;
        }

        changeStartDate(start, end);
        changeEndDate(end, start);
    }

    useEffect(() => {
        handleChangeDateRange(INITIAL_DATE_RANGE);
    }, []);


    return (
        <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-4">
                <h1>Revenue Transactions Overview</h1>
                <DateRangeFilter initialActiveRange={INITIAL_DATE_RANGE} onDateRangeSelect={handleChangeDateRange} />
            </div>

            <div className='text-gray-600 font-medium mb-3'>
                <span>Time Range: </span>
                <span className="font-semibold">{displayDateRange}</span>
            </div>

            <div className='flex gap-4'>
                <Card title='Total Profit'
                    content={`$${totalProfit}`}
                    icon='HandCoins'
                    iconColor='text-green-500' />
                <Card title='Order Cost'
                    content={`$${totalCost}`}
                    icon='BanknoteArrowDown'
                    iconColor='text-red-500' />
                <Card title='Revenue'
                    content={`$${revenue}`}
                    icon='BanknoteArrowUp'
                    iconColor='text-blue-500' />
                <Card title='Top Product'
                    content={topProductName}
                    description={`${topProductTotalQuantitySold} sold`}
                    icon='Award'
                    iconColor='text-yellow-500' />
            </div>

            <div className='bg-white p-5 rounded-lg mt-5 shadow-lg flex flex-col items-center'>
                <div className="flex bg-gray-200 rounded-xl p-1 mb-6 shadow-sm gap-1">
                    <button
                        onClick={() => setView('table')}
                        className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 cursor-pointer
                        ${view === 'table' ? 'bg-white text-gray-900 shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        <Table size={18} className="mr-2" /> Table View
                    </button>
                    <button
                        onClick={() => setView('chart')}
                        className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 cursor-pointer
                        ${view === 'chart' ? 'bg-white text-gray-900 shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        <BarChart2 size={18} className="mr-2" /> Chart View
                    </button>
                </div>
                {view === "table" ? (
                    <TableRevenueTransaction transactions={transactions} />

                ) : (
                    <ChartView />
                )}
            </div>
        </div>
    )
}

export default SaleReport