<script setup lang="ts">
import {useFocus} from "./hooks/useFocus"
import {reactive, ref} from "vue"
import {ElMessage, type FormInstance, type FormRules} from "element-plus"
import {Lock, User} from "@element-plus/icons-vue"
import type {LoginRequestData} from "@/api/login/types/login";
import router from "@/router";
import Vcode from 'vue3-puzzle-vcode'
import Img from '@/assets/layouts/cat.jpg'
import {useUserStore} from '@/store/modules/user'

const isShow = ref(false)
const {isFocus, handleBlur, handleFocus} = useFocus()
const loginFormRef = ref<FormInstance | null>(null)
const loading = ref(false)
/** 验证码图片 URL */
const loginFormData: LoginRequestData = reactive({
  name: 'test',
  pwd: '123456',
})
/*引入登录*/
const loginFormRules: FormRules = {
  name: [{required: true, message: "请输入用户名", trigger: "blur"}],
  pwd: [
    {required: true, message: "请输入密码", trigger: "blur"},
    {min: 6, max: 16, message: "长度在 6 到 16 个字符", trigger: "blur"}
  ]
}

const handleLogin = () => {
  const valid = loginFormRef.value?.validate();
  if (!valid) {
    ElMessage.error("表单校验失败");
    return;
  }
  isShow.value = true
}

//用户通过了验证
const success = () => {
  try {
    isShow.value = false
    loginFormRef.value?.validate(async (valid: boolean, fields) => {
      if (valid) {
        await useUserStore().login(loginFormData)
        await router.push({path: "/admin"})
      } else {
        console.error("表单校验不通过", fields)
      }
    })
  }catch (e) {
    ElMessage.error("登录失败")
  }finally {
    loading.value = false
  }
}
//用户点击遮罩层，关闭模态框
const close = () => {
  isShow.value = false
}

const fail = () => {
  console.log('验证失败')
}

</script>

<template>
  <div class="login-container">
    <ThemeSwitch class="theme-switch"/>
    <Owl :close-eyes="isFocus"/>
    <div class="login-card">
      <div class="title">
        <img src="@/assets/layouts/cat.jpg" alt="test"/>
      </div>
      <div class="content">
        <el-form ref="loginFormRef" :model="loginFormData" :rules="loginFormRules" @keyup.enter="handleLogin">
          <el-form-item prop="name">
            <el-input
                v-model.trim="loginFormData.name"
                placeholder="用户名"
                type="text"
                tabindex="1"
                :prefix-icon="User"
                size="large"
            />
          </el-form-item>
          <el-form-item prop="pwd">
            <el-input
                v-model.trim="loginFormData.pwd"
                placeholder="密码"
                type="password"
                tabindex="2"
                :prefix-icon="Lock"
                size="large"
                show-password
                @blur="handleBlur"
                @focus="handleFocus"
            />
          </el-form-item>
          <div>
            <el-button :loading="loading" type="primary" size="large" @click.prevent="handleLogin">登 录</el-button>
            <Vcode :show="isShow" @success="success" @close="close" @fail="fail" :imgs="[Img]"></Vcode>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 100%;

  .theme-switch {
    position: fixed;
    top: 5%;
    right: 5%;
    cursor: pointer;
  }

  .login-card {
    width: 480px;
    max-width: 90%;
    border-radius: 20px;
    box-shadow: 0 0 10px #dcdfe6;
    background-color: #fff;
    overflow: hidden;

    .title {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 150px;

      img {
        height: 100%;
      }
    }

    .content {
      padding: 20px 50px 50px 50px;

      :deep(.el-input-group__append) {
        padding: 0;
        overflow: hidden;

        .el-image {
          width: 100px;
          height: 40px;
          border-left: 0px;
          user-select: none;
          cursor: pointer;
          text-align: center;
        }
      }

      .el-button {
        width: 100%;
        margin-top: 10px;
      }
    }
  }
}
</style>