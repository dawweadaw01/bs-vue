import type {ShopListRequestData} from "@/api/shop/types/shop";
import {request} from "@/util/service";


export function getShopListApi(data: ShopListRequestData) {
    return request<ApiResponseData<any>>({
        url: "shops/getShopsBySearch",
        method: "post",
        data
    })
}

export function getShopDetailsApi(id: number) {
    return request<ApiResponseData<any>>({
        url: "shops/getShopsById?id=" + id,
        method: "get",
    })
}

export function getShopInfoApi() {
    return request<ApiResponseData<any>>({
        url: "shops/getShopsByOwnerId",
        method: "get",
    })
}

export function updateShopInfoApi(data: any) {
    return request<ApiResponseData<any>>({
        url: "shops/updateShops",
        method: "post",
        data
    })
}

export function updateCatDataApi(data: any) {
    return request<ApiResponseData<any>>({
        url: "cat/updateCat",
        method: "post",
        data
    })
}
