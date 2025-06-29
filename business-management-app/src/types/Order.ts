interface Order{
    order_id: string;
    username: string;
    products: {
        product_id: string;
        product_name: string;
        order_quantity: number;
        price_per_unit: number;
        unit: string;
    }[];
    total_amount: number;
    order_date: string;
}