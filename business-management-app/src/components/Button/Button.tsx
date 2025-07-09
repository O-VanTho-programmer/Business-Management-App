import { PackagePlus, PlusCircle, RotateCcw, Save, ShoppingBasket, Tag } from 'lucide-react';
import React from 'react'

type Props = {
    isDisable: boolean,
    onClick?: () => void,
    icon?: 'Save' | 'RotateCcw' | 'PlusCircle' | 'Tag' | 'PackagePlus' | 'ShoppingBasket',
    title: string,
    bg_color?: "red" | "gray" | "blue",
}

export default function Button({onClick, isDisable, icon, title, bg_color}: Props) {
    const IconComponent = icon ? { Save, RotateCcw, PlusCircle, Tag, PackagePlus, ShoppingBasket }[icon] : null;

    let text_color = 'text-gray-700';
    let bgColor = 'bg-gray-200';
    let bgColorHover = "hover:bg-gray-300" ;
    let ringColor = "focus:ring-gray-600";

    switch (bg_color) {
        case "gray":
            bgColor = "bg-gray-200";
            bgColorHover = "hover:bg-gray-300";
            ringColor = "focus:ring-gray-600";
            text_color = "text-gray-700";
            break;
        case "red":
            bgColor = "bg-red-300";
            bgColorHover = "hover:bg-red-400";
            ringColor = "focus:ring-red-600";
            text_color = "text-white";
            break;
        case "blue":
            bgColor = "bg-blue-600";
            bgColorHover = "hover:bg-blue-700";
            ringColor = "focus:ring-blue-600";
            text_color = "text-white";
            break;
    }


    return (
        <button type='button' onClick={onClick} disabled={isDisable} className={`flex whitespace-nowrap items-center py-2 px-4 shadow-sm gap-2 cursor-pointer rounded-lg transition-all focus:ring-2 ${ringColor} focus:ring-offset-2 ${text_color} ${bgColor} ${isDisable ? ("cursor-not-allowed opacity-60") : (`${bgColorHover}`)}`}>
            {IconComponent && <IconComponent size={18}/>}
            <span>{title}</span>
        </button>
    )
}