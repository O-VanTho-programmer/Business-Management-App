import { BarChart3, Package, FileText, LucideIcon } from 'lucide-react'
import React from 'react'

type Props = {
    action: {
        title: string,
        description: string,
        icon: 'Package' | 'BarChart3' | 'FileText',
        iconColor: string,
        bgColor: string,
        borderColor: string,
        directUrl: string
    }
}

export default function QuickAction({ action }: Props) {
    
    const IconComponents: Record<string, LucideIcon> = {
        Package, 
        BarChart3, 
        FileText
    }

        const IconComponent = IconComponents[action.icon]

    return (
        <button
            onClick={() => { window.location.href = action.directUrl }}
            className={`${action.bgColor} ${action.borderColor} border rounded-xl p-6 text-left transition-all duration-200 hover:shadow-md group`}
        >
            <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-semibold text-gray-900">{action.title}</span>
                <div className={`p-2 rounded-lg ${action.bgColor} group-hover:scale-110 transition-transform`}>
                    {IconComponent && <IconComponent className={`w-5 h-5 ${action.iconColor}`} />}
                </div>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">{action.description}</p>
        </button>
    )
}