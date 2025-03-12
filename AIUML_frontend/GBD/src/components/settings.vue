<template>
  <div class="settings-container">
    <div class="header-section">
      <el-button type="text" icon="el-icon-arrow-left" @click="handleBack" class="back-btn">返回</el-button>
      <h2 class="title">账户信息</h2>
    </div>
    <el-divider class="custom-divider" />


    <div class="card-container">

    <!-- 头像修改 -->
    <el-card shadow="hover" class="settings-card">
      <div slot="header" class="card-header">头像修改</div>
      <el-upload class="avatar-uploader" action="/api/user/uploadPic" :headers="{ Authorization: token }"
        :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
        <img v-if="imageUrl" :src="imageUrl" class="avatar">
        <el-avatar v-else :src="avatar" icon="el-icon-user-solid" class="avatar"></el-avatar>
      </el-upload>
    </el-card>

        <!-- 基本信息修改 -->
      <el-card shadow="always" class="card2">
      <div slot="header" class="card-header">基本信息</div>
      <el-form :model="basicInfoForm" ref="basicInfoForm" label-width="80px">
        <el-form-item label="账户">
          <el-input v-model="passForm.userId" disabled></el-input>
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="basicInfoForm.nickname"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitNickname">确认修改</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    </div>
    
    <!-- 修改密码部分 -->
    <el-card shadow="always" class="card1">
      <div slot="header" class="card-header">修改密码</div>
      <el-form :model="passForm" ref="passForm" label-width="100px" :rules="rules">
        <el-form-item label="当前账户" prop="userId">
          <el-input v-model="passForm.userId" disabled></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="verifyCode">
          <el-input v-model="passForm.verifyCode">
            <el-button slot="append" @click="sendVerifyCode" :disabled="!canSend">
              {{ canSend ? '获取' : timer + ' s' }}
            </el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="pass">
          <el-input type="password" v-model="passForm.pass"></el-input>
        </el-form-item>
        <el-form-item label="重复新密码" prop="checkPass">
          <el-input type="password" v-model="passForm.checkPass"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitPassword">确认修改</el-button>
        </el-form-item>
      </el-form>
    </el-card>






  </div>
</template>

<script>
import axios from 'axios';
import getUserInfo from '@/api/getUserInfo'; // 引入优化后的getUserInfo

export default {
  data() {
    return {
      rules: {
        verifyCode: [
          { required: true, message: '验证码不能为空', trigger: 'blur' }
        ],
        pass: [
          { required: true, message: '新密码不能为空', trigger: 'blur' },
          { min: 6, max: 20, message: '密码长度在6-20位之间', trigger: 'blur' }
        ],
        checkPass: [
          { required: true, message: '确认密码不能为空', trigger: 'blur' },
          { min: 6, max: 20, message: '密码长度在6-20位之间', trigger: 'blur' },
          {
            validator: (rule, value) => value === this.passForm.pass,
            message: '两次输入的密码不一致', trigger: 'blur'
          }
        ]
      },
      token: localStorage.getItem('token'),
      avatar: '',
      imageUrl: '',
      passForm: { userId: '', verifyCode: '', pass: '', checkPass: '' },
      timer: 0,
      canSend: true,
      basicInfoForm: {  // ← 新增
        nickname: '',     // 初始化为空字符串
        userId: ''      // 根据接口数据结构调整
      },
    };
  },
  methods: {
    handleAvatarSuccess(response) {
      if (!response.code) {
        this.imageUrl = response.info;
        this.$message.success('头像修改成功');
      } else {
        this.$message.error('头像修改失败');
      }
    },
    beforeAvatarUpload(file) {
      const isValidFormat = ['image/jpeg', 'image/png'].includes(file.type);
      const isValidSize = file.size / 1024 / 1024 < 4;
      if (!isValidFormat) {
        this.$message.error('仅支持 JPG 或 PNG 格式');
        return false;
      }
      if (!isValidSize) {
        this.$message.error('图片大小不能超过4MB');
        return false;
      }
      return true;
    },
    async submitNickname() {
      try {
        const response = await axios.post('/api/user/updateNickname', {
          nickname: this.basicInfoForm.nickname,
        }, {
          headers: {
            Authorization: this.token // 确保 token 已经从 localStorage 中获取
          }
        });

        if (response.data && response.data.code === 0) { // 假设成功状态码为0
          this.$message.success('昵称更新成功');
        } else {
          this.$message.error(`昵称更新失败: ${response.data.message}`);
        }
      } catch (error) {
        console.error('提交昵称更新失败:', error);
        this.$message.error('昵称更新失败，请稍后再试');
      }
    },
    // 发送验证码
    async sendVerifyCode() {
      if (!this.canSend) return;
      this.canSend = false;
      this.timer = 60; // 设置倒计时时间
      const countdown = setInterval(() => {
        this.timer--;
        if (this.timer <= 0) {
          clearInterval(countdown);
          this.canSend = true;
        }
      }, 1000);

      try {
        const response = await axios.get('/api/user/getUpdatePwdCode', {
          params: {
            userId: this.passForm.userId,
          },
          headers: {
            Authorization: this.token, // 确保 token 已经从 localStorage 中获取
          }
        });

        if (response.data && response.data.code === 0) { // 假设成功状态码为0
          this.$message.success('验证码已发送，请查收邮箱');
        } else {
          this.$message.error(`验证码发送失败: ${response.data.message}`);
          this.canSend = true; // 如果发送失败，重置倒计时按钮
        }
      } catch (error) {
        console.error('发送验证码失败:', error);
        this.$message.error('验证码发送失败，请稍后再试');
        this.canSend = true; // 如果发送失败，重置倒计时按钮
      }
    },

    // 提交新密码
    async submitPassword() {
      if (this.passForm.pass !== this.passForm.checkPass) {
        this.$message.error('两次密码输入不一致');
        return;
      }

      try {
        const response = await axios.put('/api/user/newUpdatePwd', this.passForm, {
          headers: {
            Authorization: this.token, // 确保 token 已经从 localStorage 中获取
          }
        });

        if (response.data && response.data.code === 0) { // 假设成功状态码为0
          this.$message.success('密码更新成功，请重新登录');
          localStorage.removeItem('token');
          // 立即跳转登录页（新增）
          this.$router.push('/login');

          // 清除表单数据（可选）
          this.passForm = {
            userId: '',
            verifyCode: '',
            pass: '',
            checkPass: ''
          };
          this.passwordChanged = true;
        } else {
          this.$message.error(`密码更新失败: ${response.data.message}`);
        }
      } catch (error) {
        console.error('提交密码更新失败:', error);
        if (error.response) {
          console.error('服务器响应:', error.response.data);
          console.error('状态码:', error.response.status);
          console.error('响应头:', error.response.headers);
          this.$message.error(`密码更新失败: ${error.response.data.message || '未知错误'}`);
        } else if (error.request) {
          console.error('请求未得到响应:', error.request);
          this.$message.error('请求未得到响应，请检查网络连接');
        } else {
          console.error('请求设置错误:', error.message);
          this.$message.error('请求设置错误，请稍后再试');
        }
      }
    },
    // 在fetchUserInfo方法中添加初始化逻辑
    async fetchUserInfo() {
      try {
        const info = await getUserInfo(this.token, axios);
        this.avatar = info.user_pic;
        this.basicInfoForm.nickname = info.nickname || ''; // 添加默认值
        this.passForm.userId = info.user_name || '';
      } catch (error) {
        console.error('获取用户信息失败:', error);
        // 初始化表单防止undefined错误
        this.basicInfoForm = { nickname: '', userId: '' };
        this.passForm = { userId: '', verifyCode: '', pass: '', checkPass: '' };
      }
    },
    handleBack() {
      // 直接返回主页，不再检查passwordChanged状态
      this.$router.push('/diagram');
    }
  },
  mounted() {
    this.fetchUserInfo();
  }
};
</script>

