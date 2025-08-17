import NavItem from '@/types/NavItems';
import { ArchiveRestore, BadgeDollarSign, Boxes, PackagePlus, TrendingUpDown, ChartNoAxesCombined } from 'lucide-react'
import React from 'react'


type Props = {
    navItems: NavItem[],
}

export default function NavFooter({ navItems }: Props) {
    const IconComponents = {
        Boxes, PackagePlus, TrendingUpDown, BadgeDollarSign, ArchiveRestore, ChartNoAxesCombined
    }; 
    return (
        <footer className="bg-white! container pt-2 fixed bottom-0 left-0 w-full shadow-lg border-t border-gray-200">
            <nav>
                <ul className="flex justify-around items-center h-full">
                    {navItems.map((item) => {
                        const IconComponent = IconComponents[item.icon];
                        return (
                            <li key={item.name} className="flex-1 text-center">
                                <a
                                    href={item.href}
                                    className="flex flex-col items-center justify-center text-gray-600 hover:text-blue-600 transition-colors duration-200 p-1"
                                >
                                    {IconComponent && <IconComponent size={24} strokeWidth={1.5} className="mb-1" />}
                                    <span className="text-xs font-medium">{item.name}</span>
                                </a>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </footer>
    )
}