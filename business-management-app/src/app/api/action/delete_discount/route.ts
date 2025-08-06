import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {discount_id} = body;

        await pool.query("DELETE FROM discount WHERE discount_id = ?", [discount_id]);

        return NextResponse.json({message: "Discount Deleted"}, {status: 200})
    } catch (error) {
        return NextResponse.json({message: "Discount Deleted Failed!"}, {status: 500})
    }
}