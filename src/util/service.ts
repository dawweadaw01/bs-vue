import axios, {type AxiosInstance, type AxiosRequestConfig} from "axios"
import {useUserStoreHook} from "@/store/modules/user"
import {ElMessage} from "element-plus"
import {get, merge} from "lodash-es"
import {getToken} from "./cache/cookies"

/** 退出登录并强制刷新页面（会重定向到登录页） */
function logout() {
    useUserStoreHook().logout()
    location.reload()
}

/** 创建请求实例 */
function createService() {
    // 创建一个 axios 实例命名为 service
    const service = axios.create()
    // 请求拦截
    service.interceptors.request.use(
        (config: any) => config,
        // 发送失败
        (error: any) => Promise.reject(error)
    )
    // 响应拦截（可根据具体业务作出相应的调整）
    service.interceptors.response.use(
        (response: any) => {
            // apiData 是 api 返回的数据
            const apiData = response.data
            // 二进制数据则直接返回
            const responseType = response.request?.responseType
            if (responseType === "blob" || responseType === "arraybuffer") return apiData
            // 这个 code 是和后端约定的业务 code
            const code = apiData.code
            // 如果没有 code, 代表这不是项目后端开发的 api
            if (code === undefined) {
                ElMessage.error("非本系统的接口")
                return Promise.reject(new Error("非本系统的接口"))
            }
            switch (code) {
                case 200:
                    // 本系统采用 code === 0 来表示没有业务错误
                    return apiData
                case 401:
                    // Token 过期时
                    ElMessage.error("登录过期，请重新登录")
                    return ;
                    //return logout()
                default:
                    // 不是正确的 code
                    ElMessage.error(apiData.msg || "Error")
                    throw new Error(apiData.msg || "Error")
            }
        },
        (error: any) => {
            // status 是 HTTP 状态码
            const status = get(error, "response.status")
            switch (status) {
                case 400:
                    error.message = "请求错误"
                    break
                case 401:
                    // Token 过期时
                    logout()
                    break
                case 403:
                    error.message = "拒绝访问"
                    break
                case 404:
                    error.message = "请求地址出错"
                    break
                case 408:
                    error.message = "请求超时"
                    break
                case 500:
                    error.message = "服务器内部错误"
                    break
                case 501:
                    error.message = "服务未实现"
                    break
                case 502:
                    error.message = "网关错误"
                    break
                case 503:
                    error.message = "服务不可用"
                    break
                case 504:
                    error.message = "网关超时"
                    break
                case 505:
                    error.message = "HTTP 版本不受支持"
                    break
                default:
                    break
            }
            ElMessage.error(error.message)
            return Promise.reject(error)
        }
    )
    return service
}

/** 创建请求方法 */
// function createRequest(service: AxiosInstance) {
//     return function <T>(config: AxiosRequestConfig): Promise<T> {
//         let token = getToken()
//         // 引入userStore
//         if(!token) {
//             token = useUserStoreHook().token.valueOf()
//         }
//         const defaultConfig = {
//             headers: {
//                 // 携带 Token
//                 token: token ? `${token}` : undefined,
//                 "Content-Type": "application/json"
//             },
//             timeout: 5000,
//             baseURL: import.meta.env.VITE_BASE_API,
//             data: {}
//         }
//         // 将默认配置 defaultConfig 和传入的自定义配置 config 进行合并成为 mergeConfig
//         const mergeConfig = merge(defaultConfig, config)
//         console.log(mergeConfig)
//         return service(mergeConfig)
//     }
// }
function createRequest(service: AxiosInstance) {
    return function <T>(config: AxiosRequestConfig & { contentType?: string }): Promise<T> {
        let token = getToken();
        if (!token) {
            token = useUserStoreHook().token.valueOf();
        }

        // 设置默认请求头
        const headers = {
            token: token ? `${token}` : undefined,
            "Content-Type": config.contentType || "application/json",
        };

        if (config.contentType === 'application/x-www-form-urlencoded') {
            config.transformRequest = [(data) => {
                return Object.keys(data)
                    .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
                    .join('&');
            }];
        }

        // 默认配置
        const defaultConfig: AxiosRequestConfig = {
            headers,
            timeout: 5000,
            baseURL: import.meta.env.VITE_BASE_API,
        };

        // 合并配置
        const mergeConfig = merge(defaultConfig, config);
        delete mergeConfig.contentType; // 移除自定义的 contentType 属性
        return service(mergeConfig);
    }
}

/** 用于网络请求的实例 */
const service = createService()
/** 用于网络请求的方法 */
export const request = createRequest(service)
