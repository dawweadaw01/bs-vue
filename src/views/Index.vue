<script setup lang="ts">
import {ref} from "vue";
import {useUserStore} from '@/store/modules/user'
import LoginForm from '@/views/login/Login.vue';

const activeIndex = ref('home')
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const isLogin = () => {
  return !!useUserStore().token;

}
const input = ref('')

const isLoginFormVisible = ref(false);
const title = ref('');
const showLogin = () => {
  isLoginFormVisible.value = true;
  title.value = '登录';
  console.log(isLoginFormVisible.value)
};
const showReg = () => {
  isLoginFormVisible.value = true;
  title.value = '注册';
  console.log(isLoginFormVisible.value)
};

</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <el-menu
            :default-active="activeIndex"
            class="el-menu-demo"
            mode="horizontal"
            :ellipsis="false"
            @select="handleSelect"
            router
        >
          <div class="logo-container">
            <a href="/" target="_blank">
              <img class="img" src="@/assets/layouts/cat.jpg" alt="logo">
            </a>
          </div>
          <div class="search-container">
            <input
                type="text"
                placeholder="Search..."
                v-model="searchTerm"
            />
            <el-button>
              <img src="@/assets/icon/del.svg" style="height: 20px" alt="del">
            </el-button>

            <el-button>
              <img src="@/assets/icon/search.svg" style="height: 20px" alt="del">
            </el-button>
          </div>
          <div class="flex-grow">
            <el-menu-item index="index">首页</el-menu-item>
            <el-menu-item index="shop">店铺</el-menu-item>
            <el-menu-item index="catCategories">猫咪种类</el-menu-item>
          </div>
          <el-menu-item v-if="isLogin()" index="home" class="user-center">个人中心</el-menu-item>
          <div v-else class="user-center">
            <el-menu-item @click="showLogin" >
              登录
            </el-menu-item>
            <el-menu-item @click="showReg" >
              注册
            </el-menu-item>
          </div>
        </el-menu>
      </el-header>
      <el-main>
        <div>
          <RouterView/>
        </div>
      </el-main>
    </el-container>
    <LoginForm v-model="isLoginFormVisible" v-model:title="title"/>
  </div>
</template>

<style scoped>
.search-container {
  display: flex;
  align-items: center;
  width: 400px;
  height: 20px;
  margin-left: 10%;
  justify-content: space-between;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f5f4f1;
  margin-top: 10px;
}

input {
  flex: 1;
  height: 100%;
  padding: 0.5rem;
  margin-right: 0.5rem;
  border: none;
  outline: none;
  border-radius: 3px;
  background-color: #f5f4f1;
}

button {
  padding: 0.5rem 1rem;
  border: none;
  background-color: #fffefb;
  color: white;
  border-radius: 3px;
  cursor: pointer;
}

button:hover {
  background-color: #363636FF;
}
.user-center{
  display: flex;
  align-items: center;
}

.logo-container {
  margin-left: 10%;
  display: flex;
  justify-content: flex-start; /* Logo 靠左对齐 */
  height: 100%;

  .img {
    display: flex;
    border-radius: 50%;
    height: 100%;
  }
}

.el-header {
  display: flex;
  justify-content: center;
  width: 100%;
}

.el-menu-demo {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

/* 确保 .flex-grow 元素能够正确地居中其子项 */
.flex-grow {
  display: flex;
}

</style>
