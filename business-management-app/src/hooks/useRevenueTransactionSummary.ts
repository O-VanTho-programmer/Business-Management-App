import api from "@/lib/axios";
import { useEffect, useState } from "react";

export default function useRevenueTransactionSummary(query: string) {
    const [totalProfit, setTotalProfit] = useState<string>("N/A");
    const [totalCost, setTotalCost] = useState<string>("N/A");
    const [revenue, setRevenue] = useState<string>("N/A");
    const [topProductName, setTopProductName] = useState<string>("Unknown");
    const [topProductTotalQuantitySold, setProductTotalQuantitySold] = useState<string>("Unknown");

    const reset = () => {
        setTotalProfit("N/A")
        setTotalCost("N/A")
        setRevenue("N/A")
        setTopProductName("Unknown")
        setProductTotalQuantitySold("Unknown")
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get(`/revenue_transaction_summary?${query}`);

                setTotalProfit(res.data.total_profit);
                setTotalCost(res.data.order_cost);
                setRevenue(res.data.revenue);
                setTopProductName(res.data.top_product.product_name);
                setProductTotalQuantitySold(res.data.top_product.total_quantity_sold)
            } catch (error) {
                console.log("Error", error);
            }
        }

        reset();
        fetchData();
    }, [query])

    return { totalProfit, totalCost, revenue, topProductName, topProductTotalQuantitySold };
}