import { Search } from 'lucide-react';
import React, { useState } from 'react'

type Props = {
    onSearch: (query: string) => void,
    placeholder?: string,
    bg_color?: string
}

export default function SearchBar({ onSearch, placeholder = "Search...", bg_color = "bg-gray-100"}: Props) {
    const [value, setValue] = useState("");

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            onSearch(value);
        }
    }

    return (
        <div className={`flex items-center py-3 px-2 ${bg_color} rounded-lg`}>
            <Search />
            <input
                className='outline-none border-none ml-2 w-full'
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleSearch}
            />
        </div>
    )
}