import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    try {
        let whereClauses: string[] = [];
        let params: any[] = [];

        whereClauses.push("(type = 'RESTOCK' OR type = 'RETURN')");
        let sellWhereClauses = ["type = 'SALE'"];

        if (startDate) {
            if (endDate) {
                whereClauses.push("(create_date >= ? AND create_date <= ?)");
                sellWhereClauses.push("(create_date >= ? AND create_date <= ?)");

                params.push(startDate, endDate);
            } else {
                whereClauses.push("create_date = ?");
                sellWhereClauses.push("create_date = ?");

                params.push(startDate);
            }
        }

        const additionsQuery = `SELECT SUM(quantity) as totalAdditions FROM inventory_transaction WHERE ${whereClauses.join(" AND ")}`;
        const sellsQuery = `SELECT SUM(quantity) as totalSells FROM inventory_transaction WHERE ${sellWhereClauses.join(" AND ")}`;

        const [additionsRows] = await pool.query(additionsQuery, params) as any[];
        const [sellsRows] = await pool.query(sellsQuery, params) as any[];

        const totalAdditions = additionsRows[0]?.totalAdditions || 0;
        const totalSells = sellsRows[0]?.totalSells || 0;
        const netChange = totalAdditions - totalSells;

        const inventory_movement_summary = [{
            totalAdditions: totalAdditions,
            totalSells: totalSells,
            netChange: netChange
        }];

        return NextResponse.json({inventory_movement_summary});
    } catch (error) {
        console.error("Error in inventory_movement_summary:", error);
        return NextResponse.json({ message: "API inventory movement summary failed" }, { status: 500 });
    }
}