<script setup lang="ts">

import {onMounted, type Ref, ref} from "vue";
import {useRoute} from "vue-router";
import type {Shop} from "@/api/shop/types/shop";
import {getShopDetailsApi} from "@/api/shop";

const route = useRoute()
const shop_id: Ref<number | undefined> = ref<number>()
const shopDetails = ref<Shop>(
    {
      cover: "", ownerId: 0, status: 0,
      id: 0,
      name: "",
      logo: "",
      address: "",
      phoneNumber: "",
      offDay: ""
    }
)
// 生命周期开始时调用
onMounted(() => {
  console.log(route.query.id)
  if (route.query.id) {
    shop_id.value = Number(route.query.id)
  } else {
    console.log("没有获取到id")
  }
  getShopDetailsApi(typeof shop_id.value === "number" ? shop_id.value : 0).then(
      ({data}) => {
        console.log(data)
        shopDetails.value = data
      }
  ).catch(() => {
    console.log("获取数据失败")
  })
})

</script>

<template>
  <div class="blurred-container">
    <div class="img-src" :style="{backgroundImage: 'url(' + shopDetails.cover + ')'}"></div>
  </div>
  <div class="main">
    <div class="row">
      <el-image
          :src="shopDetails.logo"
          fit="cover"
      ></el-image>
      <div class="name">
        <h1 class="text-center">{{shopDetails.name}}</h1>
      </div>
    </div>
    <div class="info">
      test
    </div>
  </div>
</template>

<style scoped>

.info{
  margin-top: 2000px;
}

.name{
  margin-left: 200px;
}
.text-center{
  text-align: center;
}

h1 {
  display: block;
  font-size: 50px;
  margin-block-start: 0.67em;
  margin-block-end: 0.67em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  font-weight: bold;
  unicode-bidi: isolate;
}

.main {
  position: relative;
}

.main{
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}


.row{
  width: 50%;
  display: flex;
  justify-content: center;
  margin-top: 10px;
  z-index: 1;
}


.blurred-container {
  position: relative;
  width: 100%;
  height: 540px;
  top: 0;
  left: 0;
}

.blurred-container > .img-src {
  width: 100%;
  height: 540px;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
}


</style>
