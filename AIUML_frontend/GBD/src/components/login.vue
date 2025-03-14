<template>
  <div class="login-container">
    <!-- 气泡背景容器 -->
    <ul class="square-bg-bubbles">
      <li v-for="n in 10" :key="n"></li>
    </ul>

    <el-row class="login-wrapper">
      <!-- 左侧介绍区域 -->
      <el-col :lg="12" :md="12" class="left-section">
        <div class="intro">
          <h1 class="title">图灵智绘</h1>
          <p class="description">轻量级、智能化 UML 绘制系统</p>
        </div>
      </el-col>

      <!-- 右侧登录区域 -->
      <el-col :lg="12" :md="12" :sm="24" :xs="24" class="right-section">
        <el-card class="login-box">
          <h2 class="login-title">欢迎回来</h2>
          <p class="login-subtitle">请输入您的账户信息</p>
          <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" class="login-form">
            <el-form-item prop="userId">
              <el-input v-model="loginForm.userId" placeholder="邮箱" prefix-icon="el-icon-user" />
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="loginForm.password" type="password" placeholder="密码" prefix-icon="el-icon-lock" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="login" class="login-btn">
                登录
              </el-button>
            </el-form-item>
          </el-form>
          <p class="register-link">
            还没有账户？
            <router-link to="/register">注册</router-link>
          </p>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        userId: "",
        password: "",
      },
      loginFormRules: {
        userId: [{ validator: this.validateId, trigger: "blur" }],
        password: [{ validator: this.validatePass, trigger: "blur" }],
      },
    };
  },
  methods: {
    validateId(rule, value, callback) {
      if (!value) {
        callback(new Error("请输入您的邮箱"));
      } else {
        callback();
      }
    },
    validatePass(rule, value, callback) {
      if (!value) {
        callback(new Error("请输入您的密码"));
      } else {
        callback();
      }
    },
    login() {
      // this.$router.push("/index");
      this.$refs.loginFormRef.validate((valid) => {
        if (valid) {
          this.$axios
            .post("/api/user/login", this.loginForm)
            .then((response) => {
              if (!response.data.code) {
                this.$message.success("登录成功");
                this.$store.commit("setToken", response.data.info);
                this.$router.push("/index");
              } else {
                this.$message.error("登录失败，请检查您的账户信息！");
              }
            })
            .catch(() => {
              this.$message.error("登录请求失败，请稍后重试！");
            });
        }
      });
    },
  },
};
</script>

<style scoped>
/* 容器 & 背景 */
.login-container {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(27deg, #000000, #121212, #1a1a1a);
  background-size: 600% 600%;
  animation: GradientBackground 7.5s ease infinite;
  overflow: hidden;
  z-index: 1;
}

/* 气泡动画层 */
.square-bg-bubbles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  list-style: none;
  z-index: 1;
}

.square-bg-bubbles li {
  position: absolute;
  display: block;
  width: 40px;
  height: 40px;
  background-color: hsla(0, 0%, 100%, .15);
  bottom: -160px;
  animation: square 25s infinite;
  transition-timing-function: linear;
  will-change: transform;
  /* 硬件加速 */
}

/* 气泡个性配置 */
.square-bg-bubbles li:nth-child(1) {
  left: 10%
}

.square-bg-bubbles li:nth-child(2) {
  left: 20%;
  width: 80px;
  height: 80px;
  animation-delay: 2s;
  animation-duration: 17s;
}

.square-bg-bubbles li:nth-child(3) {
  left: 25%;
  animation-delay: 4s
}

.square-bg-bubbles li:nth-child(4) {
  left: 40%;
  width: 60px;
  height: 60px;
  animation-duration: 22s;
  background-color: hsla(0, 0%, 100%, .25)
}

.square-bg-bubbles li:nth-child(5) {
  left: 70%
}

.square-bg-bubbles li:nth-child(6) {
  left: 80%;
  width: 120px;
  height: 120px;
  animation-delay: 3s;
  background-color: hsla(0, 0%, 100%, .2)
}

.square-bg-bubbles li:nth-child(7) {
  left: 32%;
  width: 160px;
  height: 160px;
  animation-delay: 5s
}

.square-bg-bubbles li:nth-child(8) {
  left: 55%;
  width: 40px;
  height: 40px;
  animation-delay: 15s;
  animation-duration: 40s
}

.square-bg-bubbles li:nth-child(9) {
  left: 25%;
  width: 30px;
  height: 30px;
  animation-delay: 2s;
  animation-duration: 40s;
  background-color: hsla(0, 0%, 100%, .3)
}

.square-bg-bubbles li:nth-child(10) {
  left: 90%;
  width: 160px;
  height: 160px;
  animation-delay: 11s
}

/* 关键帧动画 */
@keyframes GradientBackground {
  0% {
    background-position: 0% 50%
  }

  50% {
    background-position: 100% 50%
  }

  100% {
    background-position: 0% 50%
  }
}

@keyframes square {
  0% {
    transform: translateY(0);
    opacity: 1;
  }

  80% {
    transform: translateY(-560px) rotate(480deg);
    opacity: 1;
  }

  100% {
    transform: translateY(-700px) rotate(600deg);
    opacity: 0;
  }
}

/* 内容层 (需在气泡上层) */
.login-wrapper {
  position: relative;
  z-index: 2;
  width: 85%;
  max-width: 960px;
}

/* 左侧介绍区域 */
.left-section {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
  padding: 40px;
  margin-top: 100px;
}

.intro .title {
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 10px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.intro .description {
  font-size: 18px;
  opacity: 0.9;
  letter-spacing: 1px;
}

/* 右侧登录框 */
.right-section {
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-box {
  width: 100%;
  max-width: 400px;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  background: rgba(255, 255, 255, 0.95);
}

.login-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 5px;
  color: #2c3e50;
}

.login-subtitle {
  font-size: 14px;
  color: #7b7b7b;
  margin-bottom: 25px;
}

/* 表单元素 */
.login-form :deep(.el-input__inner) {
  height: 44px;
  border-radius: 6px;
  background-color: rgba(255, 255, 255, 0.95);
}

.login-btn {
  width: 100%;
  height: 44px;
  background: linear-gradient(45deg, #1a1a1a, #333333);
  border: none;
  transition: all 0.3s;
  color: #ffffff;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  background: linear-gradient(45deg, #2c2c2c, #454545);
}

/* 注册链接 */
.register-link {
  margin-top: 15px;
  font-size: 14px;
  color: #666666;
}

.register-link a {
  color: #333333 !important;
  font-weight: 500;
  transition: all 0.3s;
}

.register-link a:hover {
  color: #000000 !important;
  letter-spacing: 0.5px;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .login-wrapper {
    flex-direction: column;
    width: 90%;
  }

  .left-section {
    display: none;
  }

  .login-box {
    padding: 25px;
    margin-top: 20px;
  }
}
</style>