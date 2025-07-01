import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(res: Response) {
    try {
        const body = await res.json();
        const { products, userId, customerName } = body;

        let totalAmount = 0;

        for (let p of products) {
            totalAmount += p.price * p.quantity_change;
        }

        const transId = Math.random().toString(36).substr(2, 5).toUpperCase();
        const [trans] = await pool.query(
            `INSERT INTO sale_transaction (transaction_id, user_id, total_amount, type, customer) VALUES (?, ?, ?, ?, ?)`,
            [transId, userId, totalAmount, 'SELL', customerName]
        );

        for (let p of products) {
            await pool.query(
                `INSERT INTO transaction_product (transaction_id, product_id, change_quantity, price_at_trans) VALUES (?, ?, ?, ?)`,
                [transId, p.product_code, p.quantity_change, p.price]
            )

            await pool.query(`
                UPDATE product
                SET quantity_in_stock = ?, update_date = NOW()
                WHERE product_id = ?; 
            `, [p.quantity - p.quantity_change, p.product_code]);

            await pool.query(
                `INSERT INTO inventory_transaction (type, quantity, previous_quantity, new_quantity, product_id, user_id, trans_id) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                ['SALE', p.quantity_change, p.quantity, p.quantity_change - p.quantity, p.product_code, userId, transId]
            );
        }
        return NextResponse.json({ status: 200 });

    } catch (error) {
        console.error("Error processing selling:", error);
        return NextResponse.json({ error: "Sell Products Failed!" }, { status: 500 });
    }
}