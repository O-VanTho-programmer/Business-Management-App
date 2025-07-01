export interface SaleTransactionProduct {
    product_id: string;
    product_name: string;
    unit: string;
    price_at_trans: number;
    change_quantity: number;
}

export interface SaleTransaction {
    trans_id: string;
    username: string;
    total_amount: number;
    products: SaleTransactionProduct[];
    trans_date: string;
    customer?: string;
}
