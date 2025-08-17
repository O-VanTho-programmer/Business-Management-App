import React, { useState, useMemo } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';

interface MonthYearFilterProps {
    onFilterChange: (month: number | null, year: number | null) => void;
    initialMonth?: number;
    initialYear?: number;
    yearRangeStart?: number;
    yearRangeEnd?: number;
    isOn: boolean;
    onToggle: () => void;
}

export default function MonthYearFilter({
    onFilterChange,
    initialMonth,
    initialYear,
    yearRangeStart,
    yearRangeEnd,
    isOn, onToggle
}: MonthYearFilterProps) {
    const currentYear = new Date().getFullYear();

    const [selectedMonth, setSelectedMonth] = useState<number | null>(0);
    const [selectedYear, setSelectedYear] = useState<number | null>(0);

    const months = useMemo(() => [
        { value: 1, name: 'January' },
        { value: 2, name: 'February' },
        { value: 3, name: 'March' },
        { value: 4, name: 'April' },
        { value: 5, name: 'May' },
        { value: 6, name: 'June' },
        { value: 7, name: 'July' },
        { value: 8, name: 'August' },
        { value: 9, name: 'September' },
        { value: 10, name: 'October' },
        { value: 11, name: 'November' },
        { value: 12, name: 'December' },
    ], []);

    const years = useMemo(() => {
        const start = yearRangeStart || currentYear - 5;
        const end = yearRangeEnd || currentYear + 5;
        const yearList = [];
        for (let i = start; i <= end; i++) {
            yearList.push(i);
        }
        return yearList;
    }, [currentYear, yearRangeStart, yearRangeEnd]);

    const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const month = e.target.value === '' ? null : parseInt(e.target.value);
        setSelectedMonth(month);
        onFilterChange(month, selectedYear);
    };

    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const year = e.target.value === '' ? null : parseInt(e.target.value);
        setSelectedYear(year);
        onFilterChange(selectedMonth, year);
    };

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white rounded-xl shadow-sm">
            <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center text-gray-700 font-semibold">
                    <Calendar size={20} className="mr-2" /> Filter by:
                </div>

                {/* Month */}
                <div className="relative flex items-center border border-gray-300 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all duration-200 w-full sm:w-auto">
                    <select
                        disabled={!isOn}
                        value={selectedMonth !== null ? selectedMonth : ''}
                        onChange={handleMonthChange}
                        className={`block w-full px-3 py-2 pr-8 text-sm ${isOn ? "text-gray-800 bg-white" : "bg-gray-100 text-gray-400"} rounded-lg appearance-none outline-none cursor-pointer transparent transition-all duration-200`}
                    >
                        <option hidden value="0">----</option>

                        {months.map((month) => (
                            <option key={month.value} value={month.value}>
                                {month.name}
                            </option>
                        ))}
                    </select>
                    <ChevronDown size={18} className="absolute right-3 text-gray-500 pointer-events-none" />
                </div>

                {/* Year */}
                <div className="relative flex items-center border border-gray-300 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all duration-200 w-full sm:w-auto">
                    <select
                        disabled={!isOn}
                        value={selectedYear !== null ? selectedYear : ''}
                        onChange={handleYearChange}
                        className={`block w-full px-3 py-2 pr-8 text-sm ${isOn ? "text-gray-800 bg-white" : "bg-gray-100 text-gray-400"} rounded-lg appearance-none outline-none cursor-pointer transparent transition-all duration-200`}
                    >
                        <option hidden value="0">----</option>
                        {years.map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                    <ChevronDown size={18} className="absolute right-3 text-gray-500 pointer-events-none" />
                </div>
            </div>

            {/* Custome Date Toggle */}
            <button
                type='button'
                onClick={onToggle}
                className={`cursor-pointer border  ${isOn ? "bg-blue-500 text-white hover:bg-blue-400" : "border-gray-300 text-gray-500 bg-gray-200 hover:bg-gray-100 "} px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out`}>
                Custom Date
            </button>
        </div>
    );
};