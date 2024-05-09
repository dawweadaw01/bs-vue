<script setup lang="ts" xmlns:el-col="http://www.w3.org/1999/html">
import {useUserStore} from "@/store/modules/user";
import {onMounted, ref} from "vue";
import type {appointment} from "@/api/appointment/types/appointment";
import {cancelAppointmentApi, getAppointmentListApi, updateAppointmentStatusApi} from "@/api/appointment";
import {usePagination} from "@/hooks/usePagination";
import type {TabsPaneContext} from "element-plus";
import shop from "@/views/shop/Shop.vue";
import router from "@/router";
import shopDetails from "@/views/shop/ShopDetails.vue";
const {paginationData, handleCurrentChange, handleSizeChange} = usePagination()
const userId = useUserStore().userId
const orderList = ref<appointment[]>([
  {
    id: 0,
    storeId: 0,
    appointmentTimeStr: "2024-5-10 14:00",
    orderStatus: 1,
    userId: 0,
    fixedPrice: 100,
  }
])
const orderStatus = ref<number>(2)

const getTableData = () => {
  getAppointmentListApi(
      {
        page: paginationData.currentPage,
        size: paginationData.pageSize,
        orderStatus: orderStatus.value
      }
  ).then(
      ({data}) => {
        orderList.value = data.records
        paginationData.total = data.total
        console.log(data)
      }
  ).catch(() => {
    console.log("获取数据失败")
  })
}

onMounted(() => {
  getTableData()
})

const whole = () => {
  orderStatus.value = 2
  getTableData()
}

const paid = () => {
  orderStatus.value = 1
  getTableData()
}

const unpaid = () => {
  orderStatus.value = 0
  getTableData()
}

const handleTabClick = (tab: TabsPaneContext) => {
  console.log(tab.index)
  switch (tab.index) {
    case '0':
      whole()
      break
    case '1':
      paid()
      break
    case '2':
      unpaid()
      break
  }
}
const pay = (item: appointment) => {
  window.open('http://localhost:8001/api/pay/pay?oid=' + item.id+ '&fixedPrice=' + item.fixedPrice + '&name=' + item.shops.name)
}

const shopDetailsFormOrder = (id?:number) => {
  router.push({
    path: '/shopDetails',
    query: {
      id: id
    }
  })
}

const cancel = (item: appointment) => {
  cancelAppointmentApi(item.id).then(
      () => {
        getTableData()
      }
  ).catch(() => {
    console.log("取消订单失败")
  })
}

</script>

<template>
  <div class="order-list">
    <el-card class="box-card">
      <el-tabs type="border-card" @tab-click="handleTabClick">
        <el-tab-pane label="全部"></el-tab-pane>
        <el-tab-pane label="已支付"></el-tab-pane>
        <el-tab-pane label="未支付"></el-tab-pane>
      </el-tabs>
      <el-row :gutter="20">
        <el-col :span="6" v-for="item in orderList" :key="item">
          <el-card class="box-card">
            <template #header>
              <div class="card-header">
                <span @click="shopDetailsFormOrder(item.shops?.id)">{{item.shops?.name}}</span>
              </div>
            </template>
            <div>
              <p>订单号：{{item.id}}</p>
              <p>订单金额：{{item.fixedPrice}}</p>
              <p>订单状态：
                <span v-if="item.orderStatus === 1">已支付</span>
                <span v-else-if="item.orderStatus===0">未支付</span>
                <span v-else>已取消</span>
              </p>
              <p>预约时间：{{item.appointmentTimeStr}}</p>
            </div>
            <template #footer>
              <el-button type="primary" size="mini" @click="orderInfo(item)">查看详情</el-button>
              <el-button v-if="item.orderStatus===0" type="success" size="mini" @click="pay(item)">去支付</el-button>
              <el-button v-if="item.orderStatus===0" type="info" size="mini" @click="cancel(item)">取消订单</el-button>
            </template>
          </el-card>
        </el-col>
      </el-row>
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
    </el-card>
  </div>
</template>

<style scoped>
.pager-wrapper{
  display: flex;
  justify-content: flex-end;
  margin-top: 50px;
}

.order-list{
  display: flex;
  flex-direction: column;
  border-radius: 10px;

}

</style>
