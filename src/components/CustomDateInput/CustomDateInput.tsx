import React from "react";
import { Calendar } from "lucide-react";

type Props = {
    value?: string;
    onClick?: () => void;
};

const CustomDateInput = React.forwardRef<HTMLButtonElement, Props>(({ value, onClick }, ref) => (
    <button
        type="button"
        onClick={onClick}
        ref={ref}
        className="flex items-center justify-between w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-left text-[#171717]"
    >
        <Calendar className="text-[#171717] w-5 h-5 mr-2" />
        <span>{value || "Select date range"}</span>
    </button>
));

export default CustomDateInput;