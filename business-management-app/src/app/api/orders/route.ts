import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    try {
        const query = `
            SELECT 
                o.order_id, 
                u.username, 
                DATE_FORMAT(o.order_date, '%d/%m/%Y') AS order_date,
                o.total_amount,
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'product_id', op.product_id,
                        'product_name', p.product_name,
                        'order_quantity', op.order_quantity,
                        'price_at_order', op.price_at_order,
                        'unit', p.unit
                    )
                ) as products
            FROM orders o
            JOIN user u ON u.user_id = o.user_id
            JOIN order_product op ON op.order_id = o.order_id
            JOIN product p ON p.product_id = op.product_id
            GROUP BY o.order_id
        `;

        const [orders] = await pool.query(query);
        return NextResponse.json({ orders });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
}