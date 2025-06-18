'use client';
import Button from '@/components/Button/Button';
import SearchBar from '@/components/SearchBar/SearchBar'
import TableSetROP from '@/components/TableSetROP/TableSetROP';
import sampleProducts from '@/sampleData/productsData';
import React, { useState } from 'react'

function ROP() {
    const [isPendingChanged, setIsPendingChanged] = useState<boolean>(false);
    const [pendingChanges, setPendingChanges] = useState<{ [code: string]: number | null }>({});
    const productsData = sampleProducts;

    const [searchVal, setSearchVal] = useState<string>("");

    const handleChangeROP = (product_code: string, newROP: number | null) => {
        if (newROP !== null) {
            setPendingChanges(prev => ({
                ...prev,
                [product_code]: newROP,
            }))

            setIsPendingChanged(true);
        }
    }

    return (
        <div>
            <h1 className='text-center text-2xl'>Set Reorder Point</h1>
            <SearchBar onSearch={setSearchVal} placeholder='Find product...' bg_color='bg-white' />

            <div className='flex justify-end items-center my-6 gap-4'>
                {isPendingChanged && (
                    <Button isDisable={!isPendingChanged} icon='RotateCcw' title='Reset Changes' bg_color='gray' />

                )}
                <Button isDisable={!isPendingChanged} icon='Save' title='Save Changes' text_color='text-white' bg_color='blue' />
            </div>

            <TableSetROP products={productsData} pendingChanges={pendingChanges} onRopChange={handleChangeROP} />
        </div>
    )
}

export default ROP