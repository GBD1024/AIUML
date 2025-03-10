<template>
  <div class="container">
    <router-view />
  </div>
</template>

<script>


export default {
  name: 'App',

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
  background-color: #ffffff;
  height: 100%;
}
</style>
