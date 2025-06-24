import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const stock = searchParams.get("stock");
    const search = searchParams.get("search");

    try {
        let conditions: string[] = [];

        if (search) {
            conditions.push(`(p.product_name LIKE "%${search}%" OR p.product_id LIKE "%${search}%")`);
        }

        if (stock === "low") {
            conditions.push(`(p.quantity_in_stock BETWEEN 1 AND p.ROP AND p.ROP IS NOT NULL)`);
        } else if (stock === "out") {
            conditions.push(`p.quantity_in_stock = 0`);
        }

        let query = `
        SELECT
            p.*,
            DATE_FORMAT(p.create_date, '%d/%m/%Y') AS create_date,
            DATE_FORMAT(p.update_date, '%d/%m/%Y') AS update_date,
            c.category_name
        FROM product AS p
        JOIN category AS c ON p.category_id = c.category_id
        `;

        if (conditions.length > 0) {
            query += ` WHERE ${conditions.join(" AND ")}`;
        }

        query += `
            ORDER BY ${stock === "out" ? "p.update_date DESC" : "p.quantity_in_stock ASC"}
        `;

        const [rows] = await pool.query<any[]>(query);
        const products = rows.map(row => ({
            product_code: row.product_id,
            product_name: row.product_name,
            quantity: row.quantity_in_stock,
            unit: row.unit,
            price: parseFloat(row.price.toString()),
            cost: parseFloat(row.cost.toString()),
            ROP: row.ROP === null ? undefined : row.ROP,
            category: row.category_name,
            update_date: row.update_date,
        }));

        return NextResponse.json({ products });
    } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
    }
}
