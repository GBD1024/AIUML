<template>
  <div class="navbar">
    <button class="navbar-btn">文件</button>
    <button class="navbar-btn">编辑</button>
    <button class="navbar-btn">查看</button>
    <button class="navbar-btn">帮助</button>
    <button class="navbar-btn">分享</button>
  </div>
</template>

<script>
export default {
  name: 'Navbar'
}
</script>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  background-color: #e5e5e5;
  height: 50px;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 20;
}

.navbar-btn {
  background-color: transparent;
  border: none;
  color: #0c0c0c;
  font-size: 16px;
  padding: 10px 15px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-right: 50px;
}

.navbar-btn:hover {
  background-color: #efefef;
}
</style>
