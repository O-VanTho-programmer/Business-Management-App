import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const [categoryRows] = await pool.query<any[]>(`SELECT * FROM category`);

        let categories: Category[] = categoryRows.map((row) => ({
            category_id: row.category_id,
            category_name: row.category_name,
            description: row.description,
        }))

        return NextResponse.json({categories} , {status: 200});
    } catch (error) {
        console.log(error);
        return NextResponse.json({message: "Error fetching API get categories"}, {status: 500});
    }
} 