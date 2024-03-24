<script setup lang="ts">

</script>

<template>
  <div>
    <router-link to="/" class="logo">
      <el-button>首页</el-button>
    </router-link>
    <router-link to="/home" class="logo">
      <el-button>个人主页</el-button>
    </router-link>
    <div>
      <router-view></router-view>
    </div>
  </div>
</template>

<style scoped>

</style>