<style scoped>
.settings-container {
  max-width: 100%;
  margin: 0px auto;
  padding: 0 20px;
  position:relative;
}

.card1 {
  border-radius: 8px;
  margin-top: 10px;
  display: inline-block;
  margin-left: 30px;
  width: 48%;
  position: absolute;
  margin-top:0px;
  right: 20px;
  height: 88%;
}

.card2 {
  border-radius: 8px;
  margin-top: 20px;
}

.card-container {
  display: inline-block;
  width: 48%;
}

.header-section {
  padding-top: 20px;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  position: relative;
  justify-content: center;
}

.title {
  margin: 0;
  font-size: 22px;
  font-weight: 500;
  color: #303133;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.settings-card {
  display: inline-block;
  width: 100%;
  margin-bottom: 0px;
  border-radius: 8px;
  transition: all 0.3s ease;
  border: 1px solid #ebeef5;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.settings-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.08);
}

.card-header {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
  border-bottom: 1px solid #ebeef5;
  padding-bottom: 12px;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 2px solid #f5f5f5;
  transition: all 0.3s ease;
}

.avatar:hover {
  border-color: #303133;
}

.back-btn {
  position: absolute;
  left: 0;
  padding: 8px 12px;
  font-size: 15px;
  color: #606266;
  background-color: transparent;
  border-radius: 6px;
  transition: all 0.3s ease;
  border: none;
  z-index: 1;
}

.back-btn:hover {
  color: #303133;
  background-color: #f2f3f5;
}

.custom-divider {
  margin: 0 0 24px 0;
  background-color: #ebeef5;
}

:deep(.el-input__inner) {
  height: 40px;
  line-height: 40px;
  border-radius: 4px;
  border-color: #dcdfe6;
  transition: all 0.3s ease;
}

:deep(.el-input__inner:hover) {
  border-color: #303133;
}

:deep(.el-input__inner:focus) {
  border-color: #303133;
}

:deep(.el-form-item) {
  margin-bottom: 22px;
}

:deep(.el-form-item__label) {
  color: #606266;
  font-weight: 500;
}

:deep(.el-button--primary) {
  height: 40px;
  padding: 0 24px;
  font-size: 14px;
  background-color: #303133!important;
  border-color: #303133!important;
  transition: all 0.3s ease;
}

:deep(.el-button--primary:hover) {
  background-color: #000000;
  border-color: #000000;
  transform: translateY(-1px);
}

:deep(.el-button--primary:active) {
  background-color: #000000;
  border-color: #000000;
  transform: translateY(0);
}

:deep(.avatar-uploader) {
  text-align: center;
  padding: 24px 0;
}

:deep(.el-input-group__append) {
  background-color: #f5f5f5;
  border-color: #dcdfe6;
  color: #303133;
  transition: all 0.3s ease;
}

:deep(.el-input-group__append:hover) {
  background-color: #303133;
  border-color: #303133;
  color: #ffffff;
}

:deep(.el-input.is-disabled .el-input__inner) {
  background-color: #f8f9fa;
  border-color: #e9ecef;
  color: #909399;
}
</style>