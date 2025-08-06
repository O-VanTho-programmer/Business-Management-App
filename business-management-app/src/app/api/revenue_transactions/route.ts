import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    try {
        let query = `
            SELECT 
                DATE_FORMAT(st.trans_date, '%M %e, %Y %l:%i %p') as date,
                st.type, 
                (tp.change_quantity * tp.price_at_trans)  as total_price, 
                st.customer as customer,
                tp.change_quantity as quantity,
                tp.price_at_trans as price_unit,
                p.product_name,
                p.product_id as product_code
            FROM sale_transaction st
            JOIN transaction_product tp ON tp.transaction_id = st.transaction_id
            JOIN product p ON p.product_id = tp.product_id
        `

        if (startDate && endDate) {
            query += `
                WHERE st.trans_date > '${startDate}' AND st.trans_date <= '${endDate}'
            `;
        }

        query += `
            ORDER BY date ASC
        `

        const [revenue_transactions] = await pool.query(query);

        return NextResponse.json({ revenue_transactions })
    } catch (error) {
        console.log("Error", error);
        return NextResponse.json({ message: "Error revenue transaction API" }, { status: 500 })
    }
}