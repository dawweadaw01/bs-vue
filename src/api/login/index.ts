import {request} from "@/util/service";
import type * as Login from "./types/login"
import type {UpdateUserPhone, UpdateUserPwd} from "./types/login";

export function loginApi(data: Login.LoginRequestData) {
    return request<ApiResponseData<any>>({
        url: "sysUser/doLogin",
        method: "post",
        data
    })
}

export function regApi(data: Login.LoginRequestData) {
    return request<ApiResponseData<any>>({
        url: "sysUser/insert",
        method: "post",
        data
    })
}

export function phoneLoginApi(data: Login.LoginRequestData) {
    return request<ApiResponseData<any>>({
        url: "sysUser/doLoginByPhoneCode",
        method: "post",
        data: {
            phoneNum: data.phone,
            code: data.code
        }
    })
}

export function sendCodeApi(data: Login.SendCodeRequestData) {
    console.log(data)
    return request<ApiResponseData<any>>({
        url: "sysUser/sendCode",
        method: "post",
        data: {
            phoneNum: data,
            templateCode: "pub_verif_login"
        }
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

export function getUserInfoApi() {
    return request<ApiResponseData<any>>({
        url: "sysUser/getUser",
        method: "get"
    })
}

export function updateUserInfoApi(data: Login.UserInfo) {
    return request<ApiResponseData<any>>({
        url: "sysUser/update",
        method: "post",
        data
    })
}

export function updateUserPhoneApi(data: UpdateUserPhone) {
    return request<ApiResponseData<any>>({
        url: "sysUser/updatePhone",
        method: "post",
        data
    })
}
export function updateUserPwdApi(data: UpdateUserPwd) {
    return request<ApiResponseData<any>>({
        url: "sysUser/updatePwd",
        method: "post",
        data
    })
}