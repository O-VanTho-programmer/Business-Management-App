import NavItem from "@/types/NavItems";
import NavFooter from "@/components/NavFooter/NavFooter";

export default function InventoryLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const navFooterItems: NavItem[] = [
        { name: 'Stock', href: '/dashboard/inventory', icon: 'Boxes' },
        { name: 'Stock Movement', href: '/dashboard/inventory/inventory_movement', icon: 'TrendingUpDown' },
        { name: 'Order Product', href: '/dashboard/inventory/order', icon: 'PackagePlus' },
        { name: 'Product Sale', href: '/dashboard/inventory/sell', icon: 'BadgeDollarSign' },
        { name: 'Set ROP', href: '/dashboard/inventory/rop', icon: 'ArchiveRestore' },
    ]
    return (
        <div className="pb-20">
            {children}
            <NavFooter navItems={navFooterItems} />
        </div>
    );
}
