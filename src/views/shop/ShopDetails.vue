<script setup lang="ts">

import {onMounted, type Ref, ref} from "vue";
import {useRoute} from "vue-router";
import type {Shop} from "@/api/shop/types/shop";
import {getShopDetailsApi} from "@/api/shop";
import '../../bootstrap3/css/bootstrap.css'
import '../../bootstrap3/css/font-awesome.css'
import '../../assets/css/gsdk.css'
import '../../assets/css/demo.css'
import type {CatInfo} from "@/api/cat/types/cat";
import {getCatByShopIdApi} from "@/api/cat";
import type {appointment} from "@/api/appointment/types/appointment";
import {addAppointmentApi} from "@/api/appointment";
import {ElMessage} from "element-plus";

const loading = ref<boolean>(false)
const dialog = ref<boolean>(false)
const route = useRoute()
const shop_id: Ref<number | undefined> = ref<number>()
const shopDetails = ref<Shop>({
  fixedPrice: 0,
  cover: "", ownerId: 0, status: 0,
  id: 0,
  name: "",
  logo: "",
  address: "",
  phoneNumber: "",
  offDay: ""
})
const dialogCatImg = ref<boolean>(false)
const catInfoList = ref<CatInfo[]>([])
const catImgList = ref<string[]>([])
const appointmentInfo = ref<appointment>({
  storeId: 0,
  appointmentTimeStr: 0
})
// 生命周期开始时调用
onMounted(() => {
  if (route.query.id) {
    console.log("获取到id")
    console.log(route.query.id)
    shop_id.value = Number(route.query.id)
    appointmentInfo.value.storeId = shop_id.value
  } else {
    console.log("没有获取到id")
  }
  getShopDetailsApi(typeof shop_id.value === "number" ? shop_id.value : 0).then(
      ({data}) => {
        shopDetails.value = data
        console.log(shopDetails.value)
      }
  ).catch(() => {
    console.log("获取数据失败")
  })
})
const appointmentDialog = ref<boolean>(false)
const appointment = () => {
  appointmentDialog.value = true
}


const catInfo = () => {
  dialog.value = true
  loading.value = true
  getCatByShopIdApi(shopDetails.value.id).then(
      ({data}) => {
        catInfoList.value = data
        console.log(catInfoList.value)
      }
  ).catch(() => {
    console.log("获取数据失败")
  }).finally(() => {
    loading.value = false
  })
}

const checkImg = (row: CatInfo) => {
  dialog.value = false
  dialogCatImg.value = true
  for (const img of row.images) {
    catImgList.value.push(img.imageUrl)
  }
  console.log(catImgList.value)
}
const resetImg = () => {
  dialog.value = true
  dialogCatImg.value = false
  catImgList.value = []
}

const appointmentTime = ref('')
const HandelAppointment = () => {
  //转换为时间戳
  appointmentInfo.value.appointmentTimeStr = new Date(appointmentTime.value).getTime();
  appointmentInfo.value.fixedPrice = shopDetails.value.fixedPrice
  addAppointmentApi(appointmentInfo.value).then((data) => {
    if (data.code== 200) {
      ElMessage.success("预约成功")
      appointmentDialog.value = false
      window.open('http://localhost:8001/api/pay/pay?oid=' + data.data.id+ '&fixedPrice=' + shopDetails.value.fixedPrice + '&name=' + shopDetails.value.name)
    }
  }).catch(() => {
    ElMessage.error("预约失败")
  })
}

</script>

