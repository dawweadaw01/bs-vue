<script setup lang="ts">

import {onMounted, ref, watch} from "vue";
import {usePagination} from "@/hooks/usePagination";
import {ElMessage, ElMessageBox, type UploadProps, type UploadUserFile} from "element-plus";
import {CirclePlus, RefreshRight} from "@element-plus/icons-vue"
import {cloneDeep} from "lodash-es";
import type {CatCategories, CatInfo} from "@/api/cat/types/cat";
import {addCatDataApi, deleteCatApi, deleteCatCategoriesApi, getCatBySearchApi, getCatCategoriesApi} from "@/api/cat";
import type {image} from "@/api/image/types";
import {deleteShopCatImage, uploadShopCatImage} from "@/api/image";
import {updateCatDataApi} from "@/api/shop";

const loading = ref<boolean>(false)
const {paginationData, handleCurrentChange, handleSizeChange} = usePagination()
onMounted(() => {
  getCatCategoriesApi(
      {
        page: 1,
        size: 100
      }
  ).then(
      ({data}) => {
        catCategoriesList.value = data.records
        console.log(catCategoriesList.value)
      }
  ).catch(() => {
    console.log("获取数据失败")
  })
})

const tableData = ref<CatInfo[]>([])
const ImageData = ref<image[]>([])
const fileList = ref<UploadUserFile[]>([])
const dialogVisible = ref<boolean>(false)
const dialog = ref<boolean>(false)
const DEFAULT_FORM_DATA: CatInfo = {
  catId: 0,
  categoryId: 0,
  catCategories: {
    categoryId: 0,
    name: "",
    description: "",
    origin: ""
  },
  name: "",
  age: 0,
  gender: "",
  preferences: "",
  healthStatus: "",
  availableForAdoption: false,
  healthStatusCode: 0,
  shopId: 0,
  images: []
}
const catId = ref<number>(0)

const DEFAULT_IMAGE_DATA: image = {
  imageId: 0,
  imageUrl: "",
  id: 0,
  description: ""
}
const formData = ref<CatInfo>(cloneDeep(DEFAULT_FORM_DATA))

