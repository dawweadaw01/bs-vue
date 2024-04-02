<script setup lang="ts">
import {onMounted, ref} from "vue";
import type {UserInfo} from "@/api/login/types/login";
import {getUserInfoApi, sendCodeApi, updateUserInfoApi, updateUserPhoneApi, updateUserPwdApi} from "@/api/login";
import {ElMessageBox} from "element-plus";

const onePwd = ref("")
const twoPwd = ref("")
const userInfo = ref<UserInfo>(
    {
      username: "",
      avatar: "",
      autograph: "",
      email: "", address: "", id: 0, phone: ""
    }
)
const oldPwd = ref("")
const countdown = ref(0); // 倒计时秒数
const newPhone = ref("")
const code = ref("")
// 在加载页面时获取用户信息
onMounted(() => {
  getUserInfoApi().then(({data}) => {
    userInfo.value = data
    console.log(userInfo.value)
  }).catch(() => {
    ElMessageBox.alert("获取用户信息失败", "错误", {type: "error"})
  })
})
const updateUserInfo = () => {
  // 更新邮箱
  updateUserInfoApi({
    id: userInfo.value.id,
    email: userInfo.value.email,
    username: userInfo.value.username
  }).then(() => {
    ElMessageBox.alert("更新成功", "成功", {type: "success"})
  }).catch(() => {
    ElMessageBox.alert("更新失败", "错误", {type: "error"})
  })
}

const sendCode = () => {
  if (newPhone.value) {
    // 假设发送验证码的请求已经发送
    sendCodeApi(newPhone.value);
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
    ElMessageBox.alert("请输入手机号码", "错误", {type: "error"})
  }
}
const updateUserPhone = () => {
  if (newPhone.value && code.value) {
    if (newPhone.value.length !== 11) {
      ElMessageBox.alert("手机号码格式错误", "错误", {type: "error"})
      return
    }
    if (code.value.length !== 6) {
      ElMessageBox.alert("验证码格式错误", "错误", {type: "error"})
      return
    }
    if (newPhone.value === userInfo.value.phone) {
      ElMessageBox.alert("新手机号码不能与原手机号码相同", "错误", {type: "error"})
      return
    }
    updateUserPhoneApi({phone: newPhone.value, code: code.value}).then(() => {
      userInfo.value.phone = newPhone.value
      // 重置code，newPhone
      ElMessageBox.alert("更新成功", "成功", {type: "success"})
    })
  } else {
    ElMessageBox.alert("请输入手机号码和验证码", "错误", {type: "error"})
  }
}

const updateUserPwd = () => {
  if (onePwd.value && twoPwd.value) {
    if (onePwd.value.length < 6 || onePwd.value.length > 16) {
      ElMessageBox.alert("密码长度应在6-16位之间", "错误", {type: "error"})
      return
    }
    if (onePwd.value !== twoPwd.value) {
      ElMessageBox.alert("两次输入的密码不一致", "错误", {type: "error"})
      return
    }
    // 假设更新密码的请求已经发送
    updateUserPwdApi({oldPwd: oldPwd.value, newPwd: onePwd.value}).then(() => {
      // 重置密码
      onePwd.value = ""
      twoPwd.value = ""
      oldPwd.value = ""
      ElMessageBox.alert("更新成功", "成功", {type: "success"})
    })
  } else {
    ElMessageBox.alert("请输入密码", "错误", {type: "error"})
  }
}
</script>

