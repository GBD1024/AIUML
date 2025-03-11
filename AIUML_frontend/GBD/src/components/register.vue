<template>
  <div class="wrapper">
    <el-row style="width: 450px; height: auto">
      <el-col style="z-index: 2" :xs="24" :sm="24" :md="24" :lg="24" class="animate__animated animate__fadeIn">
        <el-card class="justify-center" style="border-radius: 10px" shadow="always">
          <div class="text-center my-5">
            <div class="text-2xl font-bold mb-xs">创建您的账户</div>
            <span class="text-sm text-gray-400">已经有账户了？</span>
            <span class="login">
              <router-link to="/login" class="text-black">在此登入</router-link>
            </span>
          </div>
          <div class="flex flex-col items-center justify-center">
            <el-form ref="registerFormRef" style="max-width: 600px" :model="registerForm" status-icon
              :rules="registerFormRules" label-width="200px" label-position="top" class="register_form">
              <el-form-item label="邮箱" prop="userId">
                <el-input size="large" v-model="registerForm.userId" type="text" autocomplete="off"
                  placeholder="请正确输入你的邮箱" class="inputbox" />
              </el-form-item>
              <el-form-item label="验证码" prop="verifyCode">
                <el-input size="large" v-model="registerForm.verifyCode" type="text" autocomplete="off"
                  placeholder="请输入你的验证码" class="inputbox-varify">
                  <template slot="append">
                    <el-button color="#2283e5" :disabled="!canSend" @click="sendVerifyCode">
                      {{ canSend ? "获取" : `${timer} s` }}
                    </el-button>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item label="密码" prop="pass">
                <el-input size="large" v-model="registerForm.pass" type="password" autocomplete="off"
                  placeholder="请正确输入你的密码" class="inputbox" />
              </el-form-item>
              <el-form-item label="重复密码" prop="checkPass">
                <el-input size="large" v-model="registerForm.checkPass" type="password" autocomplete="off"
                  placeholder="请再次正确输入你的密码" class="inputbox" />
              </el-form-item>
              <el-form-item>
                <el-checkbox v-model="agreed" label="我同意" size="large" />
                <span>&nbsp;</span>
                <span class="text-dark-500" @click="openTerms" style="cursor: pointer">服务条款</span>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="register" class="text-sm h-[40px] w-[350px] mt-2 mb-8">
                  创建账户
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      registerForm: {
        userId: "",
        verifyCode: "",
        pass: "",
        checkPass: "",
      },
      registerFormRules: {
        userId: [{ validator: this.validateId, trigger: "blur" }],
        verifyCode: [{ validator: this.validateCode, trigger: "blur" }],
        pass: [{ validator: this.validatePass, trigger: "blur" }],
        checkPass: [{ validator: this.validatePass2, trigger: "blur" }],
      },
      agreed: false,
      timer: 0,
      canSend: true,
    };
  },
  methods: {
    validateId(rule, value, callback) {
      if (!value) callback(new Error("请输入邮箱"));
      else callback();
    },
    validateCode(rule, value, callback) {
      if (!value) callback(new Error("请输入验证码"));
      else callback();
    },
    validatePass(rule, value, callback) {
      if (!value) callback(new Error("请输入密码"));
      else callback();
    },
    validatePass2(rule, value, callback) {
      if (!value) callback(new Error("请再次输入密码"));
      else if (value !== this.registerForm.pass) callback(new Error("请确保两次输入的密码相同"));
      else callback();
    },
    sendVerifyCode() {
      if (!this.canSend) {
        this.$message.info("请稍候，正在冷却中...");
        return;
      }
      if (!this.registerForm.userId) {
        this.$message.error("请输入邮箱地址！");
        return;
      }

      console.log("发送验证码给:", this.registerForm.userId);
      this.$axios
        .post(`/api/user/getVerificationCode?userId=${encodeURIComponent(this.registerForm.userId)}`)
        .then((response) => {
          if (response.data.code === 1) {
            throw new Error(response.data.message);
          }
          this.timer = 120;
          this.canSend = false;
          const countdown = setInterval(() => {
            this.timer--;
            if (this.timer <= 0) {
              clearInterval(countdown);
              this.canSend = true;
            }
          }, 1000);

          this.$message.success("验证码已发送，请查收！");
        })
        .catch((error) => {
          this.$message.error(`发送失败: ${error.message}`);
        });
    },
    register() {
      if (!this.agreed) {
        this.$message.error("请同意服务条款");
        return;
      }
      this.$refs.registerFormRef.validate((valid) => {
        if (valid) {
          this.$axios
            .post("/api/user/register", this.registerForm)
            .then((response) => {
              if (!response.data.code) {
                this.$message.success("注册成功！");
                this.$router.push("/login");
              } else {
                this.$message.error("请确保验证码填写正确");
              }
            })
            .catch((error) => {
              this.$message.error(`注册失败: ${error.message}`);
            });
        } else {
          this.$message.error("请确保注册信息完整无误");
        }
      });
    },
    openTerms() {
      this.$confirm("服务条款内容...", "服务条款", {
        confirmButtonText: "我同意",
        cancelButtonText: "关闭",
        dangerouslyUseHTMLString: true,
      }).catch(() => {
        this.$message.info("已取消");
      });
    },
  },
};
</script>

<style scoped>
.login {
  font-size: 14px;
  font-weight: bold;
  color: #000000;
}

.inputbox {
  margin-bottom: 8px;
}

:deep(.el-input__wrapper) {
  border-radius: 5px;
}

:deep(.el-checkbox__inner) {
  border-color: #000;
}
</style>
