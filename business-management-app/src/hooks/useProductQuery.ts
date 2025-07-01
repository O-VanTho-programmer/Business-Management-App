import { useState } from 'react';
import useQuery from './useQuery';

export default function useProductQuery() {
    const [queryCollection, setQueryCollection] = useState({
        search: '',
        stock: ''
    });

    const { query, updateQuery, resetQuery } = useQuery("");

    const changeSearchVal = (val: string) => {
        setQueryCollection(prev => {
            const updated = {
                ...prev,
                search: val
            }
            updateQuery(updated);

            return updated;
        });
    }

    const changeStockFilter = (val: string) => {
        const updated = { ...queryCollection, stock: val };

        setQueryCollection(updated);
        updateQuery(updated);
    }

    const resetStockFilter = () => {
        const updated = { ...queryCollection, stock: "" };

        setQueryCollection(updated);
        updateQuery(updated);
    }

    return {
        query,
        changeSearchVal,
        changeStockFilter,
        resetStockFilter,
        resetQuery
    }
}