<script setup lang="ts">
import {useUserStore} from "@/store/modules/user";

const userId = useUserStore().userId;


</script>

<template>
  <div class="order-list">
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="6" v-for="item in 10" :key="item">
          <el-card class="box-card">
            <template #header>
              <div class="card-header">
                <span>Card name</span>
              </div>
            </template>
            <div>
              <p>订单号：{{userId}}</p>
              <p>订单金额：100</p>
              <p>订单状态：已完成</p>
            </div>
            <template #footer>Footer content</template>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<style scoped>


.order-list{
  display: flex;
  flex-direction: column;
  border-radius: 10px;

}

</style>