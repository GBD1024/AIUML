<template>
    <div class="swimlane-container">
      <!-- 大矩形背景 -->
      <div class="large-rectangle"></div>
      <!-- 小矩形（可编辑文本） -->
      <div
        class="small-rectangle"
        contenteditable="true"
        @click="handleClick"
        @input="updateText"
        @keydown.native.stop
        @blur="onBlur"
        @paste.native.prevent
      >
        {{ text }}
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Swimlane',
    data() {
      return {
        text: '小矩形文本', // 默认文本
      };
    },
    methods: {
      updateText(event) {
        this.text = event.target.textContent;
      },
      handleClick() {
        console.log('Clicked on swimming lane');
      },
      onBlur() {
        console.log('编辑完成');
      },
    },
  };
  </script>
  
  <style scoped>
  .swimlane-container {
    position: relative;
    width: 600px;
    height: 400px;
    margin: 20px;
  }
  
  .large-rectangle {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #e0e0e0;
    border: 2px solid #999;
    border-radius: 4px;
  }
  
  .small-rectangle {
    position: absolute;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    width: 150px;
    height: 50px;
    background-color: #ffffff;
    border: 1px solid #000;
    border-radius: 4px;
    padding: 10px;
    box-sizing: border-box;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    font-family: Arial, sans-serif;
    font-size: 14px;
    color: #333;
    cursor: text;
    pointer-events: auto; /* 允许鼠标事件 */
    z-index: 1;
  }
  
  /* 悬停样式 */
  .small-rectangle:hover {
    border-color: #666;
  }
  
  /* 编辑时样式 */
  .small-rectangle:focus {
    outline: none;
    border-color: #4a90e2;
    box-shadow: 0 0 4px #4a90e2;
  }
  </style>