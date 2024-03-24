<script lang="ts" setup>
import {ref} from 'vue'
import {Document, Location, Menu as IconMenu, UserFilled} from '@element-plus/icons-vue'
import {useUserStore} from "@/store/modules/user";
import {useRouter} from "vue-router";
import {checkPermission} from "@/util/permission";


const isCollapse = ref(true)
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
            <span>admin</span>
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
            <el-menu-item index="/admin/index">
              <el-icon>
                <location/>
              </el-icon>
              <template #title>主页</template>
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
            <el-menu-item index="4" ref="dis">
              <el-icon>
                <document/>
              </el-icon>
              <template #title>Navigator Three</template>
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

.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* 其他样式 */
}

.right-menu-item {
  display: flex;
  align-items: center;
  /* 如果需要的话，可以添加右边距 */
  margin-right: 20px;
}


router-link {
  color: black;
  text-decoration: none;
}

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

      span {
        font-size: 16px;
      }
    }
  }
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
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