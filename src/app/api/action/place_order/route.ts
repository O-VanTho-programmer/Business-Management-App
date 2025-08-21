import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {products, userId} = body;

        let totalAmount = 0;
        for(let p of products) {
            totalAmount += p.quantity_change * p.price;
        }

        const transId = Math.random().toString(36).substr(2, 5).toUpperCase();
        const [trans] = await pool.query(
            `INSERT INTO sale_transaction (transaction_id, user_id, total_amount, type) VALUES (?, ?, ?, ?)`,
            [transId, userId, totalAmount, 'ORDER']
        );

        for(let p of products) {
            await pool.query(
                `INSERT INTO transaction_product (transaction_id, product_id, change_quantity, price_at_trans) VALUES (?, ?, ?, ?)`,
                [transId, p.product_id, p.quantity_change, p.price]
            )

            await pool.query(`
                UPDATE product
                SET quantity_in_stock = quantity_in_stock + ?, update_date = NOW()
                WHERE product_id = ?; 
            `, [p.quantity_change, p.product_id]);

            await pool.query(
                `INSERT INTO inventory_transaction (type, quantity, previous_quantity, new_quantity, product_id, user_id, trans_id) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                ['RESTOCK', p.quantity_change, p.quantity, p.quantity_change + p.quantity, p.product_id, userId, transId]
            );
        }

        return NextResponse.json({status: 201});

    } catch (error) {
        console.error("Error processing order:", error);
        return NextResponse.json({error: "Place Orders Failed!"}, {status: 500});
    }
}