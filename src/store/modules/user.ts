import {ref} from "vue"
import store from "@/store"
import {defineStore} from "pinia"
import {getToken, removeToken, setToken} from "@/util/cache/cookies"
import {resetRouter} from "@/router"
import type {LoginRequestData} from "@/api/login/types/login";
import {getUserRoleApi, loginApi} from "@/api/login";

export const useUserStore = defineStore("user", () => {
    const token = ref<string>(getToken() || "")
    const roles = ref<string[]>([])
    const username = ref<string>("")
    const userAvatar = ref<string>("")
    const userId = ref<number>(0)

    /** 登录 */
    const login = async ({name, pwd}: LoginRequestData) => {
        const responseData = await loginApi({name, pwd})
        setToken(responseData.data.token,responseData.data.expire)
        token.value = responseData.data.token
    }

    /** 获取用户详情 */
    const getRole = async () => {
        const {data} = await getUserRoleApi()
        roles.value = data
    }

    /** 登出 */
    const logout = () => {
        removeToken()
        token.value = ""
        roles.value = []
        resetRouter()
    }
    /** 重置 Token */
    const resetToken = () => {
        removeToken()
        token.value = ""
        roles.value = []
    }

    return {token, roles, username, login, logout, resetToken, getRole}
})

/** 在 setup 外使用 */
export function useUserStoreHook() {
    return useUserStore(store)
}
