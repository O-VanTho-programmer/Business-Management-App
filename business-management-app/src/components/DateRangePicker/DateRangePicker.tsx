import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type Props = {
    onChange: (start: Date | null, end: Date | null) => void;
};

export default function DateRangePicker({ onChange }: Props) {
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
    const [startDate, endDate] = dateRange;

    const handleChange = (update: [Date | null, Date | null]) => {
        setDateRange(update);
        onChange(update[0], update[1]);
    };

    return (
        <div className="p-2 border border-gray-300 rounded">
            <DatePicker
                selectsRange
                startDate={startDate}
                endDate={endDate}
                onChange={handleChange}
                isClearable
                placeholderText="Select a date range"
                className="w-full p-2 border rounded"
            />
        </div>
    );
}
