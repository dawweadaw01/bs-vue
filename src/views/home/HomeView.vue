<script setup lang="ts">
import router from '@/router';
import {type TabsPaneContext} from "element-plus";
import {useUserStore} from "@/store/modules/user";


const setting = () => {
  // 弹窗
  router.push('/setting')
}

const userStore = useUserStore()

console.log("a"+userStore.userAvatar);
console.log(useUserStore().autograph)
const handleClick = (tab: TabsPaneContext, event: Event) => {
  router.push("/" + tab.props.name);
}

</script>

<template>
  <div class="common-layout">
    <el-container>
      <div class="header">
        <el-header>
          <div class="avatar">
            <el-avatar :size="100" :src="useUserStore().userAvatar"></el-avatar>
            <span class="username">{{useUserStore().username}}</span>
            <el-button class="usersetting" @click="setting">账号设置</el-button>
          </div>
          <div class="div-autograph">
            <span class="autograph" v-if="useUserStore().autograph">{{ useUserStore().autograph }}</span>
            <span class="autograph" v-else>输入你的个性签名</span>
          </div>
        </el-header>
      </div>
      <el-main>
        <el-tabs class="home-tabs" @tab-click="handleClick">
          <el-tab-pane label="order" name="order"></el-tab-pane>
          <el-tab-pane label="collection" name="collection"></el-tab-pane>
        </el-tabs>
        <div>
          <RouterView/>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<style scoped>


.usersetting {

  float: right;

  &:hover {
    color: #409EFF;
  }
}

.div-autograph {
  margin-top: 1%;
  margin-left: 1%;
}

.autograph {
  font-size: large;
  color: #a7a7ab;
}


.user {
  font-family: "JetBrains Mono", monospace;
}

.el-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-items: center;
  background-color: white;
}

.username {
  font-size: 40px;
  margin-bottom: 200px;
  margin-left: 1%;
  color: black;

}

.avatar {
  margin-top: 20px;
}

.header {
  border-radius: 10px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-items: center;
  background: linear-gradient(to bottom, black, whitesmoke);


}

.el-main {
  width: 80%;
  margin-top: 2%;
}

.el-header {
  display: flex;
  flex-direction: column;
  margin-top: 5%;
  color: #fff;
  width: 80%;
  height: 200px;
}

.common-layout {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-items: center;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
  background: #f0f2f5; /* 给予一个轻微的灰色背景 */
  width: 100%;
}

</style>
