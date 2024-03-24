import {type RouteLocationNormalized} from "vue-router";

/** 免登录白名单（匹配路由 path） */
const NeedLoginListByPath: string[] = ["/admin"];

/** 免登录白名单（匹配路由 name） */
const whiteListByName: string[] = ["admin"];

/** 判断是否在白名单 */
const isNeedLoginList = (to: RouteLocationNormalized): boolean => {
    // 检查 path 是否匹配白名单（包含匹配）
    const pathMatch = NeedLoginListByPath.some(whitePath => to.path.includes(whitePath));
    // 检查 name 是否匹配白名单（包含匹配）
    const nameMatch = typeof to.name === 'string' && whiteListByName.some(whiteName => to.name?.toString().includes(whiteName));
    // path 和 name 任意一个匹配上即可
    return pathMatch || nameMatch;
};

export default isNeedLoginList;
