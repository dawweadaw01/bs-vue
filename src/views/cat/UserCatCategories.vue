<script lang="ts" setup>

import {ref, watch} from "vue";
import type {Shop} from "@/api/shop/types/shop";
import {usePagination} from "@/hooks/usePagination";
import router from "@/router";
import {getCatCategoriesApi} from "@/api/cat";
import type {CatCategories} from "@/api/cat/types/cat";
import shop from "@/views/shop/Shop.vue";
import shopDetails from "@/views/shop/ShopDetails.vue";

const {paginationData, handleCurrentChange, handleSizeChange} = usePagination()
const tableData = ref<CatCategories[]>([])
const imgList = ref<string[]>([])
const getTableData = () => {
  getCatCategoriesApi({
    page: paginationData.currentPage,
    size: paginationData.pageSize,
  }).then(
      ({data}) => {
        paginationData.total = data.total
        tableData.value = data.records
      }
  ).catch(() => {
    tableData.value = []
    console.log("获取数据失败")
  })
}

const catCategoriesInfo = (row: CatCategories) => {
  imgList.value = row.images.map(item => item.imageUrl)
}

watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, {immediate: true})
</script>

<template>
  <div class="main">
    <div class="shop">
      <el-card class="box-card">
        <el-row :gutter="20">
          <el-col :span="8" v-for="item in tableData">
            <el-card class="box-card">
              <template #header>
                <div class="card-header">
                  <span @click="catCategoriesInfo(item)">{{ item.name }}</span>
                </div>
              </template>
              <div>
                <el-image
                    @click="catCategoriesInfo(item)"
                    style="width: 300px; height: 300px"
                    :src="item.images[0].imageUrl"
                    :zoom-rate="1.2"
                    :max-scale="7"
                    :min-scale="0.2"
                    :preview-src-list="imgList"
                    :initial-index="0"
                    fit="cover"
                />
                <p>来自于：{{ item.origin }}</p>
                <p>描述：{{ item.description }}</p>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-card>
    </div>
    <div class="pager-wrapper">
      <el-pagination
          background
          :layout="paginationData.layout"
          :page-sizes="paginationData.pageSizes"
          :total="paginationData.total"
          :page-size="paginationData.pageSize"
          :currentPage="paginationData.currentPage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
      />
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
