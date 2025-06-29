import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {products, userId} = body;

        let totalAmount = 0;
        for(let p of products) {
            totalAmount += p.added_quantity * p.price;
        }

        const orderId = Math.random().toString(36).substr(2, 5).toUpperCase();
        const [order] = await pool.query(
            `INSERT INTO orders (order_id, user_id, total_amount) VALUES (?, ?, ?)`,
            [orderId, userId, totalAmount]
        );

        for(let p of products) {
            await pool.query(
                `INSERT INTO order_product (order_id, product_id, order_quantity, price_at_order) VALUES (?, ?, ?, ?)`,
                [orderId, p.product_code, p.added_quantity, p.price]
            )

            await pool.query(`
                UPDATE product
                SET quantity_in_stock = ?
                WHERE product_id = ?; 
            `, [p.quantity + p.added_quantity, p.product_code]);

            await pool.query(
                `INSERT INTO inventory_transaction (type, quantity, previous_quantity, new_quantity, product_id, user_id, order_id) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                ['RESTOCK', p.added_quantity, p.quantity, p.added_quantity + p.quantity, p.product_code, userId, orderId]
            );
        }

        return NextResponse.json({status: 200});

    } catch (error) {
        console.error("Error processing order:", error);
        return NextResponse.json({error: "Place Orders Failed!"}, {status: 500});
    }
}