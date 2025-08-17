import pool from "@/lib/db";
import { NextResponse } from "next/server";

interface InventoryStatus {
    total_stock: string,
    low_stock_item: string,
    out_stock_item: string,
}

export async function GET(req: Request) {
    try {
        const query = `
            SELECT
                COUNT(*) as total_stock,
                SUM(quantity_in_stock) AS total_quantity,
                SUM(CASE WHEN quantity_in_stock BETWEEN 1 AND ROP THEN 1 ELSE 0 END) AS low_stock_item,
                SUM(CASE WHEN quantity_in_stock = 0 THEN 1 ELSE 0 END) AS out_stock_item
            FROM product
        `;

        const [rows] = await pool.query<any[]>(query);
        const inventoryStatus = rows[0] as InventoryStatus;

        return NextResponse.json(inventoryStatus);
    } catch (error) {
        console.error("Error fetching inventory summary:", error);
        return NextResponse.json({ error: "Failed to fetch inventory summary" }, { status: 500 });
    }
}