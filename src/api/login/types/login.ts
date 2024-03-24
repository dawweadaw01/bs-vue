export interface LoginRequestData {
    /** admin 或 editor */
    name: string
    /** 密码 */
    pwd: string

}

export interface UserListRequestData {
    /** 当前页码 */
    page: number
    /** 查询条数 */
    size: number
    /** 查询参数：用户名 */
    username?: string
    /** 查询参数：手机号 */
    phone?: string
}

export interface UserList {
    id: number
    username: string
    phone: string
    email: string
    roles: string
}



