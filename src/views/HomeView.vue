<script setup lang="ts">
import router from '@/router';
import {ref} from 'vue';
import {getToken} from "@/util/cache/cookies";
import {ElMessage} from "element-plus";
import {useUserStoreHook} from "@/store/modules/user";

//
let activeIndex = router.currentRoute.value.path
const isActive = ref(true)
const hasError = ref(false)

const handleSelect = (key:any, keyPath:any) => {
  console.log(key, keyPath);
};
</script>

<template>
  <div class="main">
    <router-link to="/admin" class="logo">
      <el-button>后台管理</el-button>
    </router-link>
  </div>
  <div>
    <RouterView />
  </div>
</template>

<style scoped>
.el-main {
  position: absolute;
  height: 1000px;
  left: 0;
  right: 0;
  top: 80PX;
  bottom: 0;
  overflow-y: scroll;
}

.el-dropdown {
  vertical-align: top;
}

.el-dropdown + .el-dropdown {
  margin-left: 15px;
}

.el-icon-arrow-down {
  font-size: 12px;
}

.main {
  width: 100%;
  position: fixed;
}

.header {
  display: flex;
  flex-direction: row;
  height: 60px;
  border-bottom: 1px solid #e4e3e3; /* 分割线样式 */
}

.logo {
  width: 100px;
}

.search {
  margin-left: 10%;
  width: 60%;
}

.phone {
  margin-top: auto;
  margin-bottom: 20px;
  width: 10%;
}

.login {
  width: 100px;
}

.active {
  font-size: 100px;
}

.swiper {
  margin-top: 2%;
  width: 100%;
  height: 600px;
  background-color: #a6c1ee;
}

.medium {
  width: 100%;
  height: 600px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: aqua;
}

.fengmian {
  width: 100%;
  height: 100%;
}

.title {
  display: flex;
  flex-direction: column;
}

.el-menu--horizontal > .el-menu-item {
  border-bottom: none;
  text-decoration: none;
}

</style>
