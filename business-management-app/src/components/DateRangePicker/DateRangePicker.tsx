import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import CustomDateInput from "../CustomDateInput/CustomDateInput";

type Props = {
    onChange: (start: Date | null, end: Date | null) => void;
    startDate?: Date | null;
    endDate?: Date | null;
};

export default function DateRangePicker({startDate, endDate, onChange }: Props) {

    const handleChange = (dates: [Date | null, Date | null]) => {
        const start = dates[0];
        const end = dates[1] ? new Date(dates[1].getFullYear(), dates[1].getMonth(), dates[1].getDate() + 1) : null
        
        onChange(start, end);
    };

    return (
        <div className=" rounded">
            <DatePicker
                selectsRange
                customInput={<CustomDateInput/>}
                startDate={startDate}
                endDate={endDate}
                onChange={handleChange}
                dateFormat="MMMM d, yyyy"
                isClearable
                placeholderText="Select a date range"
                className="whitespace-nowrap w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            />
        </div>
    );
}
