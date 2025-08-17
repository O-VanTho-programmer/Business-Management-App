export interface Discount{
    name: string,
    code: string,
    description?: string,
    type: "PERCENTAGE" | "FIXED_AMOUNT",
    value: number,
    discount_limit?: string,
    used?: number,
    usage_limit: string,
    order_minimum?: string,
    status: "ACTIVE" | "IN_ACTIVE"
    start_time: string,
    end_time: string,
    start_date: string,
    end_date: string,
    categories?: Category[],
    products?: Product[],
}