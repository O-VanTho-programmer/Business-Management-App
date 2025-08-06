import { useState } from 'react';
import useQuery from './useQuery';

export default function useDiscountQuery() {

    const [queryCollection, setQueryCollection] = useState({
        status: '',
        currentPage: 0,
        rowsPerPage: 0,
    });

    const { query, updateQuery, resetQuery } = useQuery("");

    const changeFilterStatus = (val: string) => {
        setQueryCollection(prev => {
            const updated = {
                ...prev,
                status: val
            }

            updateQuery(updated);

            return updated;
        })
    }

    const changeCurrentPage = (val: number) => {
        setQueryCollection(prev => {
            const updated = {
                ...prev,
                currentPage: val
            }

            updateQuery(updated);

            return updated;
        })
    }

    const changeRowsPerPage = (val: number) => {
        setQueryCollection(prev => {
            const updated = {
                ...prev,
                rowsPerPage: val
            }

            updateQuery(updated);

            return updated;
        })
    }

    return {
        query, changeCurrentPage, changeFilterStatus, changeRowsPerPage,
        currentPage: queryCollection.currentPage, filterStatus: queryCollection.status, rowsPerPage: queryCollection.rowsPerPage
    };
}

