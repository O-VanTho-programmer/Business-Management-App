import api from "@/lib/axios";
import { useEffect, useState } from "react";

export default function useRevenueTransactionSummary(query: string) {
    const [totalProfit, setTotalProfit] = useState<string>("N/A");
    const [totalCost, setTotalCost] = useState<string>("N/A");
    const [revenue, setRevenue] = useState<string>("N/A");
    const [topProductName, setTopProductName] = useState<string>("Unknown");
    const [topProductTotalQuantitySold, setProductTotalQuantitySold] = useState<string>("Unknown");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get(`/revenue_transaction_summary?${query}`);

                setTotalProfit(res.data.total_profit || '0');
                setTotalCost(res.data.order_cost || '0');
                setRevenue(res.data.revenue || '0');
                setTopProductName(res.data.top_product.product_name || 'Unknown');
                setProductTotalQuantitySold(res.data.top_product.total_quantity_sold || '0')
            } catch (error) {
                console.log("Error", error);
            }
        }

        fetchData();
    }, [query])

    return { totalProfit, totalCost, revenue, topProductName, topProductTotalQuantitySold };
}