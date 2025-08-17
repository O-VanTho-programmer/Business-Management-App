import api from "@/lib/axios";
import { useEffect, useState } from "react";

export default function useInventoryStatus() {
    const [totalStock, setTotalStock] = useState<string>("N/A");
    const [totalQuantity, setTotalQuantity] = useState<string>("N/A");
    const [totalLowStockItem, setTotalLowStockItem] = useState<string>("N/A");
    const [totalOutStockItem, setTotalOutStockItem] = useState<string>("N/A");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get('/inventory_status');

                setTotalStock(res.data.total_stock);
                setTotalQuantity(res.data.total_quantity);
                setTotalLowStockItem(res.data.low_stock_item);
                setTotalOutStockItem(res.data.out_stock_item);
            } catch (error) {
                console.log("Error", error);
            }
        }

        fetchData();
    }, [])

    return {totalStock, totalQuantity, totalLowStockItem, totalOutStockItem};
}