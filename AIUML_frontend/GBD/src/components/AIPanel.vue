<script setup>
/* eslint-disable no-unused-vars */
import { ref } from 'vue'

// 控制侧边栏显示状态的响应式变量
const isSidebarVisible = ref(false)

// 模拟AI对话内容
const aiMessage = ref('你好！我可以帮助你生成UML、代码或解释代码。请选择以下功能：')

// 模拟用户输入
const userInput = ref('')
</script>

<template>
  <div class="ai-panel-container">
    <!-- 添加一个圆形按钮用于切换侧边栏 -->
    <button
      @click="isSidebarVisible = !isSidebarVisible"
      :class="['toggle-sidebar-btn', { 'rotate-btn': isSidebarVisible }]"
    >
      <span v-if="isSidebarVisible">X</span> <!-- 侧边栏显示时显示 "X" -->
      <span v-else>AI</span> <!-- 默认状态下显示 "AI" -->
    </button>

    <!-- 弹出的边框(侧边栏) -->
    <aside :class="{ sidebar: true, 'sidebar-show': isSidebarVisible }">
      <!-- 上半部分：与AI的对话框 -->
      <div class="ai-dialog">
        <p>{{ aiMessage }}</p>
      </div>

      <!-- 中间部分：三个功能按钮 -->
      <div class="button-group">
        <button class="func-btn" @click="aiMessage = '请输入文本...'">生成UML</button>
        <button class="func-btn" @click="aiMessage = '正在生成代码...'">生成代码</button>
        <button class="func-btn" @click="aiMessage = '正在解释代码...'">代码解释</button>
      </div>

      <!-- 下半部分：用户对话框 -->
      <div class="user-dialog">
        <textarea
          v-model="userInput"
          placeholder="请输入你的问题或代码..."
          class="user-input"
        ></textarea>
        <button class="submit-btn" @click="aiMessage = '提交成功！正在生成UML图！'">提交</button>
        </div>
    </aside>
  </div>
</template>

<style scoped>
.ai-panel-container {
  display: flex;
  align-items: flex-start; /* 确保子元素垂直对齐 */
}

/* 圆形按钮样式 */
.toggle-sidebar-btn {
  position: fixed;
  top: 100px;
  right: 20px;
  z-index: 2; /* 确保按钮在其他内容之上 */
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(45deg, #f5f2f2, #f2f5f6); /* 渐变色背景 */
  color: #070000;
  border: none;
  outline: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease-in-out; /* 平滑过渡 */
  font-size: 20px; /* 调整字体大小 */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2); /* 添加阴影 */
}

/* 按钮悬停效果 */
.toggle-sidebar-btn:hover {
  transform: scale(1.1); /* 悬停时放大 */
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.3); /* 悬停时阴影加深 */
}

/* 按钮点击旋转效果 */
.rotate-btn {
  transform: rotate(90deg); /* 点击时旋转 */
}

.sidebar {
  width: 350px; /* 更宽的侧边栏 */
  height: 100%;
  position: fixed;
  top: 0;
  right: -400px; /* 默认隐藏 */
  background-color: #f4f4f4;
  transition: right 0.3s ease-in-out;
  overflow-x: hidden;
  padding: 20px;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.2);
  z-index: 1; /* 确保侧边栏在其他内容之上 */
  display: flex;
  flex-direction: column;
}

.sidebar.sidebar-show {
  right: 0; /* 显示时的位置 */
}

/* AI对话框样式 */
.ai-dialog {
  background-color: #ffffff;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  margin-top: 100px;
  flex: 3; /* 占侧边栏的四分之三 */
  display: flex;
  align-items: center;
  justify-content: center;
}

.ai-dialog p {
  margin: 0;
  font-size: 16px;
  color: #333;
  text-align: center;
}

/* 功能按钮组样式 */
.button-group {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 20px;
}

.func-btn {
  background-color: #e5e5e5;
  color: #000000;
  border: none;
  border-radius: 5px;
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  flex: 1; /* 按钮平均分配宽度 */
}

.func-btn:hover {
  background-color: #c8c8c8;
}

/* 用户对话框样式 */
.user-dialog {
  margin-top: auto; /* 将用户对话框推到最下面 */
}

.user-input {
  width: 100%;
  height: 80px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  resize: none;
  font-size: 14px;
  margin-bottom: 10px;
}

.submit-btn {
  width: 100%;
  background-color: #e5e5e5;
  color: #000000;
  border: none;
  border-radius: 5px;
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-bottom: 50px;
}

.submit-btn:hover {
  background-color: #c8c8c8;
}
</style>