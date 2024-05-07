import type {image} from "@/api/image/types";

export interface CatCategories{
    categoryId: number
    name: string
    origin: string
    description: string
    images?: image[]
}

export interface GetCatCategoriesListParams{
    page: number
    size: number
    name?: string
    description?: string
    origin?: string
}

export interface CatInfo{
    catId: number
    categoryId: number
    catCategories?: CatCategories
    name: string
    age: number
    gender: string
    preferences: string
    healthStatus: string
    availableForAdoption: boolean
    shopId: number
    healthStatusCode: number
    images: image[]
}
