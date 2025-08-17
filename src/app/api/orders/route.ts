import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    try {
        const query = `
            SELECT 
                s.transaction_id as trans_id, 
                u.username, 
                DATE_FORMAT(s.trans_date, '%d/%m/%Y') AS trans_date,
                s.total_amount,
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'product_id', tp.product_id,
                        'product_name', p.product_name,
                        'change_quantity', tp.change_quantity,
                        'price_at_trans', tp.price_at_trans,
                        'unit', p.unit
                    )
                ) as products
            FROM sale_transaction s
            JOIN user u ON u.user_id = s.user_id
            JOIN transaction_product tp ON tp.transaction_id = s.transaction_id
            JOIN product p ON p.product_id = tp.product_id
            WHERE type='ORDER'
            GROUP BY s.transaction_id
        `;

        const [orders] = await pool.query(query);
        return NextResponse.json({ orders });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
}