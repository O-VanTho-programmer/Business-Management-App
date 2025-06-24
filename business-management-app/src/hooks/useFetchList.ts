import api from "@/lib/axios";
import { useEffect, useState } from "react";

export default function useFetchList(path:string = 'products', query:string = '') {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);

            try {
                const res = await api.get(`${path}?${query}`);
                console.log(`${path}?${query}`)
                
                setProducts(res.data[path] || []);
            } catch (error) {
                console.error("Error fetching products:", error);
                setError(error);    
            }
            setLoading(false);
        }

        fetchProducts();
    }, [path, query]);

    return { products, loading, error };
}
