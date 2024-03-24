import {request} from "@/util/service";
import type * as Login from "./types/login"

export function loginApi(data: Login.LoginRequestData) {
    return request<ApiResponseData<any>>({
        url: "sysUser/doLogin",
        method: "post",
        data
    })
}

/**获取用户列表
 * 需要用管理员权限
 * */
export function getUserListApi(data: Login.UserListRequestData) {
    return request<ApiResponseData<any>>({
        url: "sysUser/list",
        method: "post",
        data
    })
}


export function updateTableDataApi(data: Login.UserList) {
    return request<ApiResponseData<any>>({
        url: "sysUser/update",
        method: "post",
        data
    })
}

export function deleteTableDataApi(id: number) {
    return request<ApiResponseData<any>>({
        url: "sysUser/delete",
        method: "post",
        data: {id},
        contentType: "application/x-www-form-urlencoded"
    })
}

export function getUserRoleApi() {
    return request<ApiResponseData<any>>({
        url: "sysUserRole/getUserRole",
        method: "get"
    })
}