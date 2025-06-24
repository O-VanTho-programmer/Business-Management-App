import React from 'react'
import styles from './Nav.module.css';
import { FaAngleDown } from 'react-icons/fa';
import { IoMdNotificationsOutline } from 'react-icons/io';

function Nav() {
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
                            <li><a href='/dashboard/inventory/transactions'>Transactions</a></li>
                            <li><a href='/dashboard/inventory/order'>Order</a></li>
                            <li><a href='/dashboard/inventory/sell'>Sell</a></li>
                            <li><a href='/dashboard/inventory/rop'>ROP</a></li>
                        </ul>
                    </li>
                    <li><a href=''>Discounts</a></li>
                    <li><a href='/dashboard/sales-report'>Sales Report</a></li>
                    <li><a href='/dashboard/products'>Products</a></li>
                </ul>
            </div>

            <div className='flex gap-3'>
                <button className='w-[35px] h-[35px] rounded-lg border hover:bg-blue-400 hover:text-white cursor-pointer'><IoMdNotificationsOutline size={22} className='ml-auto mr-auto' /></button>
                <div className='rounded-full w-[35px] h-[35px] cursor-pointer border border-white hover:border-gray-500'>
                    <img className='w-full h-auto' src='/avatar.png' />
                </div>
            </div>
        </nav>
    )
}

export default Nav