<template>
  <div class="blurred-container">
    <div class="img-src" :style="{backgroundImage: 'url(' + shopDetails.cover + ')'}"></div>
  </div>
  <div class="main">
    <div class="container tim-container" style="padding-top:100px">
      <div class="row">
        <div class="col-md-4 text-center"><img :src="shopDetails.logo" alt="logo" style="width: 250px"></div>
        <div class="col-md-8 text-center"><h1 class="text-center">{{ shopDetails.name }}</h1></div>
      </div>
    </div> <!-- end extras -->

    <div class="container tim-container" style="padding-top:50px">
      <h3 class="text-pink">shop images</h3>
      <div class="row">
        <div class="col-md-4 img-store" v-for="shopImg in shopDetails.shopImages"><img :src="shopImg" class="img-rounded img-responsive">
        </div>
      </div>
    </div>
    <!-- end shop images -->

    <div class="container tim-container" style="max-width:1000px; padding-top:50px">
      <h3 class="text-left text-pink">店铺信息</h3>
      <table class="tbl-store">
        <tr>
          <th>店铺名</th>
          <td>{{ shopDetails.name }}</td>
        </tr>
        <tr>
          <th>地址</th>
          <td>{{ shopDetails.address }}</td>
        </tr>
        <!--        <tr>-->
        <!--          <th>营业时间</th>-->
        <!--          <td>10:00 - 22:00</td>-->
        <!--        </tr>-->
        <tr>
          <th>休息日</th>
          <td>{{ shopDetails.offDay }}</td>
        </tr>
        <tr>
          <th>电话号码</th>
          <td>{{ shopDetails.phoneNumber }}</td>
        </tr>
        <tr>
          <th>预约</th>
          <td>
            <el-button @click="appointment" type="success" size="mini">预约</el-button>
          </td>
        </tr>
        <tr>
          <th>店铺猫咪</th>
          <td>
            <el-button @click="catInfo" type="success" size="mini">查看猫咪</el-button>
          </td>
        </tr>
      </table>
    </div><!-- end store info -->

    <div class="container tim-container" style="padding-top:50px">
      <h3 class="text-pink">cats images</h3>
      <div class="row">
        <div class="col-md-4 col-sm-6 img-cat" v-for="catImg in shopDetails.catImages">
          <img :src="catImg" class="img-circle img-responsive" alt="no-image">
        </div>
      </div>
    </div>

    <el-dialog
        v-model="dialog"
        :title="'猫咪信息'"
        width="30%"
    >
      <div class="table-wrapper">
        <el-table :data="catInfoList" max-height="500px" v-loading="loading">
          <el-table-column prop="name" label="名称" align="center"/>
          <el-table-column prop="age" label="年龄" align="center"/>
          <el-table-column prop="gender" label="性别" align="center"/>
          <el-table-column prop="preferences" label="喜好" align="center"/>
          <el-table-column prop="healthStatusCode" label="健康状态" align="center">
            <template #default="scope">
              <el-button v-if="scope.row.healthStatusCode === 0" link type="success" size="large">健康</el-button>
              <el-button v-else-if="scope.row.healthStatusCode === 1" link type="warning" size="large">生病</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="availableForAdoption" label="是否领养" align="center">
            <template #default="scope">
              <el-button v-if="!scope.row.availableForAdoption" link type="success" size="large">可领养</el-button>
              <el-button v-else link type="warning" size="large">不可领养</el-button>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="Operations" width="150" align="center">
            <template #default="scope">
              <el-button link type="primary" size="large" @click="checkImg(scope.row)">查看图片</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>

    <el-dialog
        v-model="dialogCatImg"
        :title="'图片信息'"
        @closed="resetImg"
        width="20%"
    >
      <el-image
          v-for="(img,index) in catImgList"
          style="width: 100%"
          :src="img"
          :zoom-rate="1.2"
          :max-scale="7"
          :min-scale="0.2"
          :preview-src-list="catImgList"
          :initial-index="index"
          fit="cover"
      />
    </el-dialog>

    <el-dialog
        v-model="appointmentDialog"
        :title="'预约'"
        width="30%"
        style="text-align: center; border-radius: 15px; height:400px"
    >
      <!--      <div class="deposit">-->
      <!--        <span class="label">预约定金：</span>-->
      <!--        <span class="amount">{{ shopDetails.fixedPrice }}</span>-->
      <!--      </div>-->

      <div class="price">
        <span class="label-name">预约定金：</span>
        <span class="amount">￥{{ shopDetails.fixedPrice }}</span>
      </div>
      <br>
      <br>
      <div class="demo-datetime-picker">
        <div class="block">
          <span class="demonstration">预约时间</span>
          <el-date-picker
              v-model="appointmentTime"
              type="datetime"
              placeholder="选择时间"
          />
        </div>
      </div>
      <el-button type="primary" @click="HandelAppointment">预约</el-button>
    </el-dialog>
  </div>
</template>

<style scoped>

.demo-datetime-picker {
  display: flex;
  width: 100%;
  padding: 0;
  flex-wrap: wrap;
}
.demo-datetime-picker .block {
  padding: 30px 0;
  text-align: center;
  border-right: solid 1px var(--el-border-color);
  flex: 1;
}
.demo-datetime-picker .block:last-child {
  border-right: none;
}
.demo-datetime-picker .demonstration {
  display: block;
  color: var(--el-text-color-secondary);
  font-size: 20px;
  margin-bottom: 20px;
}

.label-name {
  color: red; /* 设置文字颜色 */
}

.amount {
  color: #ff0000; /* 设置金额颜色为红色 */
}

.price {
  font-size: 20px; /* 设置字体大小 */
}

</style>
