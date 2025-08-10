interface InventoryTransaction {
    id: string,
    date: string,
    product_id: string,
    product_name: string,
    type: 'RESTOCK' | 'SALE' | 'RETURN',
    quantity: number,
    unit: string,
    previous_quantity: number,
    new_quantity: number,
    user: string,
    transaction_id?: string,
}

interface RevenueTransaction{
    id: string,
    date: string,
    product_id: string,
    product_name: string,
    price_unit: number,
    quantity: number,
    total_price: number,
    type: 'ORDER' | 'SELL',
    user: string,
    customer?: string,
}