import { ChevronDown } from 'lucide-react'
import React from 'react'

type Props = {
    selectedType: string,
    setSelectedType: (type: string) => void,
    options: { [option: string]: string },
}

export default function Selector({ options, selectedType, setSelectedType }: Props) {
    return (
        <div className="relative min-w-fit flex items-center border border-gray-300 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all duration-200">
            <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="block w-full px-3 py-2 pr-8 text-sm text-gray-800 bg-white rounded-lg appearance-none outline-none cursor-pointer"
            >
                {Object.entries(options).map(([option, value]) => (
                    <option key={value} value={value}>
                        {option}
                    </option>
                ))}
            </select>
            <ChevronDown size={18} className="absolute right-3 text-gray-500 pointer-events-none" />
        </div>
    )
}