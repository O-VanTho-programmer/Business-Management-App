interface Product {
    product_code: string;
    product_name: string;
    quantity: number;
    unit: string;
    previous_quantity?: number;
    new_quantity?: number;
    price?: number;
    cost?: number;
    ROP?: number;
    category?: string;
    update_date?: string;
}