import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search");
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const transType = searchParams.get('transType');
    const userType = searchParams.get('userType');

    try {
        let conditions = [];

        if (search) {
            conditions.push(
                `(p.product_name LIKE "%${search}%" OR p.product_id LIKE "%${search}%")`
            );
        }

        if (startDate) {

            if (endDate) {
                conditions.push(`(it.create_date >= '${startDate}' AND it.create_date <= '${endDate}')`);
            }else {
                conditions.push(`(it.create_date = '${startDate}')`);
            }
        }

        if (transType && transType !== undefined) {
            conditions.push(`(it.type = "${transType}")`);
        }

        if (userType && userType !== undefined) {
            conditions.push(`(u.role = "${userType}")`);
        }

        let query = `
            SELECT 
                it.inventory_transaction_id as id,
                DATE_FORMAT(it.create_date, '%M %e, %Y %l:%i %p') as date,
                it.type,
                it.quantity,
                it.previous_quantity,
                it.new_quantity,
                it.trans_id as transaction_id,
                p.product_id as product_id,
                p.product_name,
                p.unit,
                u.username as user
            FROM inventory_transaction it
            JOIN product p ON p.product_id = it.product_id
            JOIN user u ON u.user_id = it.user_id
        `;

        if (conditions.length > 0) {
            query += `WHERE ${conditions.join(" AND ")}`;
        }

        const [inventory_transactions] = await pool.query(query);

        return NextResponse.json({ inventory_transactions }, { status: 200 });
    } catch (error) {
        console.log("Error inventory transactions", error);
        return NextResponse.json({ message: "API inventory transactions failed" }, { status: 500 });
    }
}