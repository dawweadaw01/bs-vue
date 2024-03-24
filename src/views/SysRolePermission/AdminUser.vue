<script lang="ts" setup>
import {reactive, ref, watch} from "vue";
import {Refresh, Search} from "@element-plus/icons-vue"
import {ElMessage, ElMessageBox, type FormInstance, type FormRules} from "element-plus";
import {usePagination} from "@/hooks/usePagination";
import {deleteTableDataApi, getUserListApi, updateTableDataApi} from "@/api/login";
import type {UserList} from "@/api/login/types/login";
import {cloneDeep} from "lodash-es"
import type {sysRoles} from "@/api/SysRolePermission/types/sysRolePermission";
import {addUserRolesApi, deleteUserRolesApi, getAllRolesApi, getUserRolesByUserIdApi} from "@/api/SysRolePermission";

const loading = ref<boolean>(false)
const searchFormRef = ref<FormInstance | null>(null)
const roleNumId = ref<number>(0)
const roleAddUserId = ref<number>(0)
const DEFAULT_FORM_DATA: UserList = {
  id: 0,
  username: "",
  phone: "",
  email: "",
  roles: ""
}
// 改
const dialogVisible = ref<boolean>(false)
const dialog = ref<boolean>(false)
const dialogRole = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = ref<UserList>(cloneDeep(DEFAULT_FORM_DATA))
const formRules: FormRules<UserList> = {
  username: [{required: true, trigger: "blur", message: "请输入用户名"}],
  phone: [{min: 11, max: 11, required: true, trigger: "blur", message: "请输入电话"}],
  email: [{required: true, trigger: "blur", message: "请输入邮箱"}]
}

// 数据
const tableData = ref<UserList[]>([])
const RoleTableData = ref<sysRoles[]>([])
const RoleList = ref<sysRoles[]>([])
const searchData = reactive({
  name: "",
  phone: ""
})
const {paginationData, handleCurrentChange, handleSizeChange} = usePagination()

const getTableData = () => {
  loading.value = true
  getUserListApi({
    page: paginationData.currentPage,
    size: paginationData.pageSize,
    username: searchData.name || undefined,
    phone: searchData.phone || undefined
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

const handleRoleUpdate = (row: UserList) => {
  dialog.value = true
  getRoleTableData(row.id)
  roleNumId.value = row.id
}

const handleDeleteRole = (row: sysRoles) => {
  ElMessageBox.confirm(`正在删除角色：${row.name}，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteUserRolesApi(row.id).then(() => {
      ElMessage.success("删除成功")
      getRoleTableData(roleNumId.value)
    })
  })
}

const getRoleTableData = (id: number) => {
  loading.value = true
  getUserRolesByUserIdApi(id).then(
      ({data}) => {
        RoleTableData.value = data
      }
  ).catch(() => {
    RoleTableData.value = []
    console.log("获取数据失败")
  })
      .finally(() => {
        loading.value = false
      })
}

const handleRoleAdd = (row: UserList) => {
  dialogRole.value = true
  getAllRolesApi().then(
      ({data}) => {
        RoleList.value = data
      }
  ).catch(() => {
    RoleList.value = []
    console.log("获取数据失败")
  })
  roleAddUserId.value = row.id
}

const RoleAdd = (row: sysRoles) => {
  ElMessageBox.confirm(`正在添加角色：${row.name}，确认添加？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    addUserRolesApi(roleAddUserId.value,row.id).then(() => {
      ElMessage.success("添加成功")
      dialogRole.value = false
    })
  })
}

const handleUpdate = (row: UserList) => {
  dialogVisible.value = true
  formData.value = cloneDeep(row)
}

const UpdateUser = () => {
  formRef.value?.validate((valid: boolean, fields) => {
    if (!valid) return console.error("表单校验不通过", fields)
    loading.value = true
    const api = updateTableDataApi
    console.log(formData.value)
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
const handleDelete = (row: UserList) => {
  ElMessageBox.confirm(`正在删除用户：${row.username}，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteTableDataApi(row.id).then(() => {
      ElMessage.success("删除成功")
      getTableData()
    })
  })
}


const resetForm = () => {
  formRef.value?.clearValidate()
  formData.value = cloneDeep(DEFAULT_FORM_DATA)
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
        <el-form-item prop="name" label="用户名">
          <el-input v-model="searchData.name" placeholder="请输入"/>
        </el-form-item>
        <el-form-item prop="phone" label="手机号">
          <el-input v-model="searchData.phone" placeholder="请输入"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
          <el-button :icon="Refresh" @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card v-loading="loading" shadow="never">
      <div class="table-wrapper">
        <el-table :data="tableData" style="width: 100%" max-height="500px">
          <el-table-column fixed prop="id" label="id" align="center"/>
          <el-table-column prop="username" label="用户名" align="center"/>
          <el-table-column prop="phone" label="电话" align="center"/>
          <el-table-column prop="email" label="邮箱" align="center"/>
          <el-table-column prop="roles" label="权限" align="center"/>
          <el-table-column fixed="right" label="基本选项" width="150" align="center">
            <template #default="scope">
              <el-button link type="primary" size="large" @click="handleUpdate(scope.row)">修改</el-button>
              <el-button link type="primary" size="large" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="角色选项" width="150" align="center">
            <template #default="scope">
              <el-button link type="primary" size="large" @click="handleRoleUpdate(scope.row)">修改</el-button>
              <el-button link type="primary" size="large" @click="handleRoleAdd(scope.row)">增加</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
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
  <el-dialog
      v-model="dialogVisible"
      :title="'修改用户'"
      @closed="resetForm"
      width="30%"
  >
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" label-position="left">
      <el-form-item prop="username" label="用户名">
        <el-input v-model="formData.username" placeholder="请输入"/>
      </el-form-item>
      <el-form-item prop="username" label="电话">
        <el-input v-model="formData.phone" placeholder="请输入"/>
      </el-form-item>
      <el-form-item prop="username" label="邮箱">
        <el-input v-model="formData.email" placeholder="请输入"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="UpdateUser" :loading="loading">确认</el-button>
    </template>
  </el-dialog>
  <el-dialog
      v-model="dialog"
      :title="'修改角色'"
      @closed="resetForm"
      width="30%"
  >
    <div class="table-wrapper">
      <el-table :data="RoleTableData" max-height="500px" v-loading="loading">
        <el-table-column prop="name" label="用户名" align="center"/>
        <el-table-column prop="description" label="描述" align="center"/>
        <el-table-column fixed="right" label="Operations" width="150" align="center">
          <template #default="scope">
            <el-button link type="primary" size="large" @click="handleDeleteRole(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-dialog>
  <el-dialog
      v-model="dialogRole"
      :title="'添加角色'"
      @closed="resetForm"
      width="30%"
  >
    <div class="table-wrapper">
      <el-table :data="RoleList" max-height="500px" v-loading="loading">
        <el-table-column prop="name" label="用户名" align="center"/>
        <el-table-column prop="description" label="描述" align="center"/>
        <el-table-column fixed="right" label="Operations" width="150" align="center">
          <template #default="scope">
            <el-button link type="primary" size="large" @click="RoleAdd(scope.row)">添加</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-dialog>
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