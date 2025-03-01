<!-- GBD/src/components/icon/Cube.vue -->
<template>
    <svg class="svg-node" viewBox="0 0 32 32">
      <g transform="translate(0.5,0.5)" style="visibility: visible">
        <!-- 正面 -->
        <path
          d="M 8 12 L 24 12 L 24 28 L 8 28 Z"
          fill="none"
          stroke="#000000"
          stroke-width="1.3"
          pointer-events="all"
        />
        <!-- 顶面 -->
        <path
          d="M 8 12 L 16 4 L 32 4 L 24 12 Z"
          fill="none"
          stroke="#000000"
          stroke-width="1.3"
        />
        <!-- 侧面 -->
        <path
          d="M 24 12 L 32 4 L 32 20 L 24 28 Z"
          fill="none"
          stroke="#000000"
          stroke-width="1.3"
        />
      </g>
    </svg>
  </template>
  
  <script>
  export default {
    name: 'IconCube'
  }
  </script>
  
  <style scoped>
  .svg-node {
    display: inline-block;
    vertical-align: middle;
    width: 32px;
    height: 32px;
  }
  </style>