import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        let {
            product_code,
            product_name,
            quantity,
            unit,
            price,
            cost,
            ROP,
            category } = body.newProduct;

        if(!product_code){
            product_code = Math.random().toString(36).substr(2, 5).toUpperCase();
        }
        
        const query = `
            INSERT INTO product (product_id, product_name, quantity_in_stock, unit, price, cost, ROP, category_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?);
        `;

        await pool.query(query, [product_code, product_name, quantity, unit, price, cost, ROP ? ROP : null, category ]);
        
        return NextResponse.json({status: 200});
    } catch (error) {
        console.log("Error adding product API",error);
        return NextResponse.json({message: "Error adding product API"}, {status: 500});
    }
}