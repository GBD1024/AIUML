<!-- src/components/Register.vue -->
<template>
  <div class="register-container">
    <h1>注册</h1>
    <form @submit.prevent="handleSubmit">
      <!-- 表单内容 -->
    </form>
    <p>已有账号？<router-link to="/login">去登录</router-link></p>
  </div>
</template>