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