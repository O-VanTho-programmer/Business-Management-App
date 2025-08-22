'use client'

import React, { useEffect, useRef, useState } from 'react'
import styles from './Nav.module.css';
import { FaAngleDown } from 'react-icons/fa';
import { IoMdNotificationsOutline } from 'react-icons/io';
import api from '@/lib/axios';

function Nav() {
    const [openDropdown, setOpenDropdown] = useState<boolean>(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutSideMenu = (e: MouseEvent) => {
            if(menuRef.current && !menuRef.current.contains(e.target as Node)){
                setOpenDropdown(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutSideMenu);

        return () => document.removeEventListener("mousedown", handleClickOutSideMenu);
    }, [])

    const handleLogout = async () => {
        try {
            const res = await api.post('action/logout');

            if(res.status === 200){
                window.location.href = '/';
            }
        } catch (error) {
            console.log("Error when logout", error);
        }
    }

    return (
        <nav className='container flex items-center justify-between bg-white! shadow-sm'>
            <div className='flex items-center'>
                <a href='/dashboard' className='max-w-[130px]'>
                    <img src={'/LOGO_NAME.png'} />
                </a>
                <ul className={styles.links}>
                    <li className={styles.dropdown_menu}>
                        <a href='/dashboard/inventory'><span>Inventory Management</span> <FaAngleDown /></a>
                        <ul className={`${styles.child_links} ${styles.links}`}>
                            <li><a href='/dashboard/inventory'>Stock</a></li>
                            <li><a href='/dashboard/inventory/inventory_movement'>Transactions</a></li>
                            <li><a href='/dashboard/inventory/order'>Order</a></li>
                            <li><a href='/dashboard/inventory/sell'>Sell</a></li>
                            <li><a href='/dashboard/inventory/rop'>ROP</a></li>
                        </ul>
                    </li>
                    <li><a href='/dashboard/discounts'>Discounts</a></li>
                    <li><a href='/dashboard/sales-report'>Sales Report</a></li>
                    <li><a href='/dashboard/products'>Products</a></li>
                    <li>
                        <a
                            href="/dashboard/invoice_scanner"
                            className="relative overflow-hidden flex whitespace-nowrap items-center py-2 px-4 gap-2
                            transition-all duration-300 ease-in-out transform cursor-pointer
                            font-semibold bg-white text-gray-800
                            hover:bg-gradient-to-r hover:from-purple-500 hover:via-pink-500 hover:to-red-500"
                        >
                            Scan Invoice
                            <span className="absolute top-0 right-0 px-4 py-1 text-xs tracking-wider text-center uppercase
                            origin-bottom-left transform rotate-45 -translate-y-full translate-x-1/3
                            bg-violet-600 text-white">
                                New
                            </span>
                        </a>
                    </li>
                </ul>
            </div>

            <div className='flex gap-3 ml-2'>
                <button className='w-[35px] h-[35px] rounded-lg border hover:bg-blue-400 hover:text-white cursor-pointer'><IoMdNotificationsOutline size={22} className='ml-auto mr-auto' /></button>
                <div ref={menuRef} onClick={() => setOpenDropdown(!openDropdown)} className='relative rounded-full w-[35px] h-[35px] cursor-pointer border border-white hover:border-gray-500'>
                    <img className='w-full h-auto' src='/avatar.png' />

                    {openDropdown && (
                        <ul className="absolute right-0 mt-2 w-40 bg-white text-gray-700 rounded-lg shadow-lg border">
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Settings</li>
                            <li
                                onClick={handleLogout}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            >
                                Logout
                            </li>
                        </ul>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Nav