<template>
  <div class="login-container">
    <el-row class="login-wrapper">
      <!-- 左侧介绍区域 -->
      <el-col :lg="12" :md="12" class="left-section">
        <div class="intro">
          <h1 class="title">图灵智绘</h1>
          <p class="description">轻量级、智能化 UML 绘制系统</p>
          <ul class="bg-bubbles">
            <li v-for="n in 10" :key="n"></li>
          </ul>
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
      this.$refs.loginFormRef.validate((valid) => {
        if (valid) {
          this.$axios
            .post("/api/user/login", this.loginForm)
            .then((response) => {
              if (!response.data.code) {
                this.$message.success("登录成功");
                this.$store.commit("setToken", response.data.info);
                this.$router.push("/diagram");
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
/* 整体布局 */
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #2c3e50, #4b6584);
}

/* 登录框区域 */
.login-wrapper {
  width: 85%;
  max-width: 960px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 左侧介绍 */
.left-section {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
  padding: 40px;
}

.intro .title {
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 10px;
}

.intro .description {
  font-size: 18px;
  opacity: 0.8;
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
  border-radius: 10px;
  text-align: center;
}

/* 标题 */
.login-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 5px;
}

.login-subtitle {
  font-size: 14px;
  color: #7b7b7b;
  margin-bottom: 20px;
}

/* 表单 */
.login-form {
  display: flex;
  flex-direction: column;
}

/* 登录按钮 */
.login-btn {
  width: 100%;
  background-color: #2c3e50;
  border: none;
  color: white;
  padding: 12px;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
}

.login-btn:hover {
  background-color: #1f2c3a;
}

/* 注册链接 */
.register-link {
  font-size: 14px;
  margin-top: 10px;
}

.register-link a {
  color: #3498db;
  text-decoration: none;
}

.register-link a:hover {
  text-decoration: underline;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .login-wrapper {
    flex-direction: column;
  }

  .left-section {
    display: none;
  }
}
</style>
