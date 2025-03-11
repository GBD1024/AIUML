<template>
  <div class="container">
    <router-view />  <!-- 🚀 这里决定渲染哪个页面 -->
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
html, body {
  height: 100%;
}
body {
  padding: 0;
  margin: 0;
}
</style>
<style scoped>
.container {
  background-color: #f8f9fa;
  height: 100%;
}
</style>
