/** 统一处理 Cookie */

import CacheKey from "@/constants/cache-key"
import Cookies from "js-cookie"

export const getToken = () => {
    if (Cookies.get(CacheKey.TOKEN) === undefined) {
        return Cookies.get("token")
    }
    return Cookies.get(CacheKey.TOKEN)
}
export const setToken = (token: string,expire:number) => {
    Cookies.set(CacheKey.TOKEN, token,{ expires: expire })
    Cookies.set("token", token,{ expires: expire })
}
export const removeToken = () => {
    Cookies.remove(CacheKey.TOKEN)
    Cookies.remove("token")
}
