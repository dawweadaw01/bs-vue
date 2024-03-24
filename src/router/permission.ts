import router from "@/router"
import { useUserStoreHook } from "@/store/modules/user"
import { ElMessage } from "element-plus"
import { getToken } from "@/util/cache/cookies"
import NProgress from "nprogress"
import "nprogress/nprogress.css"
import isNeedLoginList from "@/config/white-list";

NProgress.configure({ showSpinner: false })

router.beforeEach(async (to, _from, next) => {
  NProgress.start()
  const userStore = useUserStoreHook()
  let token = getToken()
  if(token===undefined){
    token = userStore.token
  }
  //alert(userStore.token)
  console.log(userStore.token)
  // 如果没有登陆
  if (!token) {
    // 如果在免登录的白名单中，则直接进入
    if (!isNeedLoginList(to)) return next()
    // 其他没有访问权限的页面将被重定向到登录页面
    return next("/login")
  }

  // 如果已经登录，并准备进入 Login 页面，则重定向到主页
  if (to.path === "/login") {
    return next({ path: "/" })
  }
  console.log(userStore.roles.length)
  // 如果用户已经获得其权限角色
  if (userStore.roles.length !== 0) return next()

  // 否则要重新获取权限角色
  try {
    await userStore.getRole()
    const roles = userStore.roles
    console.log(roles);
    next()
  } catch (err: any) {
    // 过程中发生任何错误，都直接重置 Token，并重定向到登录页面
    userStore.resetToken()
    ElMessage.error(err.message || "路由守卫过程发生错误")
    next("/login")
  }
})

router.afterEach((to) => {
  NProgress.done()
})
