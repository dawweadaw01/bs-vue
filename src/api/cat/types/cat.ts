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