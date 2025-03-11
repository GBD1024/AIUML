<template>
  <div class="settings-container">
    <el-button type="primary" icon="el-icon-arrow-left" @click="handleBack" class="back-btn">返回</el-button>

    <h2 class="title">账户信息</h2>
    <el-divider />

    <!-- 头像修改 -->
    <el-card shadow="always" class="card">
      <div slot="header" class="card-header">头像修改</div>
      <el-upload class="avatar-uploader" action="/api/user/uploadPic" :headers="{ Authorization: token }"
        :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
        <img v-if="imageUrl" :src="imageUrl" class="avatar">
        <el-avatar v-else :src="avatar" icon="el-icon-user-solid" class="avatar"></el-avatar>
      </el-upload>
    </el-card>

    <!-- 基本信息修改 -->
    <el-card shadow="always" class="card">
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

    <!-- 修改密码部分 -->
    <el-card shadow="always" class="card">
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
  width: 800px;
  margin: 20px auto;
}

.title {
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: bold;
}

.card {
  margin-bottom: 20px;
}

.card-header {
  font-size: 18px;
  font-weight: bold;
}

.avatar {
  width: 125px;
  height: 125px;
}

.back-btn {
  margin-bottom: 20px;
}
</style>