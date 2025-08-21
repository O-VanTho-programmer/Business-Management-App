import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if(!startDate || !endDate){
        return NextResponse.json({status: 201});
    }

    try {
        const [[orderCostResult]] = await pool.query(`
            SELECT COALESCE(SUM(total_amount), 0) as total_order_cost
            FROM sale_transaction
            WHERE type = 'ORDER' AND trans_date > '${startDate}' AND trans_date <= '${endDate}'
        `) as any[];

        const [[revenueResult]] = await pool.query(`
            SELECT COALESCE(SUM(total_amount), 0) as total_revenue
            FROM sale_transaction
            WHERE type = 'SELL' AND trans_date >= '${startDate}' AND trans_date <= '${endDate}'
        `) as any[];

        const totalProfitValue = revenueResult.total_revenue - orderCostResult.total_order_cost;
        const totalProfit = `${totalProfitValue}`;

        const queryTopSoldProduct = `
            SELECT 
                p.product_name,
                SUM(tp.change_quantity) AS total_quantity_sold
            FROM sale_transaction st
            JOIN transaction_product tp ON tp.transaction_id = st.transaction_id
            JOIN product p ON p.product_id = tp.product_id
            WHERE st.trans_date >= ? AND st.trans_date <= ?
            GROUP BY p.product_name
            ORDER BY total_quantity_sold DESC
            LIMIT 1
        `;

        const [topProductRows] = await pool.query(queryTopSoldProduct, [startDate, endDate]) as any[];

        const topProduct = topProductRows[0] || { product_name: "Unknown", total_quantity_sold: 0 };

        return NextResponse.json({
            total_profit: totalProfit,
            order_cost: orderCostResult.total_order_cost,
            revenue: revenueResult.total_revenue,
            top_product: {
                product_name: topProduct.product_name,
                total_quantity_sold: topProduct.total_quantity_sold,
            }

        }, { status: 200 });

    } catch (error) {
        console.error("Error Revenue Summary", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
