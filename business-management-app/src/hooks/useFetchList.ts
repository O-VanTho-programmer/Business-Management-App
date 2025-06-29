import api from "@/lib/axios";
import { useEffect, useState } from "react";

export default function useFetchList(path:string, query:string = '') {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        const fetchDatas = async () => {
            setLoading(true);
            setError(null);

            try {
                const res = await api.get(`${path}?${query}`);
                console.log(`${path}?${query}`)
                
                setData(res.data[path] || []);
            } catch (error) {
                console.error("Error fetching products:", error);
                setError(error);    
            }
            setLoading(false);
        }

        fetchDatas();
    }, [path, query]);

    return { data, loading, error };
}
