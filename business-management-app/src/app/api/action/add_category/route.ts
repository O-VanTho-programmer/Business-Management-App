import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        let { category_id, category_name, description } = body.newCategory;

        if (!category_id) {
            category_id = Math.random().toString(36).substr(2, 5).toUpperCase();
        }

        const query = `
            INSERT INTO category (category_id, category_name, description)
            VALUES (?, ?, ?);
        `;

        await pool.query(query, [category_id, category_name, description]);

        return NextResponse.json({ status: 201 });
    } catch (error) {
        console.log("Error add category API", error);
        return NextResponse.json({ status: 500 });
    }
}