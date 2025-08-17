'use client';
import { useAlert } from '@/components/AlertProvider/AlertContext';
import Button from '@/components/Button/Button'
import DiscountTable from '@/components/DiscountTable/DiscountTable';
import AddDiscountModal from '@/components/Modals/AddDiscountModal/AddDiscountModal';
import Pagination from '@/components/Pagination/Pagination';
import useDiscountQuery from '@/hooks/useDiscountQuery';
import useFetchList from '@/hooks/useFetchList';
import api from '@/lib/axios';
import { Discount } from '@/types/Discount';
import React, { useEffect, useState } from 'react'

export default function DiscountPage() {
    const { showAlert } = useAlert();

    const { query, currentPage, filterStatus, rowsPerPage,
        changeCurrentPage, changeFilterStatus, changeRowsPerPage } = useDiscountQuery();
    const { data: discounts, setData: setDiscounts} = useFetchList('discounts', query);
    const {data: totalPages} = useFetchList('total_pages_discount', query);
    const [openDiscountModal, setOpenDiscountModal] = useState<boolean>(false);

    const [selectedDiscount, setSelectedDiscount] = useState<Discount | null>(null);

    const [isSaving, setIsSaving] = useState<boolean>(false);

    useEffect(() => {
        changeCurrentPage(1);
        changeRowsPerPage(5);
        changeFilterStatus('');
    }, []);

    const handleCurrentPageChange = (page: number) => {
        if (page < 0 || page > totalPages) {
            return;
        }

        changeCurrentPage(page);
    }

    const syncUpdatedDiscount = (discount: Discount) => {
        setDiscounts((prev: Discount[]) => {
            let index = prev.findIndex((d: Discount) => d.code === discount.code);

            if(index !== -1){
                let update = [...prev];
                update[index] = {
                    ...discount
                }
                return update;
            }

            return [...prev, {...discount}];
        })
    }

    const handleSaveUpdate = async (discount: Discount, isUpdateMode: boolean, selectedCategories: Category[], selectedProducts: Product[]) => {
        try {
            const res = await api.post("/action/add_discount", {
                discount, isUpdateMode, selectedCategories, selectedProducts
            });
            
            if(res.status === 200){
                showAlert(res.data.message, 'success');
                syncUpdatedDiscount(discount);
            }
        } catch (error) {
            showAlert("Update Discount Failed!", 'error');
        }
    }

    const handleDeleteDiscount = async (code: string) => {
        try {
            const res = await api.post("/action/delete_discount", {
                discount_id: code
            });

            if(res.status === 200){
                showAlert(res.data.message, 'success');

                setDiscounts((prev: Discount[]) => prev.filter((dis: Discount) => dis.code !== code));
            }
        } catch (error) {
            showAlert("Delete Discount Failed!", 'error');
        }
    }

    const openEditDiscount = (code: string) => {
        const foundDiscount = discounts.find((d: Discount) => d.code === code);

        setSelectedDiscount(foundDiscount || null);
        setOpenDiscountModal(true);
    }

    return (
        <div className="p-4 md:p-8 min-h-screen">
            {/* Header Section with Buttons */}
            <div className="flex justify-end gap-3 mb-6">
                <Button isDisable={false} title='Add Discount' bg_color='blue' onClick={() => setOpenDiscountModal(true)} />
            </div>

            <DiscountTable discounts={discounts} onDeleteDiscount={handleDeleteDiscount} onEditDiscount={openEditDiscount} />

            <Pagination
                currentPage={currentPage}
                onChangePage={handleCurrentPageChange}
                rowsPerPage={rowsPerPage}
                onChangeRowsPerPage={(rows: number) => changeRowsPerPage(rows)}
                totalPages={totalPages} />

            {/* Add Discount Modal */}
            <AddDiscountModal
                discount={selectedDiscount}
                isOpen={openDiscountModal}
                onClose={() => {setSelectedDiscount(null); setOpenDiscountModal(false)}}
                onSave={handleSaveUpdate}
                isSaving={isSaving} />
        </div>
    )
}