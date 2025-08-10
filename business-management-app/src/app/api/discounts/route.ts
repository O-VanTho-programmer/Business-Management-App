import pool from "@/lib/db";
import { Discount } from "@/types/Discount";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const currentPage = parseInt(searchParams.get("currentPage") || '1');
        const rowsPerPage = parseInt(searchParams.get("rowPerPage") || '5');
        const status = searchParams.get("status");

        if (currentPage < 1) {
            return NextResponse.json({ message: "Invalid page", status: 400 });
        }

        const offSet = rowsPerPage * (currentPage - 1);

        const queryDiscount = `
            SELECT
                d.discount_id as code,
                d.name,
                d.description,
                d.type,
                d.value,
                d.used,
                d.usage_limit,
                d.discount_limit,
                d.order_minimum,
                d.status,
                DATE_FORMAT(d.start_date, '%d/%m/%Y') as start_date,
                DATE_FORMAT(d.end_date, '%d/%m/%Y') as end_date,
                DATE_FORMAT(d.start_date, '%h:%i %p') AS start_time,
                DATE_FORMAT(d.end_date, '%h:%i %p') AS end_time
            FROM discount d
            ${status ? `WHERE d.status = ?` : ""}
            ORDER BY d.start_date DESC
            LIMIT ? OFFSET ?;
        `;

        const queryParams : any[] = [];

        if(status){
            queryParams.push(status);
        }

        queryParams.push(rowsPerPage, offSet);

        const [discounts] = await pool.query<any[]>(queryDiscount, queryParams);

        const querySelectedCategories = `
            SELECT 
                c.category_id,
                c.category_name,
                c.description
            FROM discount_apply da
            JOIN category c ON c.category_id = da.category_id
            WHERE da.discount_id = ?
        `;

        const querySelectedProducts = `
            SELECT 
                p.*
            FROM discount_apply da
            JOIN product p ON p.product_id = da.product_id
            WHERE da.discount_id = ?
        `;

        for(let discount of discounts){
            const [categoryRows] = await pool.query<any[]>(querySelectedCategories, [discount.code]);
            const [productsRows] = await pool.query<any[]>(querySelectedProducts, [discount.code]);

            discount.categories = categoryRows.map((row) => ({
                category_id: row.category_id,
                category_name: row.category_name,
                description: row.description,
            }))

            discount.products = productsRows.map(row => ({
                product_id: row.product_id,
                product_name: row.product_name,
                quantity: row.quantity_in_stock,
                unit: row.unit,
                price: parseFloat(row.price.toString()),
                cost: parseFloat(row.cost.toString()),
                ROP: row.ROP === null ? undefined : row.ROP,
                category: row.category_name,
                update_date: row.update_date,
            }));
        }

        return NextResponse.json({
            discounts
        }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Error API get Discounts", error }, { status: 500 });
    }
}