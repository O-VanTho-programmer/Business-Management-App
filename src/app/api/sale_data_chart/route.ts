import pool from "@/lib/db";
import formatDate from "@/utils/formatDate";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const startDate = searchParams.get("startDate");
        const endDate = searchParams.get("endDate");

        if (!startDate || !endDate) {
            return NextResponse.json({ message: "No date range selected" }, { status: 500 })
        }

        const query = `
        SELECT 
            DATE_FORMAT(st.trans_date, '%M %e, %Y') as date,
            st.type,
            SUM(tp.price_at_trans * tp.change_quantity) as total_price
        FROM sale_transaction st
        JOIN transaction_product tp ON tp.transaction_id = st.transaction_id
        WHERE st.trans_date > ? AND st.trans_date <= ?
        GROUP BY st.trans_date, st.type
        ORDER BY date ASC;
        `;

        const [rows]: any[] = await pool.query(query, [startDate, endDate]);

        const result: Record<string, { type: string, total_price: Number }[]> = {};

        const start = new Date(startDate);
        start.setDate(start.getDate() + 1);

        const startDateFormat = formatDate(start);
        const endDateFormat = formatDate(new Date(endDate));

        result[startDateFormat] = [];

        for (const row of rows) {
            const { date, type, total_price } = row;

            if (!result[date]) {
                result[date] = [];
            }

            result[date].push({ type, total_price: Number(total_price) });
        }

        if (!result[endDateFormat]) {
            result[endDateFormat] = [];
        }

        return NextResponse.json({ sale_data_chart: result }, { status: 200 })
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Error api sale data for chart" }, { status: 500 })
    }
}