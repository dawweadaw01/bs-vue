<script lang="ts" setup>

import {onMounted, ref, watch} from "vue";
import type {Shop} from "@/api/shop/types/shop";
import {usePagination} from "@/hooks/usePagination";
import {getShopListApi, getShopRecommendApi} from "@/api/shop";
import router from "@/router";

const {paginationData} = usePagination()
const shopList = ref<Shop[]>([])

const getTableData = () => {
  getShopRecommendApi().then(
      ({data}) => {
        shopList.value = data
      }
  ).catch(() => {
    shopList.value = []
    console.log("获取数据失败")
  })
}

onMounted(() => {
  getTableData()
})

const shopDetails = (id: number) => {
  router.push({
    path: '/shopDetails',
    query: {
      id: id
    }
  })
}

</script>

<template>
  <div class="main">
    <div class="shop">
      <el-card class="box-card">
        <el-row :gutter="20">
          <el-col :span="8" v-for="shop in shopList" :key="shop.id">
            <el-card class="box-card">
              <template #header>
                <div class="card-header">
                  <span @click="shopDetails(shop.id)">{{ shop.name }}</span>
                </div>
              </template>
              <div>
                <img :src="shop.logo" @click="shopDetails(shop.id)" class="image" alt="shop logo">
                <p>地址：{{ shop.address }}</p>
                <p>电话：{{ shop.phoneNumber }}</p>
                <p>休息日：{{ shop.offDay }}</p>
              </div>
              <template #footer>
                <el-button @click="shopDetails(shop.id)" type="primary" size="mini">查看详情</el-button>
              </template>
            </el-card>
          </el-col>
        </el-row>
      </el-card>
    </div>
  </div>
</template>

<style lang="scss" scoped>

.image {
  width: 100%
}

.box-card {
  border-radius: 10px;
  width: 100%;
}

.main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 20px;
  color: #333;
}

.shop {
  border-radius: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 5%;
  width: 50%;
}

</style>
