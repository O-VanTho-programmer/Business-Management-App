import { useState } from "react";
import useQuery from "./useQuery";

export default function useInventoryQuery() {
    const today = new Date();
    const [displayDateRange, setDisplayDateRange] = useState<string>("Today");

    const [queryCollection, setQueryCollection] = useState({
        search: '',
        startDate: '',
        endDate: '',
        transType: '',
        userType: '',
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

    const changeStartDate = (val: Date | null, endDateVal?: Date | null) => {
        setQueryCollection(prev => {
            const update = {
                ...prev,
                startDate: val ? val.toISOString().split('T')[0] : ''
            };

            if (val && !endDateVal) {
                const todayStr = today.toDateString();
                const startStr = val.toDateString();
                setDisplayDateRange(startStr === todayStr ? "Today" : val.toLocaleDateString());
            } else if (val && endDateVal) {
                setDisplayDateRange(`${val.toLocaleDateString()} - ${endDateVal.toLocaleDateString()}`);
            } else {
                setDisplayDateRange("");
            }
            updateQuery(update);
            return update;
        });
    }

    const changeEndDate = (val: Date | null, startDateVal?: Date | null) => {
        setQueryCollection(prev => {
            const update = {
                ...prev,
                endDate: val ? val.toISOString().split('T')[0] : ''
            };

            if (startDateVal && val) {
                setDisplayDateRange(`${startDateVal.toLocaleDateString()} - ${val.toLocaleDateString()}`);
            } else if (startDateVal && !val) {
                const todayStr = today.toDateString();
                const startStr = startDateVal.toDateString();
                setDisplayDateRange(startStr === todayStr ? "Today" : startDateVal.toLocaleDateString());
            } else {
                setDisplayDateRange("");
            }
            updateQuery(update);
            return update;
        });
    }

    const changeTransType = (val: string) => {
        setQueryCollection(prev => {
            const update = {
                ...prev,
                transType: val
            }

            updateQuery(update);
            return update;
        })
    }

    const changeUserType = (val: string) => {
        setQueryCollection(prev => {
            const update = {
                ...prev,
                userType: val
            }

            updateQuery(update);
            return update;
        })
    }

    return {
        query,
        changeSearchVal,
        changeStartDate, changeEndDate,
        changeTransType, changeUserType,
        resetQuery,
        displayDateRange
    }
}