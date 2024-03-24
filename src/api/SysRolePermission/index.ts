import {request} from "@/util/service";
import type {
    PermissionListRequestData,
    roleListRequestData,
    sysPermission,
    sysRoles
} from "@/api/SysRolePermission/types/sysRolePermission";

export function getUserRolesByUserIdApi(id: number) {
    return request<ApiResponseData<any>>({
        url: "sysUserRole/getByUserFormManager?userId=" + id,
        method: "get"
    })
}

export function deleteUserRolesApi(userRoleId: number) {
    return request<ApiResponseData<any>>({
        url: "sysUserRole/delete",
        method: "post",
        data: {userRoleId},
        contentType: "application/x-www-form-urlencoded"
    })
}

export function addUserRolesApi(userId: number, roleId: number) {
    return request<ApiResponseData<any>>({
        url: "sysUserRole/insert",
        method: "post",
        data: {userId, roleId}
    })
}

export function getRoleListApi(data: roleListRequestData) {
    return request<ApiResponseData<any>>({
        url: "sysRole/getRoleBySearch",
        method: "post",
        data
    })
}

export function updateRoleDataApi(data: sysRoles) {
    return request<ApiResponseData<any>>({
        url: "sysRole/update",
        method: "post",
        data
    })
}

export function deleteRoleApi(id: number) {
    return request<ApiResponseData<any>>({
        url: "sysRole/delete",
        method: "post",
        data: {id},
        contentType: "application/x-www-form-urlencoded"
    })
}

export function getAllRolesApi() {
    return request<ApiResponseData<any>>({
        url: "sysRole/list",
        method: "get"
    })
}

export function addRoleDataApi(data: sysRoles) {
    return request<ApiResponseData<any>>({
        url: "sysRole/insert",
        method: "post",
        data
    })
}

export function getPermissionListApi(roleId: number) {
    return request<ApiResponseData<any>>({
        url: "sysRolePermission/getPermissionListForManager",
        method: "post",
        data: {roleId},
        contentType: "application/x-www-form-urlencoded"
    })
}

export function deleteRolePermissionApi(rolePermissionId: number) {
    return request<ApiResponseData<any>>({
        url: "sysRolePermission/delete",
        method: "post",
        data: {rolePermissionId},
        contentType: "application/x-www-form-urlencoded"
    })
}

export function getAllPermissionApi() {
    return request<ApiResponseData<any>>({
        url: "sysPermission/list",
        method: "get"
    })
}

export function addRolePermissionApi(roleId: number, permissionId: number) {
    return request<ApiResponseData<any>>({
        url: "sysRolePermission/insert",
        method: "post",
        data: {roleId, permissionId}
    })
}

export function getPermissionsApi(data: PermissionListRequestData) {
    return request<ApiResponseData<any>>({
        url: "sysPermission/getPermissionBySearch",
        method: "post",
        data
    })
}

export function addPermissionDataApi(data: sysPermission) {
    return request<ApiResponseData<any>>({
        url: "sysPermission/insert",
        method: "post",
        data
    })
}

export function updatePermissionDataApi(data: sysPermission) {
    return request<ApiResponseData<any>>({
        url: "sysPermission/update",
        method: "post",
        data
    })
}

export function deletePermissionApi(permissionId: number) {
    return request<ApiResponseData<any>>({
        url: "sysPermission/delete",
        method: "post",
        data: {permissionId},
        contentType: "application/x-www-form-urlencoded"
    })
}
