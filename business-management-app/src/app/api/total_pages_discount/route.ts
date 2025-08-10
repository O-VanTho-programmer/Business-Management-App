import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const rowsPerPage = parseInt(searchParams.get("rowPerPage") || '5');
        const status = searchParams.get("status");

        const [[rowCountDiscount]] = await pool.query(`
            SELECT COUNT(discount_id) as num_discount
            FROM discount
            ${status ? `WHERE status = "${status}"` : ""}
        `) as any[];

        const totalDiscounts = rowCountDiscount?.num_discount || 0;
        const total_pages_discount = Math.max(1, Math.ceil(totalDiscounts / rowsPerPage));

        return NextResponse.json({total_pages_discount}, {status: 200});
    } catch (error) {
        return NextResponse.json({message: "Error total pages of discount API", error}, {status: 500});
    }
}