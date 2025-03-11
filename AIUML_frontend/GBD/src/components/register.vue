<template>
    <div class="wrapper">
        <!-- 三角气泡背景 -->
        <ul class="bg-bubbles">
            <li v-for="n in 10" :key="n"></li>
        </ul>

        <!-- 注册表单 -->
        <el-row class="form-container">
            <el-col :xs="24" :sm="24" :md="24" :lg="24">
                <el-card class="register-card">
                    <div class="text-center header-section">
                        <h1 class="text-2xl font-bold">创建您的账户</h1>
                        <p class="text-sm text-gray-500 mt-2">
                            已经有账户了？
                            <router-link to="/login" class="text-primary">在此登入</router-link>
                        </p>
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
                                <el-input size="large" v-model="registerForm.checkPass" type="password"
                                    autocomplete="off" placeholder="请再次正确输入你的密码" class="inputbox" />
                            </el-form-item>
                            <el-form-item class="terms-section">
                                <el-checkbox v-model="agreed" size="small">
                                    已阅读并同意 <span class="terms-link" @click.prevent="openTerms">《服务条款》</span>
                                </el-checkbox>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="register"
                                    class="text-sm h-[40px] w-[350px] mt-2 mb-8">
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
            this.$confirm('<div class="terms-content">具体条款内容...</div>', '服务条款', {
                confirmButtonText: '同意条款',
                cancelButtonText: '暂不同意',
                dangerouslyUseHTMLString: true,
                customClass: 'terms-dialog',
                beforeClose(action, instance, done) {
                    if (action === 'confirm') {
                        this.agreed = true;
                    }
                    done();
                }
            });
        }
    },
};
</script>
<style scoped>
/* 背景容器 */
.wrapper {
    position: relative;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, #000000, #1a1a1a);
    overflow: hidden;
}

/* 三角气泡背景 */
.bg-bubbles {
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

.bg-bubbles li {
    position: absolute;
    display: block;
    width: 40px;
    height: 40px;
    background-color: hsla(0, 0%, 100%, .15);
    bottom: -160px;
    animation: triangle 25s infinite;
    transition-timing-function: linear;
    clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
    will-change: transform;
}

/* 气泡个性设置 */
.bg-bubbles li:nth-child(1) {
    left: 10%;
    animation-delay: 1s
}

.bg-bubbles li:nth-child(2) {
    left: 20%;
    width: 60px;
    height: 60px;
    animation-delay: 3s;
    animation-duration: 20s;
}

.bg-bubbles li:nth-child(3) {
    left: 30%;
    animation-delay: 5s;
    clip-path: polygon(30% 0%, 70% 0%, 50% 100%);
}

.bg-bubbles li:nth-child(4) {
    left: 45%;
    width: 50px;
    height: 50px;
    animation-duration: 22s;
}

.bg-bubbles li:nth-child(5) {
    left: 60%;
    animation-delay: 2s;
}

.bg-bubbles li:nth-child(6) {
    left: 75%;
    width: 80px;
    height: 80px;
    animation-delay: 4s;
}

.bg-bubbles li:nth-child(7) {
    left: 85%;
    width: 100px;
    height: 100px;
    animation-delay: 6s;
}

.bg-bubbles li:nth-child(8) {
    left: 5%;
    width: 120px;
    height: 120px;
    animation-delay: 8s;
}

.bg-bubbles li:nth-child(9) {
    left: 50%;
    animation-delay: 10s;
}

.bg-bubbles li:nth-child(10) {
    left: 65%;
    animation-delay: 12s;
}

/* 关键帧动画 */
@keyframes triangle {
    0% {
        transform: translateY(0) rotate(0deg);
        opacity: 1;
    }

    80% {
        transform: translateY(-800px) rotate(720deg);
        opacity: 0.8;
    }

    100% {
        transform: translateY(-1000px) rotate(900deg);
        opacity: 0;
    }
}

/* 注册表单容器 */
.form-container {
    position: relative;
    z-index: 2;
    width: 100%;
    max-width: 380px;
    padding: 10px;
}

.register-card {
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.98);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.header-section {
    padding: 16px 0;
    margin-bottom: 8px;
}

/* 表单元素样式 */
:deep(.el-form-item) {
    margin-bottom: 8px;
}

:deep(.el-form-item__label) {
    font-weight: 500;
    color: #000000;
    margin-bottom: 4px;
    padding-bottom: 0;
    line-height: 1.5;
}

:deep(.el-input__inner) {
    height: 36px;
    border-radius: 6px;
}

.register_form {
    padding: 0 20px;
}

.terms-section {
    margin: 8px 0;
}

.terms-link {
    color: #1a1a1a;
    cursor: pointer;

    &:hover {
        color: #000000;
        text-decoration: underline;
    }
}

:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
    background-color: #1a1a1a;
    border-color: #1a1a1a;
}

:deep(.el-checkbox__inner:hover) {
    border-color: #1a1a1a;
}

:deep(.el-button--primary) {
    background: #1a1a1a;
    border: none;
    margin-bottom: 16px;

    &:hover {
        background: #000000;
    }
}

.verify-btn {
    width: 120px;
    background: #000000;
    color: white;
    transition: all 0.3s;

    &:hover {
        background: #000000;
    }

    &:disabled {
        background: #0c0d0e;
    }
}

.register-btn {
    width: 100%;
    height: 48px;
    background: linear-graent(45deg, #1a1d20, #0f1113);
    border: none;
    border-radius: 8px;
    font-size: 16px;
    transition: all 0.3s;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    }
}

/* 响应式调整 */
@media (max-width: 480px) {
    .form-container {
        padding: 10px;
        max-width: 340px;
    }

    .register-card {
        margin: 0;
    }

    .bg-bubbles li {
        animation-duration: 18s;
    }
}
</style>
