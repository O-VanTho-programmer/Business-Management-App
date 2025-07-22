import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { items } = body;

        const queryIsExisted = `
            SELECT product_name FROM product WHERE product_name = ?
        `;

        const queryGetProductId = `
            SELECT product_id FROM product WHERE product_name = ?
        `

        const queryUpdateProduct = `
            UPDATE product
            SET 
                quantity_in_stock = quantity_in_stock + ?,
                update_date = CURRENT_TIMESTAMP
            WHERE product_name = ?
        `

        const queryNewProduct = `
            INSERT INTO product (product_id, product_name, quantity_in_stock, unit, cost)
            VALUES (?, ?, ?, ?, ?)
        `

        let totalAmount = 0;

        for(const item of items){
            totalAmount += item.total_price;
        }

        let userId = "U123";
        //New Order
        const orderId = Math.random().toString(36).substr(2, 5).toUpperCase();
        const [trans] = await pool.query(
            `INSERT INTO sale_transaction (transaction_id, user_id, total_amount, type) VALUES (?, ?, ?, ?)`,
            [orderId, userId, totalAmount, 'ORDER']
        );

        for (const item of items) {
            const [existed] = await pool.query(queryIsExisted, [item.product_name]) as any[];
            let productId;

            if (existed.length > 0) {
                await pool.query(queryUpdateProduct, [item.quantity, item.product_name]);

                const [idRows] = await pool.query(queryGetProductId, [item.product_name]) as any[];
                productId = idRows[0].product_id
            } else {
                productId = Math.random().toString(36).substr(2, 5).toUpperCase();
                await pool.query(queryNewProduct, [productId, item.product_name, item.quantity, item?.unit || 'unit', item.unit_price])
            }

            await pool.query(
                `INSERT INTO transaction_product (transaction_id, product_id, change_quantity, price_at_trans) VALUES (?, ?, ?, ?)`,
                [orderId, productId, item.quantity, item.unit_price]
            )
        }

        return NextResponse.json({ items }, { status: 200 })
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Error place order from scanned invoice" }, { status: 500 })
    }
}