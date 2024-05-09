import type {Shop} from "@/api/shop/types/shop";

export interface appointment{
    id: number
    storeId: number
    appointmentTimeStr: string
    userId: number
    orderStatus: number
    fixedPrice: number
    shops?: Shop
}

export interface appointmentRequest{
    orderStatus: number
    page: number
    size: number
}
