'use client';
import { useAlert } from '@/components/AlertProvider/AlertContext';
import Button from '@/components/Button/Button';
import Loading from '@/components/Loading/Loading';
import SearchBar from '@/components/SearchBar/SearchBar'
import TableSetROP from '@/components/TableSetROP/TableSetROP';
import useFetchList from '@/hooks/useFetchList';
import useProductQuery from '@/hooks/useProductQuery';
import api from '@/lib/axios';
import React, { useState } from 'react'

function ROP() {
    const { showAlert } = useAlert();

    const [isPendingChanged, setIsPendingChanged] = useState<boolean>(false);
    const [pendingChanges, setPendingChanges] = useState<{ [code: string]: number | null }>({});

    const { query, changeSearchVal } = useProductQuery();
    const { data: products, loading, error } = useFetchList('products', query);

    const handleChangeROP = (product_code: string, newROP: number | null) => {
        if (newROP !== null) {
            setPendingChanges(prev => ({
                ...prev,
                [product_code]: newROP,
            }))

            setIsPendingChanged(true);
        }
    }

    const resetChangeROP = () => {
        setPendingChanges({});
        setIsPendingChanged(false);
    }

    const saveChangeROP = async () => {
        try {
            const res = await api.post('/action/set_rop', {
                productCodeAndNewROP: pendingChanges
            });

            if (res.status === 200) {
                setIsPendingChanged(false);
                showAlert('Update ROP successfully!', 'success');
            }
        } catch (error) {
            console.log("Save ROP failed",error);
            showAlert('Fail to update ROP', 'error')
        }
    }

    return (
        <div>
            <h1 className='text-center text-2xl'>Set Reorder Point</h1>
            <SearchBar onSearch={changeSearchVal} placeholder='Find product...' bg_color='bg-white' />

            <div className='flex justify-end items-center my-6 gap-4'>
                {isPendingChanged && (
                    <Button onClick={resetChangeROP} isDisable={!isPendingChanged} icon='RotateCcw' title='Reset Changes' bg_color='gray' />

                )}
                <Button onClick={saveChangeROP} isDisable={!isPendingChanged} icon='Save' title='Save Changes' text_color='text-white' bg_color='blue' />
            </div>

            {loading ? (
                <Loading state='loading' />
            ) : (
                <TableSetROP products={products} pendingChanges={pendingChanges} onRopChange={handleChangeROP} />
            )}
        </div>
    )
}

export default ROP