import { CircleAlert, CircleCheck, Clock, Tag } from 'lucide-react'
import React from 'react'

type Props = {
    icon: 'CircleAlert' | 'Clock' | 'CircleCheck' | 'Tag',
    color: 'yellow' | 'red' | 'green' | 'blue',
    title: string,
}

export default function AlertTag({ icon, color, title }: Props) {
    const IconComponent = { CircleAlert, Clock, CircleCheck, Tag }[icon];
    let bgColorClass = '';
    let textColorClass = '';

    switch (color) {
        case 'yellow':
            bgColorClass = 'bg-yellow-100';
            textColorClass = 'text-yellow-800';
            break;
        case 'red':
            bgColorClass = 'bg-red-100';
            textColorClass = 'text-red-800';
            break;
        case 'green':
            bgColorClass = 'bg-green-100';
            textColorClass = 'text-green-800';
            break;
        case 'blue':
            bgColorClass = 'bg-blue-100';
            textColorClass = 'text-blue-800';
            break;
        default:
            bgColorClass = 'bg-gray-100';
            textColorClass = 'text-gray-800';
    }

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColorClass} ${textColorClass} ml-auto`}>
            <IconComponent size={14} className='mr-1' />
            {title}
        </span>
    )
}
