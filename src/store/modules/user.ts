import {ref} from "vue"
import store from "@/store"
import {defineStore} from "pinia"
import {getToken, removeToken, setToken} from "@/util/cache/cookies"
import {resetRouter} from "@/router"
import type {LoginRequestData} from "@/api/login/types/login";
import {getUserInfoApi, getUserRoleApi, loginApi, phoneLoginApi, regApi} from "@/api/login";

export const useUserStore = defineStore("user", () => {
        // 开启持久化存储
        const token = ref<string>(getToken() || "")
        const roles = ref<string[]>([])
        const username = ref<string>("")
        const userAvatar = ref<string>("")
        const userId = ref<number>(0)
        const autograph = ref<string>("")

        /** 登录 */
        const login = async ({name, pwd}: LoginRequestData) => {
            const responseData = await loginApi({name, pwd})
            setToken(responseData.data.token, responseData.data.expire)
            token.value = responseData.data.token
            const {data} = await getUserInfoApi()
            username.value = data.username
            userAvatar.value = data.avatar
            userId.value = data.id
            autograph.value = data.autograph
        }
        const reg = async ({name, pwd}: LoginRequestData) => {
            const responseData = await regApi({
                username: name,
                password: pwd
            })
            setToken(responseData.data.token, responseData.data.expire)
            token.value = responseData.data.token
        }

        const phoneLogin = async ({phone, code}: LoginRequestData) => {
            const responseData = await phoneLoginApi({name: "", pwd: "", phone, code})
            setToken(responseData.data.token, responseData.data.expire)
            token.value = responseData.data.token
            const {data} = await getUserInfoApi()
            username.value = data.username
            userAvatar.value = data.avatar
            userId.value = data.id
            autograph.value = data.autograph
        }


        /** 获取用户详情 */
        const getRole = async () => {
            const {data} = await getUserRoleApi()
            console.log(data)
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

        const getUserName = () => {
            return username.value
        }

        return {
            token,
            roles,
            username,
            userAvatar,
            userId,
            autograph,
            getUserName,
            login,
            logout,
            resetToken,
            getRole,
            reg,
            phoneLogin
        }
    },
    {
        persist: {
            enabled: true,
            // If you want to change the storage key
            strategies: [{
                storage: window.localStorage, // 使用 localStorage 或 sessionStorage
                paths: ['token', 'roles', 'username', 'userAvatar', 'userId','autograph'] // 列出需要持久化的状态
            }]
        }
    })

/** 在 setup 外使用 */
export function useUserStoreHook() {
    return useUserStore(store)
}
