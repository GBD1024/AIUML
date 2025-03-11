<template>
  <!-- 必须只有一个根元素 -->
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <!-- 登录表单容器 -->
    <div class="bg-white p-8 rounded-lg shadow-md w-96">
      <h1 class="text-2xl font-bold mb-6 text-gray-800">用户登录</h1>

      <!-- 登录表单 -->
      <form @submit.prevent="handleSubmit">
        <!-- 用户名输入 -->
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">用户名</label>
          <input
              v-model="username"
              type="text"
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
          />
        </div>

        <!-- 密码输入 -->
        <div class="mb-6">
          <label class="block text-gray-700 mb-2">密码</label>
          <input
              v-model="password"
              type="password"
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
          />
        </div>

        <!-- 提交按钮 -->
        <button
            type="submit"
            class="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
        >
          登录
        </button>
      </form>

      <!-- 注册导航 -->
      <div class="mt-6 text-center">
        <span class="text-gray-600">没有账号？</span>
        <router-link
            to="/register"
            class="text-blue-500 hover:underline"
        >
          立即注册
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    handleSubmit() {
      // 实际开发中替换为你的登录逻辑
      console.log('登录提交:', {
        username: this.username,
        password: this.password
      })

      // 模拟登录成功跳转
      this.$router.push('/diagram')
    }
  }
}
</script>

<style scoped>
/* 可添加自定义样式（Tailwind 已通过类名实现基础样式） */
</style>