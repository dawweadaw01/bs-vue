export interface sysRoles {
    id: number
    name: string
    description: string
    permissions?: string
}

export interface roleListRequestData {
    /** 当前页码 */
    page: number
    /** 查询条数 */
    size: number
    /** 查询参数：角色名 */
    name?: string

    description?: string
}

export interface sysPermission {
    id: number
    name: string
    description?: string
    url?: string
    method?: string
}

export interface PermissionListRequestData {
    page: number
    size: number
    name?: string
    description?: string
}