const getTableData = () => {
  loading.value = true
  getCatBySearchApi({
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
      .finally(() => {
        loading.value = false
      })
}
const resetForm = () => {
  formData.value = cloneDeep(DEFAULT_FORM_DATA)
}
const handleUpdate = (row: CatInfo) => {
  dialogVisible.value = true
  formData.value = cloneDeep(row)
}

const handleCreateOrUpdate = () => {
  loading.value = true
  const api = formData.value.catId === 0 ? addCatDataApi : updateCatDataApi
  api(formData.value)
      .then(() => {
        ElMessage.success("操作成功")
        dialogVisible.value = false
        getTableData()
      })
      .finally(() => {
        loading.value = false
      })
}
const HandleImage = (row: CatInfo) => {
  ImageData.value = row.images
  for (let i = 0; i < ImageData.value.length; i++) {
    fileList.value.push({
      name: ImageData.value[i].imageUrl,
      url: ImageData.value[i].imageUrl,
      uid: ImageData.value[i].imageId,
    })
  }
  catId.value = row.catId
  dialog.value = true
}

const handleDelete = (row: CatInfo) => {
  ElMessageBox.confirm(`正在删除猫咪 ${row.name}，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteCatApi(row.catId).then(() => {
      ElMessage.success("删除成功")
      getTableData()
    })
  })
}

const catCategoriesList = ref<CatCategories[]>([])

const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
  deleteShopCatImage(uploadFile.uid, catId.value)
}

const dialogImageUrl = ref<string>("")
const dialogImage = ref<boolean>(false)
const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!
  dialogImage.value = true
}


const resetImage = () => {
  ImageData.value = []
  fileList.value = []
}

// const beforeUpload: UploadProps['beforeUpload'] = (rawFile) => {
//   if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png' && rawFile.type !== 'image/jpg' && rawFile.type !== 'image/gif') {
//     ElMessage.error('Avatar picture must be JPG format!')
//     return false
//   } else if (rawFile.size / 1024 / 1024 > 2) {
//     ElMessage.error('Avatar picture size can not exceed 2MB!')
//     return false
//   }
//   return true
// }

const handleImageChange: UploadProps['onChange'] = (uploadFile) => {
  const formData = new FormData()
  formData.append("file", uploadFile.raw as Blob)
  formData.append("catId", catId.value.toString())
  uploadShopCatImage(formData)

}

watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, {immediate: true})

</script>

<template>
  <div>
    <el-card v-loading="loading" shadow="never">
      <div class="toolbar-wrapper">
        <div>
          <el-button type="primary" :icon="CirclePlus" @click="dialogVisible = true">新增猫咪</el-button>
        </div>
        <div>
          <el-tooltip content="刷新当前页">
            <el-button type="primary" :icon="RefreshRight" circle @click="getTableData"/>
          </el-tooltip>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="tableData" style="width: 100%" max-height="500px">
          <el-table-column fixed prop="catId" label="id" align="center"/>
          <el-table-column prop="name" label="名字" align="center"/>
          <el-table-column prop="catCategories.name" label="种类名称" align="center"/>
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
          <el-table-column fixed="right" label="图片" width="150" align="center">
            <template #default="scope">
              <el-button link type="primary" size="large" @click="HandleImage(scope.row)">查看</el-button>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="Operations" width="150" align="center">
            <template #default="scope">
              <el-button link type="primary" size="large" @click="handleUpdate(scope.row)">修改</el-button>
              <el-button link type="primary" size="large" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
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
    </el-card>
    <!-- 新增/修改 -->
    <el-dialog
        v-model="dialogVisible"
        :title="formData.catId === 0 ? '新增猫咪' : '修改猫咪'"
        @closed="resetForm"
        width="30%"
    >
      <el-form :model="formData" label-width="100px" label-position="left">
        <el-form-item prop="name" label="名称">
          <el-input v-model="formData.name" placeholder="请输入"/>
        </el-form-item>
        <el-form-item prop="age" label="年龄">
          <el-input v-model="formData.age" placeholder="请输入"/>
        </el-form-item>
        <el-form-item prop="gender" label="性别">
          <el-input v-model="formData.gender" placeholder="请输入"/>
        </el-form-item>
        <el-form-item prop="preferences" label="喜好">
          <el-input v-model="formData.preferences" placeholder="请输入"/>
        </el-form-item>
        <el-form-item prop="healthStatusCode" label="健康状态">
          <el-select v-model="formData.healthStatusCode" placeholder="请选择健康状态">
            <el-option label="健康" :value="0"></el-option>
            <el-option label="生病" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="availableForAdoption" label="是否领养">
          <el-select v-model="formData.availableForAdoption" placeholder="请选择是否领养">
            <el-option label="是" :value="true"></el-option>
            <el-option label="否" :value="false"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="catCategories" label="种类">
          <el-select v-model="formData.categoryId" placeholder="请选择种类">
            <el-option v-for="item in catCategoriesList" :key="item.categoryId" :label="item.name"
                       :value="item.categoryId"/>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCreateOrUpdate" :loading="loading">确认</el-button>
      </template>
    </el-dialog>
    <el-dialog v-model="dialog" :title="'图片信息'" @closed="resetImage" width="50%">
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
    </el-dialog>
    <el-dialog v-model="dialogImage">
      <img w-full :src="dialogImageUrl" alt="Preview Image"/>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.search-wrapper {
  margin-bottom: 20px;

  :deep(.el-card__body) {
    padding-bottom: 2px;
  }
}

.toolbar-wrapper {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.table-wrapper {
  margin-bottom: 20px;
}

.pager-wrapper {
  display: flex;
  justify-content: flex-end;
}
</style>
