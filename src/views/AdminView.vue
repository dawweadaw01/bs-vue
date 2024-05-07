<script lang="ts" setup>
import {ref} from 'vue'
import {Document, Location, Menu as IconMenu, UserFilled} from '@element-plus/icons-vue'
import {useUserStore} from "@/store/modules/user";
import {useRouter} from "vue-router";
import {checkPermission} from "@/util/permission";


const isCollapse = ref(false)
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const userStore = useUserStore()
const router = useRouter()

const logout = () => {
  userStore.logout()
  router.push("/")
}
const index = () => {
  router.push("/")
}
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-header height="100px">
        <div class="title">
          <img src="@/assets/layouts/cat.jpg" alt="logo">
          <h1>后台管理</h1>
        </div>
        <el-dropdown class="right-menu-item">
          <div class="right-menu-avatar">
            <el-avatar :icon="UserFilled" :size="30"/>
            <span>&nbsp admin</span>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item divided @click="index">
                <span style="display: block">主页</span>
              </el-dropdown-item>
              <el-dropdown-item divided @click="logout">
                <span style="display: block">退出登录</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-radio-group v-model="isCollapse" style="margin-bottom: 1px">
            <el-radio-button :value="false">展开</el-radio-button>
            <el-radio-button :value="true">收缩</el-radio-button>
          </el-radio-group>
          <el-menu
              default-active="/admin/index"
              class="el-menu-vertical-demo"
              :collapse="isCollapse"
              @open="handleOpen"
              @close="handleClose"
              router="router"
          >
            <el-menu-item index="/admin/index" v-if="checkPermission(['shop'])">
              <el-icon>
                <location/>
              </el-icon>
              <template #title>商家基本信息</template>
            </el-menu-item>
            <el-menu-item index="/admin/user" v-if="checkPermission(['super-admin'])">
              <el-icon>
                <UserFilled/>
              </el-icon>
              <template #title>用户管理</template>
            </el-menu-item>
            <el-sub-menu v-if="checkPermission(['super-admin'])">
              <template #title>
                <el-icon>
                  <Menu/>
                </el-icon>
                <span>角色权限管理</span>
              </template>
              <el-menu-item index="/admin/role">角色管理</el-menu-item>
              <el-menu-item index="/admin/permission">权限管理</el-menu-item>
            </el-sub-menu>
            <el-menu-item index="/admin/cat" v-if="checkPermission(['super-admin'])">
              <el-icon>
                <icon-menu/>
              </el-icon>
              <template #title>猫咪种类管理</template>
            </el-menu-item>
            <el-menu-item index="/admin/shopCat" v-if="checkPermission(['shop'])">
              <el-icon>
                <document/>
              </el-icon>
              <template #title>商家猫咪管理</template>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main>
          <RouterView/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped>
/* 调整整体布局的背景和字体 */
.common-layout {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
  background: #f0f2f5; /* 给予一个轻微的灰色背景 */
}



/* 顶部栏的样式 */
.el-header {
  background-color: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1); /* 添加阴影效果 */
  padding: 0 20px; /* 增加左右的内边距 */
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 标题和 Logo 的样式 */
.title {
  display: flex;
  flex-direction: row;
  align-items: center;

  h1 {
    font-size: 24px;
    color: #606266;
    margin-left: 12px;
  }

  img {
    border-radius: 50%; /* 圆角 */
    height: 60px; /* Logo 的大小 */
    width: 60px; /* 保持 Logo 的宽高一致 */
    object-fit: cover; /* 保持图片比例 */
  }
}

/* 右上角下拉菜单样式 */
.right-menu {
  margin-right: 10px;
  height: 100%;
  display: flex;
  align-items: center;
  color: #606266;

  .right-menu-item {
    padding: 0 10px;
    cursor: pointer;

    .right-menu-avatar {
      display: flex;
      align-items: center;

      .el-avatar {
        margin-right: 10px;
      }
    }
  }
}

/* 侧边栏样式 */
.el-aside {
  background-color: #fff;

  .el-menu-vertical-demo {
    border-right: none; /* 去除边框 */
  }

  /* 菜单收缩展开按钮样式 */

  .el-radio-group {
    padding: 10px;
    background: #f4f4f4;
    border-radius: 4px;
  }
}

/* 主要内容区域样式 */
.el-main {
  background-color: #fff;
  padding: 20px; /* 内边距 */
  margin: 20px; /* 与侧边栏的间隔 */
  border-radius: 4px; /* 圆角 */
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1); /* 添加阴影效果 */
}

/* 菜单项样式 */
.el-menu-item {
  &:hover {
    background-color: #eef1f6; /* 鼠标悬浮背景颜色 */
  }
}

/* 子菜单标题样式 */
.el-sub-menu__title {
  font-size: 14px;
  color: #606266;
}

.title {
  display: flex;
  margin-left: 2%;
  height: 60px;

  h1 {
    margin-left: 20px;
  }

  img {
    border-radius: 50%;
    height: 100%;
  }
}

</style>
