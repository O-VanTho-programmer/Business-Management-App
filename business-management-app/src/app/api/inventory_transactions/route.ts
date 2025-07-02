import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET (req: Request){
    try {
        const query = `
            SELECT 
                it.inventory_transaction_id as id,
                DATE_FORMAT(it.create_date, '%M %e, %Y %l:%i %p') as date,
                it.type,
                it.quantity,
                it.previous_quantity,
                it.new_quantity,
                it.trans_id as transaction_id,
                p.product_id as product_code,
                p.product_name,
                p.unit,
                u.username as user
            FROM inventory_transaction it
            JOIN product p ON p.product_id = it.product_id
            JOIN user u ON u.user_id = it.user_id
        `;

        const [inventory_transactions] = await pool.query(query);
        
        return NextResponse.json({inventory_transactions}, {status: 200});
    } catch (error) {
        console.log("Error inventory transactions", error);
        return NextResponse.json({message: "API inventory transactions failed"}, {status: 500});
    }
}