<script setup lang="ts">

import {sendCodeApi} from "@/api/login";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: true,
  },
  title: String
});
import {useFocus} from "./hooks/useFocus"
import {reactive, ref, watch} from "vue"
import {ElMessage, type FormInstance, type FormRules} from "element-plus"
import {Lock, User} from "@element-plus/icons-vue"
import type {LoginRequestData} from "@/api/login/types/login";
import router from "@/router";
import Vcode from 'vue3-puzzle-vcode'
import Img from '@/assets/layouts/cat.jpg'
import {useUserStore} from '@/store/modules/user'

const showLogin = ref(false)
const isShow = ref(false)
const {isFocus, handleBlur, handleFocus} = useFocus()
const loginFormRef = ref<FormInstance | null>(null)
const loading = ref(false)


// 监听外部传入的显示状态变化
watch(() => props.modelValue, (newVal) => {
  console.log('newVal', newVal)
  showLogin.value = newVal;
});
const emit = defineEmits(['update:modelValue']);
// 当弹窗关闭时发出事件通知父组件
const handleClose = () => {
  // 清空表单
  loginFormRef.value?.resetFields();
  emit('update:modelValue', false);
  //emit('update:title', '登录');
};
const isPhoneLogin = ref(false); // false 表示常规登录，true 表示手机验证码登录

/** 验证码图片 URL */
const loginFormData: LoginRequestData = reactive({
  name: 'test',
  pwd: '123456',
  phone: '18090532775',
  code: '123456',
})


const loginFormRules: FormRules = {
  name: [{required: true, message: "请输入用户名", trigger: "blur"}],
  pwd: [
    {required: true, message: "请输入密码", trigger: "blur"},
    {min: 6, max: 16, message: "长度在 6 到 16 个字符", trigger: "blur"}
  ]
}
const phoneLoginRules = reactive({
  phone: [{required: true, message: "请输入手机号码", trigger: "blur"}],
  code: [{required: true, message: "请输入验证码", trigger: "blur"}]
});

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
      console.log(loginFormData)
      if (valid) {
        if (props.title === '注册') {
          await useUserStore().reg(loginFormData)
        } else if (!isPhoneLogin.value) {
          await useUserStore().login(loginFormData)
        } else {
          await useUserStore().phoneLogin(loginFormData)
        }
        emit('update:modelValue', false);
        ElMessage.success("成功")
        await router.push({path: "/"})
      } else {
        console.error("表单校验不通过", fields)
      }
    })
  } catch (e) {
    ElMessage.error("失败")
  } finally {
    loading.value = false
  }
}
//用户点击遮罩层，关闭模态框
const close = () => {
  isShow.value = false
}

const sendCode = () => {
  if (loginFormData.phone) {
    // 假设发送验证码的请求已经发送
    sendCodeApi(loginFormData.phone);
    // 这里直接开始倒计时
    countdown.value = 60; // 假设倒计时60秒
    const interval = setInterval(() => {
      countdown.value--;
      if (countdown.value === 0) {
        clearInterval(interval);
      }
    }, 1000);
  } else {
    // 提示用户输入手机号
    console.log('请输入手机号码');
  }
}

const fail = () => {
  console.log('验证失败')
}
const countdown = ref(0); // 倒计时秒数

</script>

<template>
  <el-dialog
      v-model="showLogin"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="handleClose"
      width="20%"
  >

    <div class="login-container">
      <ThemeSwitch class="theme-switch"/>
      <Owl :close-eyes="isFocus"/>
      <div class="login-card">
        <div class="title">
          <img src="@/assets/layouts/cat.jpg" alt="test"/>
        </div>
        <div class="content">
          <el-form ref="loginFormRef" :model="loginFormData" :rules="title==='登录'? loginFormRules : regFormRules"
                   @keyup.enter="handleLogin">
            <div v-if="!isPhoneLogin">
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
                <el-button :loading="loading" type="primary" size="large" @click.prevent="handleLogin">{{ title }}
                </el-button>
              </div>
            </div>
            <div v-else>
              <el-form-item prop="phone">
                <el-input
                    v-model.trim="loginFormData.phone"
                    placeholder="手机号码"
                    type="text"
                    tabindex="1"
                    :prefix-icon="User"
                    size="large"
                />
              </el-form-item>
              <el-form-item prop="code">
                <el-input
                    v-model.trim="loginFormData.code"
                    placeholder="验证码"
                    type="text"
                    tabindex="2"
                    :prefix-icon="Lock"
                    size="large"
                    @blur="handleBlur"
                    @focus="handleFocus"
                >
                </el-input>
                <el-button :disabled="countdown > 0" @click="sendCode">
                  {{ countdown > 0 ? `${countdown}秒后重发` : '发送验证码' }}
                </el-button>
              </el-form-item>
              <div>
                <el-button :loading="loading" type="primary" size="large" @click.prevent="handleLogin">{{ title }}
                </el-button>
              </div>
            </div>
            <!-- 登录按钮 -->
            <!--            <el-button type="primary" @click="handleLogin">登录</el-button>-->
            <!-- 切换登录方式 -->
            <el-button v-if="title==='登录'" type="text" @click="isPhoneLogin = !isPhoneLogin">
              {{ isPhoneLogin ? '使用常规登录' : '使用手机验证码登录' }}
            </el-button>
          </el-form>
        </div>
      </div>
    </div>
  </el-dialog>
  <Vcode z-index="9999" :show="isShow" @success="success" @close="close" @fail="fail" :imgs="[Img]"></Vcode>
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
        border-radius: 20%;
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
          border-left: 0;
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
