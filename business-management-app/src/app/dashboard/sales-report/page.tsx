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
import { BarChart2, Table, TrendingUp, TrendingDown, DollarSign, Award, Calendar, Filter } from 'lucide-react'
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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-24">
            {/* Header Section */}
            <div className="bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                                Sales Report Dashboard
                            </h1>
                            <p className="text-gray-600 text-lg">
                                Monitor your business performance and revenue insights
                            </p>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg border border-blue-200">
                                <Calendar size={20} />
                                <span className="font-medium">{displayDateRange}</span>
                            </div>
                            
                            <DateRangeFilter
                                activeRange={activeRange}
                                onDateRangeSelect={handleChangeDateRange}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* KPI Cards Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 group">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                                <TrendingUp className="h-6 w-6 text-green-600" />
                            </div>
                            <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                {revenue && totalProfit && revenue !== 'N/A' && totalProfit !== 'N/A' ? ((parseFloat(totalProfit) / parseFloat(revenue)) * 100).toFixed(1) : '0.0'}%
                            </span>
                        </div>
                        <h3 className="text-sm font-medium text-gray-600 mb-1">Total Profit</h3>
                        <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalProfit)}</p>
                        <p className="text-xs text-gray-500 mt-2">Net earnings after costs</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 group">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
                                <TrendingDown className="h-6 w-6 text-red-600" />
                            </div>
                            <span className="text-sm font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">
                                Cost
                            </span>
                        </div>
                        <h3 className="text-sm font-medium text-gray-600 mb-1">Total Cost</h3>
                        <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalCost)}</p>
                        <p className="text-xs text-gray-500 mt-2">Product and operational costs</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 group">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                                <DollarSign className="h-6 w-6 text-blue-600" />
                            </div>
                            <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                                Revenue
                            </span>
                        </div>
                        <h3 className="text-sm font-medium text-gray-600 mb-1">Total Revenue</h3>
                        <p className="text-2xl font-bold text-gray-900">{formatCurrency(revenue)}</p>
                        <p className="text-xs text-gray-500 mt-2">Gross sales before costs</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 group">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-yellow-100 rounded-lg group-hover:bg-yellow-200 transition-colors">
                                <Award className="h-6 w-6 text-yellow-600" />
                            </div>
                            <span className="text-sm font-medium text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">
                                Top Seller
                            </span>
                        </div>
                        <h3 className="text-sm font-medium text-gray-600 mb-1">Best Product</h3>
                        <p className="text-lg font-bold text-gray-900 truncate">{topProductName}</p>
                        <p className="text-xs text-gray-500 mt-2">{topProductTotalQuantitySold} units sold</p>
                    </div>
                </div>

                {/* Advanced Filters Section */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Filter className="h-5 w-5 text-gray-600" />
                            <h3 className="text-lg font-semibold text-gray-900">Advanced Filters</h3>
                        </div>
                        <div className="flex items-center gap-3">
                            <MonthYearFilter
                                onFilterChange={handleFilterChange}
                                isOn={isCustomedDate} 
                                onToggle={() => {
                                    setIsCustomedDate(!isCustomedDate);
                                    if (!isCustomedDate) {
                                        handleChangeDateRange('custom')
                                    } else {
                                        handleChangeDateRange('this_month')
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Data Visualization Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* View Toggle Header */}
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">Data Analysis</h3>
                            <div className="flex bg-white rounded-lg p-1 shadow-sm border border-gray-200">
                                <button
                                    onClick={() => setView('table')}
                                    className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer
                                    ${view === 'table' 
                                        ? 'bg-blue-600 text-white shadow-sm' 
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                    }`}
                                >
                                    <Table size={18} className="mr-2" /> 
                                    Table View
                                </button>
                                <button
                                    onClick={() => setView('chart')}
                                    className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer
                                    ${view === 'chart' 
                                        ? 'bg-blue-600 text-white shadow-sm' 
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                    }`}
                                >
                                    <BarChart2 size={18} className="mr-2" /> 
                                    Chart View
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="p-6">
                        {view === "table" ? (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-lg font-medium text-gray-900">Transaction Details</h4>
                                    <span className="text-sm text-gray-500">
                                        {transactions?.length || 0} transactions found
                                    </span>
                                </div>
                                <TableRevenueTransaction transactions={transactions} />
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-lg font-medium text-gray-900">Sales Trend Analysis</h4>
                                    <span className="text-sm text-gray-500">Visual representation of sales data</span>
                                </div>
                                <SalesLineChart chartData={saleDataChart} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SaleReport