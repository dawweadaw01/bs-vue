export interface Shop{
    id: number
    name: string
    address: string
    offDay: string
    logo: string
    cover: string
    ownerId: number
    phoneNumber: string
    status: number
    fixedPrice: number
    shopImages?: string[]
    catImages?: string[]
}

export interface ShopListRequestData {
    /** 当前页码 */
    page: number
    /** 查询条数 */
    size: number
    /** 查询参数: 关键字 */
    keyword?: string
}

export interface scoreData{
    userId?: number
    storeId: number
    score: number
}
