import { useState } from 'react';
import useQuery from './useQuery';

export default function useProductQuery() {
    const [queryCollection, setQueryCollection] = useState({
        search: '',
        stock: '',
        category_id: '',
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

    const changeCategoryFilter = (val:string) => {
        const update = {...queryCollection, category_id: val};

        setQueryCollection(update);
        updateQuery(update);
    }

    const resetStockFilter = () => {
        const updated = { ...queryCollection, stock: "" };

        setQueryCollection(updated);
        updateQuery(updated);
    }

    return {
        query,
        category_id: queryCollection.category_id,
        changeSearchVal,
        changeStockFilter,
        resetStockFilter,
        changeCategoryFilter,
        resetQuery
    }
}