import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { discount, isUpdateMode, selectedCategories, selectedProducts } = body;
    let message = "";

    const startDatetime = `${discount.start_date} ${discount.start_time}`;
    const endDatetime = `${discount.end_date} ${discount.end_time}`;

    if (isUpdateMode) {
      const updateQuery = `
        UPDATE discount
        SET 
          name = ?, description = ?, type = ?, value = ?, discount_limit = ?, order_minimum = ?,
          status = ?, start_date = ?, end_date = ?, usage_limit = ?
        WHERE discount_id = ?
      `;

      await pool.query(updateQuery, [
        discount.name,
        discount.description,
        discount.type,
        discount.value,
        discount.discount_limit,
        discount.order_minimum,
        discount.status,
        startDatetime,
        endDatetime,
        discount.usage_limit,
        discount.code
      ]);

      // Remove all current associations
      await pool.query(`DELETE FROM discount_apply WHERE discount_id = ?`, [discount.code]);
      message = "Discount updated!";
    } else {
      const checkExistQuery = `SELECT discount_id FROM discount WHERE discount_id = ?`;
      const [existing]: any = await pool.query(checkExistQuery, [discount.code]);

      if (existing.length > 0) {
        return NextResponse.json({ message: "Discount code already exists. Try another!" }, { status: 400 });
      }

      const insertQuery = `
        INSERT INTO discount 
        (discount_id, name, description, type, value, discount_limit, order_minimum, status, start_date, end_date, usage_limit)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      await pool.query(insertQuery, [
        discount.code,
        discount.name,
        discount.description,
        discount.type,
        discount.value,
        discount.discount_limit,
        discount.order_minimum,
        discount.status,
        startDatetime,
        endDatetime,
        discount.usage_limit
      ]);

      message = "Discount added!";
    }

    // Apply discount to categories
    await applyDiscountToEntities(selectedCategories, discount.code, "category_id");
    await applyDiscountToEntities(selectedProducts, discount.code, "product_id");

    return NextResponse.json({ message }, { status: 200 });
  } catch (error) {
    console.error("Error in add_discount:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

async function applyDiscountToEntities(entities: any[], discountCode: string, key: "category_id" | "product_id") {
  if (!entities || entities.length === 0) return;

  const applyQuery = `
    INSERT INTO discount_apply (discount_id, ${key})
    VALUES (?, ?)
  `;

  for (const item of entities) {
    const id = item[key];
    if (!id) continue;
    await pool.query(applyQuery, [discountCode, id]);
  }
}
