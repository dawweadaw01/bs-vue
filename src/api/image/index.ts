import {request} from "@/util/service";


export function deleteImage(id: number) {
    return request<ApiResponseData<any>>({
        url: "images/adminDelete",
        method: "post",
        data: {id},
        contentType: "application/x-www-form-urlencoded"
    })
}

export function adminUploadImage(data: FormData) {
    return request<ApiResponseData<any>>({
        url: "images/adminUpload",
        method: "post",
        data,
        contentType: "multipart/form-data"
    })
}

export function getCatCategoriesImage(id: number) {
    return request<ApiResponseData<any>>({
        url: "images/adminGetList?id=" + id,
        method: "get"
    })
}

export function UploadImage(data: FormData) {
    return request<ApiResponseData<any>>({
        url: "images/upload",
        method: "post",
        data,
        contentType: "multipart/form-data"
    })
}

export function deleteShopCatImage(imageId: number, catId: number) {
    return request<ApiResponseData<any>>({
        url: "images/ShopCatDelete",
        method: "post",
        data: {imageId, catId},
        contentType: "application/x-www-form-urlencoded"
    })
}

export function uploadShopCatImage(data: FormData) {
    return request<ApiResponseData<any>>({
        url: "cat/catUpload",
        method: "post",
        data,
        contentType: "multipart/form-data"
    })
}

export function uploadShopImage(data: FormData) {
    return request<ApiResponseData<any>>({
        url: "shopImages/upload",
        method: "post",
        data,
        contentType: "multipart/form-data"
    })
}

export function deleteShopImage(imageId: number) {
    return request<ApiResponseData<any>>({
        url: "shopImages/Delete",
        method: "post",
        data: {imageId},
        contentType: "application/x-www-form-urlencoded"
    })
}
