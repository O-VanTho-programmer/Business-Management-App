import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { discount_code, selectedProducts } = body;

        // Validate input
        if (!discount_code || !selectedProducts || !Array.isArray(selectedProducts)) {
            return NextResponse.json({
                success: false,
                message: "Invalid input: discount_code and selectedProducts array are required"
            }, { status: 400 });
        }

        // Create a map of category to product indices for efficient lookup
        let mapCategoryProducts: Map<string, number[]> = new Map();
        for (let i = 0; i < selectedProducts.length; i++) {
            const p = selectedProducts[i];
            if (!mapCategoryProducts.has(p.category)) {
                mapCategoryProducts.set(p.category, []);
            }
            mapCategoryProducts.get(p.category)!.push(i);
        }

        // Query to get discount information and its applicable products/categories
        const discountQuery = `
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
                d.start_date,
                d.end_date,
                p.product_id,
                c.category_id
            FROM discount d
            LEFT JOIN discount_apply da ON da.discount_id = d.discount_id
            LEFT JOIN product p ON p.product_id = da.product_id
            LEFT JOIN category c ON c.category_id = da.category_id
            WHERE d.discount_id = ? 
            AND d.status = 'ACTIVE'
            AND CURDATE() BETWEEN d.start_date AND d.end_date
        `;

        const [discountResults] = await pool.query(discountQuery, [discount_code]) as any[];

        if (discountResults.length === 0) {
            return NextResponse.json({
                success: false,
                message: "Discount code not found or inactive"
            }, { status: 404 });
        }

        // Get the discount information from the first result
        const discountInfo = {
            code: discountResults[0].code,
            name: discountResults[0].name,
            description: discountResults[0].description,
            type: discountResults[0].type,
            value: discountResults[0].value,
            used: discountResults[0].used,
            usage_limit: discountResults[0].usage_limit,
            discount_limit: discountResults[0].discount_limit,
            order_minimum: discountResults[0].order_minimum,
            status: discountResults[0].status,
            start_date: discountResults[0].start_date,
            end_date: discountResults[0].end_date
        };

        // Check usage limit
        if (discountInfo.used >= parseInt(discountInfo.usage_limit)) {
            return NextResponse.json({
                success: false,
                message: "Discount usage limit exceeded"
            }, { status: 400 });
        }

        // Calculate total order value
        const totalOrderValue = selectedProducts.reduce((sum: number, product: any) => {
            return sum + (product.price * product.quantity);
        }, 0);

        // Check order minimum if specified
        if (discountInfo.order_minimum && totalOrderValue < parseFloat(discountInfo.order_minimum)) {
            return NextResponse.json({
                message: `Order minimum of ${discountInfo.order_minimum} required`
            }, { status: 400 });
        }

        let appliedIndexProducts = new Set<number>();

        const ALL_CATEGORY_ID = "ALL";
        let hasAllCategory = false;

        for (const discountResult of discountResults) {
            if (discountResult.category_id === ALL_CATEGORY_ID) {
                hasAllCategory = true;
                break;
            }

            if (discountResult.product_id) {
                for (let index = 0; index < selectedProducts.length; index++) {
                    if (selectedProducts[index].product_id === discountResult.product_id) {
                        appliedIndexProducts.add(index);
                    }
                }
            }

            if (discountResult.category_id) {
                const associatedProducts = mapCategoryProducts.get(discountResult.category_id) || [];

                for (let index of associatedProducts) {
                    appliedIndexProducts.add(index);
                }
            }
        }

        if (hasAllCategory) {
            // Apply discount to all products
            for (let i = 0; i < selectedProducts.length; i++) {
                appliedIndexProducts.add(i);
            }
        }

        // If no specific products/categories are defined, apply to all products
        if (appliedIndexProducts.size === 0) {
            for (let i = 0; i < selectedProducts.length; i++) {
                appliedIndexProducts.add(i);
            }
        }

        // Apply discount to eligible products
        const updatedProducts = [...selectedProducts];

        for (let i of appliedIndexProducts) {
            const product = updatedProducts[i];
            const originalPrice = product.price * product.quantity;

            let discountAmount = 0;
            if (discountInfo.type === 'PERCENTAGE') {
                discountAmount = originalPrice * (discountInfo.value / 100);
            } else {
                discountAmount = Math.min(discountInfo.value, originalPrice);
            }

            // Apply discount limit if specified
            if (discountInfo.discount_limit) {
                discountAmount = Math.min(discountAmount, parseFloat(discountInfo.discount_limit));
            }

            updatedProducts[i] = {
                ...product,
                discounted_price: Math.max(0, originalPrice - discountAmount),
                discount_amount: discountAmount
            };
        }

        return NextResponse.json({
            discount: discountInfo,
            updatedProducts: updatedProducts,
            appliedToIndices: Array.from(appliedIndexProducts)
        }, { status: 200 });

    } catch (error) {
        console.error('Error in valid_discount:', error);
        return NextResponse.json({
            success: false,
            message: "Internal server error"
        }, { status: 500 });
    }
}