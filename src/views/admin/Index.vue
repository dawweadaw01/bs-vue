<script setup lang="ts">
import {onMounted, ref} from "vue";
import type {Shop} from "@/api/shop/types/shop";
import {getShopInfoApi, updateShopInfoApi} from "@/api/shop";
import {ElMessage, type UploadProps, type UploadUserFile} from "element-plus";
import {deleteShopImage, UploadImage, uploadShopImage} from "@/api/image";

const shopInfo = ref<Shop>({
  cover: "", ownerId: 0, status: 0,
  id: 0,
  name: "",
  logo: "",
  address: "",
  phoneNumber: "",
  offDay: ""
})

const updateShopInfo = () => {
  updateShopInfoApi(shopInfo.value).then(() => {
    //弹窗
    ElMessage.success("更新成功")
  }).catch(() => {
    console.log("更新失败")
  })
}
const getShopInfo = () =>{
  getShopInfoApi().then(({data}) => {
    shopInfo.value = data
    fileList.value = data.shopImagesForManage.map((item) => {
      return {
        name: item.imageUrl,
        url: item.imageUrl,
        uid: item.id
      }
    })
    console.log(fileList.value)
  }).catch(() => {
    console.log("获取数据失败")
  })
}

onMounted(() => {
  getShopInfo()
})

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
const fileList = ref<UploadUserFile[]>([])
const dialogImageUrl = ref<string>("")
const dialogImage = ref<boolean>(false)
const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!
  dialogImage.value = true
}
const handleRemove: UploadProps['onRemove'] = (uploadFile) => {
  deleteShopImage(uploadFile.uid).then(({data}) => {
    if (data.code==200){
      ElMessage.success("删除成功")
    }else {
      ElMessage.error("删除失败")
    }
  })
}
const handleImageChange: UploadProps['onChange'] = (uploadFile) => {
  const formData = new FormData()
  formData.append("file", uploadFile.raw as Blob)
  uploadShopImage(formData)
}
</script>

<template>
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
    <el-form-item label="店铺状态">
      <el-select v-model="shopInfo.status" placeholder="请选择店铺状态">
        <el-option label="开启" :value="1"></el-option>
        <el-option label="关闭" :value="0 "></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="店铺拥有人">
      <el-input disabled v-model="shopInfo.ownerId" placeholder="请输入店铺休息日"></el-input>
    </el-form-item>
    <el-form-item label="店铺logo">
      <el-upload
          v-model="shopInfo.logo"
          class="avatar-uploader"
          :show-file-list="false"
          :on-change="handleLogoImageChange"
          :auto-upload="false"
      >
        <img v-if="shopInfo.logo" :src="shopInfo.logo" class="avatar" alt="log" style="width: 250px"/>
        <el-icon v-else class="avatar-uploader-icon">
          <Plus/>
        </el-icon>
      </el-upload>
    </el-form-item>
    <el-form-item label="店铺封面">
      <el-upload
          v-model="shopInfo.cover"
          class="avatar-uploader"
          :show-file-list="false"
          :on-change="handleCoverImageChange"
          :auto-upload="false"
      >
        <img v-if="shopInfo.cover" :src="shopInfo.cover" class="avatar" alt="log" style="width: 250px"/>
        <el-icon v-else class="avatar-uploader-icon">
          <Plus/>
        </el-icon>
      </el-upload>
    </el-form-item>
    <el-form-item label="店铺图片">
      <el-upload
          v-model:file-list="fileList"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-change="handleImageChange"
          :auto-upload="false"
      >
        <el-icon>
          <Plus/>
        </el-icon>
      </el-upload>
      <el-dialog v-model="dialogImage">
        <img w-full :src="dialogImageUrl" alt="Preview Image" style="width: 100%"/>
      </el-dialog>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="updateShopInfo">提交</el-button>
    </el-form-item>
  </el-form>

</template>

<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}

.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
