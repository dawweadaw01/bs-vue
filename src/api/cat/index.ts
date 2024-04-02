import type {CatCategories, GetCatCategoriesListParams} from "@/api/cat/types/cat";
import {request} from "@/util/service";

export function getCatCategoriesApi(data: GetCatCategoriesListParams) {
    return request<ApiResponseData<any>>({
        url: "catCategories/getCatCategories",
        method: "post",
        data
    })
}

export function addCatCategoriesDataApi(data: CatCategories) {
    return request<ApiResponseData<any>>({
        url: "catCategories/insertCatCategories",
        method: "post",
        data
    })
}

export function updateCatCategoriesDataApi(data: CatCategories) {
    return request<ApiResponseData<any>>({
        url: "catCategories/updateCatCategories",
        method: "post",
        data
    })
}

export function deleteCatCategoriesApi(categoryId: number) {
    return request<ApiResponseData<any>>({
        url: "catCategories/deleteCatCategories",
        method: "post",
        data: {categoryId},
        contentType: "application/x-www-form-urlencoded"
    })
}