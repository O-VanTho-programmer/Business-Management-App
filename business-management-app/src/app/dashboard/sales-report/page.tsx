'use client'
import Card from '@/components/Card/Card'
import DateRangeFilter from '@/components/DateRangeFilter/DateRangeFilter'
import MonthYearFilter from '@/components/MonthYearFilter/MonthYearFilter'
import SalesLineChart from '@/components/SalesLineChart/SalesLineChart'
import TableRevenueTransaction from '@/components/TableRevenueTransaction/TableRevenueTransaction'
import useFetchList from '@/hooks/useFetchList'
import useInventoryQuery from '@/hooks/useInventoryQuery'
import useRevenueTransactionSummary from '@/hooks/useRevenueTransactionSummary'
import formatCurrency from '@/utils/formatCurrency'
import { BarChart2, Table } from 'lucide-react'
import React, { useEffect, useState } from 'react'

function SaleReport() {
    const [view, setView] = useState<"table" | "chart">("table");
    const [isCustomedDate, setIsCustomedDate] = useState<boolean>(false);


    const { query, changeStartDate, changeEndDate, displayDateRange } = useInventoryQuery();
    const { data: transactions } = useFetchList('revenue_transactions', query);
    const {data: saleDataChart} = useFetchList('sale_data_chart', query);

    const { totalProfit, totalCost, revenue, topProductName, topProductTotalQuantitySold } = useRevenueTransactionSummary(query);

    const [activeRange, setActiveRange] = useState<'today' | 'this_week' | 'this_month' | 'this_year' | 'custom'>('this_month');

    const handleChangeDateRange = (range: 'today' | 'this_week' | 'this_month' | 'this_year' | 'custom') => {
        const today = new Date();
        let start: Date;
        let end: Date;

        setActiveRange(range);
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

        setIsCustomedDate(false);

        changeStartDate(start, end);
        changeEndDate(end, start);
    }

    useEffect(() => {
        handleChangeDateRange(activeRange);
    }, []);

    const handleFilterChange = (month: number | null, year: number | null) => {

        if (!month || !year) {
            return;
        }

        let start = new Date(year, month - 1, 1, 0, 0, 0, 0);
        let end = new Date(year, month, 0, 23, 59, 59, 999);

        changeStartDate(start, end);
        changeEndDate(end, start);
    };

    return (
        <div className='pb-24'>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-4">
                <h1>Revenue Transactions Overview</h1>
                <DateRangeFilter
                    activeRange={activeRange}
                    onDateRangeSelect={handleChangeDateRange}
                />
            </div>

            <div className='text-gray-600 font-medium mb-3'>
                <span>Time Range: </span>
                <span className="font-semibold">{displayDateRange}</span>
            </div>

            <div className='flex gap-4 mb-5'>
                <Card title='Total Profit'
                    content={`${formatCurrency(totalProfit)}`}
                    icon='HandCoins'
                    iconColor='text-blue-500'
                    text_color='text-blue-600' />
                <Card title='Order Cost'
                    content={`${formatCurrency(totalCost)}`}
                    icon='BanknoteArrowDown'
                    iconColor='text-red-500'
                    text_color='text-red-600' />
                <Card title='Revenue'
                    content={`${formatCurrency(revenue)}`}
                    icon='BanknoteArrowUp'
                    iconColor='text-green-500'
                    text_color='text-green-600' />
                <Card title='Top Product'
                    content={topProductName}
                    description={`${topProductTotalQuantitySold} sold`}
                    icon='Award'
                    iconColor='text-yellow-500' />
            </div>

            <MonthYearFilter
                onFilterChange={handleFilterChange}
                isOn={isCustomedDate} onToggle={() => {
                    setIsCustomedDate(!isCustomedDate);
                    if (!isCustomedDate) {
                        handleChangeDateRange('custom')
                    } else {
                        handleChangeDateRange('this_month')
                    }
                }}
            />

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
                    <SalesLineChart chartData={saleDataChart} />
                )}
            </div>
        </div>
    )
}

export default SaleReport