<script setup lang="ts">

import {reactive, ref, watch} from "vue";
import {usePagination} from "@/hooks/usePagination";
import {
  ElMessage,
  ElMessageBox,
  type FormInstance,
  type FormRules,
  type UploadProps,
  type UploadUserFile
} from "element-plus";
import {CirclePlus, Refresh, RefreshRight, Search} from "@element-plus/icons-vue"
import {cloneDeep} from "lodash-es";
import type {CatCategories} from "@/api/cat/types/cat";
import {
  addCatCategoriesDataApi,
  deleteCatCategoriesApi,
  getCatCategoriesApi,
  updateCatCategoriesDataApi
} from "@/api/cat";
import type {image} from "@/api/image/types";
import {adminUploadImage, deleteImage, getCatCategoriesImage} from "@/api/image";

const loading = ref<boolean>(false)
const {paginationData, handleCurrentChange, handleSizeChange} = usePagination()
const searchFormRef = ref<FormInstance | null>(null)
const searchData = reactive({
  name: "",
  description: "",
  origin: ""
})
const tableData = ref<CatCategories[]>([])
const ImageData = ref<image[]>([])
const fileList = ref<UploadUserFile[]>([])
const dialogVisible = ref<boolean>(false)
const dialog = ref<boolean>(false)
const DEFAULT_FORM_DATA: CatCategories = {
  categoryId: 0,
  name: "",
  origin: "",
  description: ""
}
const catCategoryId = ref<number>(0)

const DEFAULT_IMAGE_DATA: image = {
  imageId: 0,
  imageUrl: "",
  id: 0,
  description: ""
}
const formData = ref<CatCategories>(cloneDeep(DEFAULT_FORM_DATA))
const formRef = ref<FormInstance | null>(null)
const formRules: FormRules<CatCategories> = {
  name: [{required: true, trigger: "blur", message: "请输入名称"}],
  description: [{required: false, trigger: "blur", message: "请输入描述"}],
  origin: [{required: true, trigger: "blur", message: "请输入来源地"}],
}

const getTableData = () => {
  loading.value = true
  getCatCategoriesApi({
    page: paginationData.currentPage,
    size: paginationData.pageSize,
    name: searchData.name || undefined,
    description: searchData.description || undefined,
    origin: searchData.origin || undefined
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
  formRef.value?.clearValidate()
  formData.value = cloneDeep(DEFAULT_FORM_DATA)
}
const handleUpdate = (row: CatCategories) => {
  dialogVisible.value = true
  formData.value = cloneDeep(row)
}

const handleCreateOrUpdate = () => {
  formRef.value?.validate((valid: boolean, fields) => {
    if (!valid) return console.error("表单校验不通过", fields)
    loading.value = true
    const api = formData.value.categoryId === 0 ? addCatCategoriesDataApi : updateCatCategoriesDataApi
    api(formData.value)
        .then(() => {
          ElMessage.success("操作成功")
          dialogVisible.value = false
          getTableData()
        })
        .finally(() => {
          loading.value = false
        })
  })
}
const HandleImage = (row: CatCategories) => {
  getCatCategoriesImage(row.categoryId).then(({data}) => {
    ImageData.value = data
    for (let i = 0; i < ImageData.value.length; i++) {
      fileList.value.push({
        name: ImageData.value[i].imageUrl,
        url: ImageData.value[i].imageUrl,
        uid: ImageData.value[i].imageId,

      })
    }
  }).catch(() => {
    ImageData.value = []
    console.log("获取数据失败")
  })
  catCategoryId.value = row.categoryId
  dialog.value = true

}
const handleDelete = (row: CatCategories) => {
  ElMessageBox.confirm(`正在删除猫咪种类 ${row.name}，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteCatCategoriesApi(row.categoryId).then(() => {
      ElMessage.success("删除成功")
      getTableData()
    })
  })
}

const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
  deleteImage(uploadFile.uid)
}

const dialogImageUrl = ref<string>("")
const dialogImage = ref<boolean>(false)
const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!
  dialogImage.value = true
}

const handleSearch = () => {
  paginationData.currentPage === 1 ? getTableData() : (paginationData.currentPage = 1)
}
const resetSearch = () => {
  searchFormRef.value?.resetFields()
  handleSearch()
}
const resetImage = () => {
  ImageData.value = []
  fileList.value = []
}

const beforeUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png' && rawFile.type !== 'image/jpg' && rawFile.type !== 'image/gif') {
    ElMessage.error('Avatar picture must be JPG format!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('Avatar picture size can not exceed 2MB!')
    return false
  }
  return true
}

const handleImageSuccess: UploadProps['onSuccess'] = (
    response,
    uploadFile
) => {
}
const handleImageChange: UploadProps['onChange'] = (uploadFile) => {
  const formData = new FormData()
  formData.append("file", uploadFile.raw as Blob)
  formData.append("id", catCategoryId.value.toString())
  adminUploadImage(formData)
  console.log(formData)
}

watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, {immediate: true})

</script>

<template>
  <div>
    <el-card v-loading="loading" shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true" :model="searchData">
        <el-form-item prop="name" label="名称">
          <el-input v-model="searchData.name" placeholder="请输入"/>
        </el-form-item>
        <el-form-item prop="description" label="描述">
          <el-input v-model="searchData.description" placeholder="请输入"/>
        </el-form-item>
        <el-form-item prop="origin" label="来源地">
          <el-input v-model="searchData.origin" placeholder="请输入"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
          <el-button :icon="Refresh" @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card v-loading="loading" shadow="never">
      <div class="toolbar-wrapper">
        <div>
          <el-button type="primary" :icon="CirclePlus" @click="dialogVisible = true">新增猫咪种类</el-button>
        </div>
        <div>
          <el-tooltip content="刷新当前页">
            <el-button type="primary" :icon="RefreshRight" circle @click="getTableData"/>
          </el-tooltip>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="tableData" style="width: 100%" max-height="500px">
          <el-table-column fixed prop="categoryId" label="id" align="center"/>
          <el-table-column prop="name" label="名字" align="center"/>
          <el-table-column prop="origin" label="来源地" align="center"/>
          <el-table-column prop="description" label="描述" align="center"/>
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
        :title="formData.categoryId === 0 ? '新增种类' : '修改种类'"
        @closed="resetForm"
        width="30%"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" label-position="left">
        <el-form-item prop="name" label="名称">
          <el-input v-model="formData.name" placeholder="请输入"/>
        </el-form-item>
        <el-form-item prop="description" label="描述">
          <el-input v-model="formData.description" placeholder="请输入"/>
        </el-form-item>
        <el-form-item prop="origin" label="来源地">
          <el-input v-model="formData.origin" placeholder="请输入"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCreateOrUpdate" :loading="loading">确认</el-button>
      </template>
    </el-dialog>
    <el-dialog v-model="dialog" :title="'图片信息'" @closed="resetImage" width="80%">
      <el-upload
          v-model:file-list="fileList"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :before-upload="beforeUpload"
          :on-success="handleImageSuccess"
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