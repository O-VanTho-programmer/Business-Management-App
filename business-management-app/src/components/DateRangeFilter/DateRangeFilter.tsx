import React, { useState } from 'react';
import { Calendar } from 'lucide-react';

interface DateFilterProps {
    onDateRangeSelect?: (range: 'today' | 'this_week' | 'this_month' | 'this_year') => void;
    initialActiveRange?: 'today' | 'this_week' | 'this_month' | 'this_year';
}

export default function DateRangeFilter({ onDateRangeSelect, initialActiveRange = 'this_month' }: DateFilterProps) {
    const [activeRange, setActiveRange] = useState(initialActiveRange);

    const handleRangeClick = (range: typeof activeRange) => {
        setActiveRange(range);
        if (onDateRangeSelect) {
            onDateRangeSelect(range);
        }
    };

    const getButtonClasses = (range: typeof activeRange) => {
        return `
      flex items-center px-4 py-2 rounded-lg text-sm font-medium
      transition-colors duration-200 ease-in-out cursor-pointer
      ${activeRange === range
                ? 'bg-white text-gray-900 shadow-md'
                : 'bg-transparent text-gray-600 hover:bg-gray-100'
            }
    `;
    };

    return (
        <div className="flex flex-wrap gap-2">
            <button
                onClick={() => handleRangeClick('today')}
                className={getButtonClasses('today')}
            >
                <Calendar size={16} className="mr-2" /> Today
            </button>
            <button
                onClick={() => handleRangeClick('this_week')}
                className={getButtonClasses('this_week')}
            >
                <Calendar size={16} className="mr-2" /> This Week
            </button>
            <button
                onClick={() => handleRangeClick('this_month')}
                className={getButtonClasses('this_month')}
            >
                <Calendar size={16} className="mr-2" /> This Month
            </button>
            <button
                onClick={() => handleRangeClick('this_year')}
                className={getButtonClasses('this_year')}
            >
                <Calendar size={16} className="mr-2" /> This Year
            </button>
        </div>
    );
};