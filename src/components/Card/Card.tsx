import React from 'react';
import { BanknoteArrowDown, AlertTriangle, Award, BanknoteArrowUp, ChartNoAxesCombined, ChevronsDown, CircleSlash2, Layers, PackagePlus, ShoppingBag, TrendingDown, TrendingUp, XCircle, CirclePlus, HandCoins } from 'lucide-react';

interface CardProps {
    title: string,
    content?: string,
    description?: string,
    icon?: 'HandCoins' | 'CirclePlus' | 'BanknoteArrowDown' | 'BanknoteArrowUp' | 'PackagePlus' | 'ChartNoAxesCombined' | 'TrendingUp' | 'TrendingDown' | 'Layers' | 'ChevronsDown' | 'CircleSlash2' | 'ShoppingBag' | 'AlertTriangle' | 'Award' | 'XCircle';
    iconColor?: string,
    text_color?: string,
}

const Card: React.FC<CardProps> = ({
    title,
    content,
    description,
    icon,
    iconColor = 'text-yellow-500',
    text_color = 'text-gray-900',
}) => {
    const IconComponent = icon ? {
        HandCoins, CirclePlus, BanknoteArrowDown, BanknoteArrowUp, PackagePlus, ChartNoAxesCombined, TrendingDown, TrendingUp, Layers, ChevronsDown, CircleSlash2, ShoppingBag, AlertTriangle, Award, XCircle
    }[icon] : null

    return (
        <div className="bg-white p-5 rounded-xl shadow-md flex flex-col items-start min-w-[100px] flex-1">
            <div className="flex items-center space-x-2 mb-3 justify-between w-full text-gray-800">
                <span className='text-base font-semibold'>{title}</span>
                {IconComponent && <IconComponent size={24} className={iconColor} />}
            </div>

            {content &&
                <div className={`text-2xl font-bold ${text_color} mb-2`}>
                    {content}
                </div>
            }

            {description &&
                <p className="text-gray-500 text-sm">
                    {description}
                </p>
            }
        </div>
    )
}

export default Card;