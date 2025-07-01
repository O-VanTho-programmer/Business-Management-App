import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(res: Response){
    try {
        const body = await res.json();
        const {productCodeAndNewROP} = body;

        const query = `
            UPDATE product
            SET ROP = ?, update_date = NOW()
            WHERE product_id = ?
        `
        for(const [product_code, newROP] of Object.entries(productCodeAndNewROP)){
            await pool.query(query, [newROP, product_code])
        }

        return NextResponse.json({status: 200})

    } catch (error) {
        console.log(error);
        return NextResponse.json({error: "Api save ROP failed"}, {status: 500});
    }
}