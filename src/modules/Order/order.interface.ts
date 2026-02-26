export interface CreateOrderPayload {
    providerId : string;
    address : string;
    items : {
        mealId: string;
        quantity: number
    }[]
} 


