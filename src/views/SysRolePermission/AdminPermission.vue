<script setup lang="ts">

import {reactive, ref, watch} from "vue";
import {usePagination} from "@/hooks/usePagination";
import {ElMessage, ElMessageBox, type FormInstance, type FormRules} from "element-plus";
import type {sysPermission, sysRoles} from "@/api/SysRolePermission/types/sysRolePermission";
import {
  addPermissionDataApi,
  addRolePermissionApi, deletePermissionApi,
  getPermissionsApi, updatePermissionDataApi,

} from "@/api/SysRolePermission";
import {CirclePlus, Refresh, RefreshRight, Search} from "@element-plus/icons-vue"
import {cloneDeep} from "lodash-es";

const loading = ref<boolean>(false)
const {paginationData, handleCurrentChange, handleSizeChange} = usePagination()
const searchFormRef = ref<FormInstance | null>(null)
const searchData = reactive({
  name: "",
  description: ""
})
const tableData = ref<sysPermission[]>([])
const dialogVisible = ref<boolean>(false)
const DEFAULT_FORM_DATA: sysPermission = {
  id: 0,
  name: "",
  description: ""
}
const formData = ref<sysPermission>(cloneDeep(DEFAULT_FORM_DATA))
const formRef = ref<FormInstance | null>(null)
const formRules: FormRules<sysPermission> = {
  name: [{required: true, trigger: "blur", message: "请输入名称"}],
  description: [{required: false, trigger: "blur", message: "请输入描述"}]
}

const getTableData = () => {
  loading.value = true
  getPermissionsApi({
    page: paginationData.currentPage,
    size: paginationData.pageSize,
    name: searchData.name || undefined,
    description: searchData.description || undefined
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
const handleUpdate = (row: sysRoles) => {
  dialogVisible.value = true
  formData.value = cloneDeep(row)
}

const dialogPermission = ref<boolean>(false)
const roleNumId = ref<number>(0)


const handleCreateOrUpdate = () => {
  formRef.value?.validate((valid: boolean, fields) => {
    if (!valid) return console.error("表单校验不通过", fields)
    loading.value = true
    const api = formData.value.id === 0 ? addPermissionDataApi : updatePermissionDataApi
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
const handleDelete = (row: sysPermission) => {
  ElMessageBox.confirm(`正在删除权限 ${row.name}，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deletePermissionApi(row.id).then(() => {
      ElMessage.success("删除成功")
      getTableData()
    })
  })
}

const PermissionAdd = (row: sysPermission) => {
  ElMessageBox.confirm(`正在添加权限 ${row.name}，确认添加？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    addRolePermissionApi(roleNumId.value, row.id).then(() => {
      ElMessage.success("添加成功")
      dialogPermission.value = false
    })
  }).finally(() => {
    loading.value = false
    roleNumId.value = 0
  })
}

const handleSearch = () => {
  paginationData.currentPage === 1 ? getTableData() : (paginationData.currentPage = 1)
}
const resetSearch = () => {
  searchFormRef.value?.resetFields()
  handleSearch()
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
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
          <el-button :icon="Refresh" @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card v-loading="loading" shadow="never">
      <div class="toolbar-wrapper">
        <div>
          <el-button type="primary" :icon="CirclePlus" @click="dialogVisible = true">新增权限</el-button>
        </div>
        <div>
          <el-tooltip content="刷新当前页">
            <el-button type="primary" :icon="RefreshRight" circle @click="getTableData"/>
          </el-tooltip>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="tableData" style="width: 100%" max-height="500px">
          <el-table-column fixed prop="id" label="id" align="center"/>
          <el-table-column prop="name" label="name" align="center"/>
          <el-table-column prop="description" label="description" align="center"/>
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
        :title="formData.id === 0 ? '新增权限' : '修改权限'"
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
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCreateOrUpdate" :loading="loading">确认</el-button>
      </template>
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