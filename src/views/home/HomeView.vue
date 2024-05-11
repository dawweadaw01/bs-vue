<script setup lang="ts">
import router from '@/router';
import {ElMessage, type TabsPaneContext, type UploadProps} from "element-plus";
import {useUserStore} from "@/store/modules/user";
import {checkPermission} from "@/util/permission";
import {ref} from "vue";
import type {Shop} from "@/api/shop/types/shop";
import {UploadImage} from "@/api/image";
import {insertShopInfoApi} from "@/api/shop";


const setting = () => {
  // 弹窗
  router.push('/setting')
}

const userStore = useUserStore()

console.log("a" + userStore.userAvatar);
console.log(useUserStore().autograph)
const handleClick = (tab: TabsPaneContext, event: Event) => {
  router.push("/" + tab.props.name);
}

const logout = () => {
  userStore.logout()
  router.push("/")
}

const admin = () => {
  router.push("/admin")
}

const dialog = ref(false)

const beginShop = () => {
  dialog.value = true
}

const shopInfo = ref<Shop>({
  fixedPrice: 0,
  cover: "", ownerId: 0, status: 0,
  id: 0,
  name: "",
  logo: "",
  address: "",
  phoneNumber: "",
  offDay: ""
})
const handleCoverImageChange: UploadProps['onChange'] = (uploadFile) => {
  const formData = new FormData()
  formData.append("file", uploadFile.raw as Blob)
  UploadImage(formData).then((res) => {
    console.log(res)
    shopInfo.value.cover = res.data
  }).catch(() => {
    ElMessage.error("上传失败")
  })
}

const handleLogoImageChange: UploadProps['onChange'] = (uploadFile) => {
  const formData = new FormData()
  formData.append("file", uploadFile.raw as Blob)
  UploadImage(formData).then((res) => {
    console.log(res)
    shopInfo.value.logo = res.data
  }).catch(() => {
    ElMessage.error("上传失败")
  })
}

const insertShopInfo = () => {
  insertShopInfoApi(shopInfo.value).then(() => {
    ElMessage.success("添加成功")
    dialog.value = false
  }).catch(() => {
    console.log("添加失败")
  })
}

const resetForm = () => {
  shopInfo.value = {
    fixedPrice: 0,
    cover: "", ownerId: 0, status: 0,
    id: 0,
    name: "",
    logo: "",
    address: "",
    phoneNumber: "",
    offDay: ""
  }
}

</script>

<template>
  <div class="common-layout">
    <el-container>
      <div class="header">
        <el-header>
          <div class="avatar">
            <el-avatar :size="100" :src="useUserStore().userAvatar"></el-avatar>
            <span class="username">{{ useUserStore().username }}</span>
            <div class="usersetting">
              <el-button v-if="checkPermission(['super-admin','shop'])" @click="admin">后台管理</el-button>
              <el-button v-else @click="beginShop">成为商家</el-button>
              <el-button @click="logout">退出登录</el-button>
              <el-button @click="setting">账号设置</el-button>
            </div>
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
    <el-dialog
        v-model="dialog"
        :title="'修改角色'"
        @closed="resetForm"
        width="30%"
    >
      <el-form :model="shopInfo" label-width="auto" style="max-width: 600px">
        <el-form-item label="店铺名称">
          <el-input v-model="shopInfo.name" placeholder="请输入店铺名称"></el-input>
        </el-form-item>
        <el-form-item label="店铺地址">
          <el-input v-model="shopInfo.address" placeholder="请输入店铺地址"></el-input>
        </el-form-item>
        <el-form-item label="店铺电话">
          <el-input v-model="shopInfo.phoneNumber" placeholder="请输入店铺电话"></el-input>
        </el-form-item>
        <el-form-item label="店铺休息日">
          <el-input v-model="shopInfo.offDay" placeholder="请输入店铺休息日"></el-input>
        </el-form-item>
        <el-form-item label="预约定金">
          <el-input v-model="shopInfo.fixedPrice" placeholder="请输入金额" type="number" :min="0" :max="1000" step="0.01" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="insertShopInfo">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
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
