import { useState } from "react";

export default function useQuery(initial: string) {
    const [query, setQuery] = useState(initial);

    const updateQuery = (queryCollection: Record<string, string> = {}) => {
        let newQuery = "";

        for (const key in queryCollection) {
            const val = queryCollection[key];

            if (val !== "") {
                newQuery += `${key}=${val}&`;
            }
        }

        setQuery(newQuery);
    }

    const resetQuery = () => {
        setQuery(initial);
    }

    return { query, updateQuery, resetQuery };
}