<template>
  <div class="setting-main">
    <div class="setting">
      <div class="local-info">
        <div class="info-title">
          <span class="title">基本信息</span>
        </div>
        <div class="info">
          <div class="title-item">
            <span class="title">
              用户名:
            </span>
            <el-input class="input-item"
                      v-model="userInfo.username"
                      size="large"
                      placeholder="输入用户名"
            />
          </div>
          <div class="title-item">
            <span class="title">
              &nbsp;&nbsp;
              邮箱:
            </span>
            <el-input class="input-item"
                      v-model="userInfo.email"
                      size="large"
                      placeholder="输入邮箱"
            />
          </div>
        </div>
        <div style="margin-top: 10px">
          <el-button type="primary" @click="updateUserInfo">更新</el-button>
        </div>
      </div>
      <div class="local-info">
        <div class="info-title">
          <span class="title">绑定手机</span>
        </div>
        <div class="phone">
          <span class="title">原手机号：{{ userInfo.phone }}</span>
          <div class="title-item">
            <span class="title">新手机号：</span>
            <el-input class="input-item"
                      v-model="newPhone"
                      size="large"
                      placeholder="请输入手机号"
            />
          </div>
          <div class="title-item">
            <span class="title">验证码为：</span>
            <el-input class="input-item"
                      v-model="code"
                      size="large"
                      placeholder="请输入验证码"
            />
          </div>
          <el-button style="width: 450px" :disabled="countdown > 0" @click="sendCode">
            {{ countdown > 0 ? `${countdown}秒后重发` : '发送验证码' }}
          </el-button>
          <div style="margin-top: 10px">
            <el-button type="primary" @click="updateUserPhone">更新</el-button>
          </div>
        </div>
      </div>
      <div class="local-info">
        <div class="info-title">
          <span class="title">更新密码</span>
        </div>
        <div class="phone">
          <div class="title-item">
            <span class="title">输入旧密码：</span>
            <el-input class="input-item"
                      size="large"
                      type="password"
                      show-password
                      placeholder="请输入密码"
                      v-model="oldPwd"
            />
          </div>
          <div class="title-item">
            <span class="title">请输入密码：</span>
            <el-input class="input-item"
                      size="large"
                      type="password"
                      show-password
                      placeholder="请输入密码"
                      v-model="onePwd"
            />
          </div>
          <div class="title-item">
            <span class="title">重复新密码：</span>
            <el-input class="input-item"
                      size="large"
                      type="password"
                      show-password
                      placeholder="请输入密码"
                      v-model="twoPwd"
            />
          </div>
          <div style="margin-top: 10px">
            <el-button type="primary" @click="updateUserPwd">更新</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

.phone {
  display: flex;
  flex-direction: column;
  gap: 20px 20%; /* 子元素之间的间距 */
  justify-content: center; /* 水平居中 */
  margin-top: 1%;
  width: 80%;
}

.input-item {
  margin-left: 5%;
  width: 300px;
}

.title-item {
  display: flex;
  flex-direction: row;
}

.info {
  display: flex;
  flex-direction: column;
  gap: 20px 20%; /* 子元素之间的间距 */
  justify-content: center; /* 水平居中 */
  margin-top: 1%;
  width: 80%;
}

.info > .el-input {
  flex: 0 0 240px; /* flex-grow: 0, flex-shrink: 0, flex-basis: 240px */
}


.local-info {
  width: 95%;
  background-color: white;
  margin-bottom: 3%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.info-title {
  position: relative; /* 设置相对定位，为伪元素定位做准备 */
  font-size: 20px;
  color: black;
  font-weight: bold;
  margin-left: 2%;
  margin-top: 1%;
  margin-bottom: 1%;
}

.info-title:after {
  content: ''; /* 伪元素必须有content属性 */
  position: absolute; /* 绝对定位 */
  bottom: -2px; /* 定位到下边界 */
  left: 50%; /* 从左边开始，位于盒子宽度的一半处 */
  transform: translateX(-50%); /* 将伪元素向左移动自身宽度的一半，以便居中 */
  width: 100%; /* 伪元素的宽度，可以根据需要调整 */
  border-bottom: 1px solid #d2cece; /* 伪元素的下边框，这里设置为红色 */
}

.title {
  font-size: 20px;
  color: black;
  font-weight: bold;
}

.setting {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 53%;
  background-color: white;
  border-radius: 5px;
}

.setting-main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
}

</style>