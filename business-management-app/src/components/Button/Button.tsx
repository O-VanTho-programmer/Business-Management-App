import { RotateCcw, Save } from 'lucide-react';
import React from 'react'

type Props = {
    isDisable: boolean,
    icon: 'Save' | 'RotateCcw'
    title: string,
    text_color?: string,
    bg_color?: "red" | "gray" | "blue",
}

export default function Button({ isDisable, icon, title, text_color = 'text-gray-700', bg_color = "gray" }: Props) {
    const IconComponent = { Save, RotateCcw }[icon];

    let bgColor = "";
    let bgColorHover = "";

    switch (bg_color) {
        case "gray":
            bgColor = "bg-gray-200";
            bgColorHover = "hover:bg-gray-300";
            break;
        case "red":
            bgColor = "bg-red-300";
            bgColorHover = "hover:bg-red-400";
            break;
        case "blue":
            bgColor = "bg-blue-500";
            bgColorHover = "hover:bg-blue-600";
            break;
    }


    return (
        <button disabled={isDisable} className={`flex items-center py-2 px-4 shadow-sm gap-2 rounded-lg transition-all ${text_color} ${bgColor} ${isDisable ? ("cursor-not-allowed opacity-60") : (`cursor-pointer ${bgColorHover}`)}`}>
            <IconComponent size={18}/>
            <span>{title}</span>
        </button>
    )
}