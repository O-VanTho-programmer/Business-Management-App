interface Product {
    product_id: string;
    product_name: string;
    quantity: number;
    unit: string;
    quantity_change?: number;
    price?: number;
    cost?: number;
    ROP?: number;
    category?: string;
    update_date?: string;
    discounted_price?: number;
    discount_amount?: number;
}