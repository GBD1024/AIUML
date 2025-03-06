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
        <button class="func-btn" @click="selectedAction = 'generateUML'">生成UML</button>
        <button class="func-btn" @click="selectedAction = 'generateCode'">生成代码</button>
        <button class="func-btn" @click="selectedAction = 'explainCode'">代码解释</button>
      </div>

      <!-- 下半部分：用户对话框 -->
      <div class="user-dialog">
        <textarea
          v-model="userInput"
          placeholder="请输入你的问题或代码..."
          class="user-input"
        ></textarea>
        <button class="submit-btn" @click="handleSubmit">提交</button>
      </div>
    </aside>
  </div>
</template>

<script>
export default {
  props: {
    // 父组件传递的获取UML数据方法
    getUMLData: Function
  },

  data() {
    return {
      // 侧边栏可见状态
      isSidebarVisible: false,

      // AI对话内容
      aiMessage: '你好！我可以帮助你生成 UML、代码或解释代码。请选择以下功能：',

      // 用户输入内容
      userInput: '',

      // 当前选中的操作类型
      selectedAction: ''
    };
  },

  methods: {
    // 切换侧边栏显示状态
    toggleSidebar() {
      this.isSidebarVisible = !this.isSidebarVisible;
    },

    // 选择功能类型
    selectAction(action) {
      this.selectedAction = action;
    },

    // 处理表单提交
    handleSubmit() {
      if (!this.userInput.trim()) {
        this.aiMessage = '请输入有效的内容！';
        return;
      }

      let url = '';
      let dataToSend = {};

      switch (this.selectedAction) {
        case 'generateUML':
          this.aiMessage = `正在生成 UML 图...\n用户输入：${this.userInput}`;
          url = 'http://localhost:8081/aiuml/generateUML';
          dataToSend = {
            type: 'generateUML',
            content: this.userInput
          };
          break;
        case 'generateCode':
          this.aiMessage = `正在生成代码...\n用户输入：${this.userInput}`;
          url = 'http://localhost:8081/aiuml/generateCode';
          dataToSend = {
            type: 'generateCode',
            content: this.userInput,
            umlData: this.getUMLData()
          };
          break;
        case 'explainCode':
          this.aiMessage = `正在解释代码...\n用户输入：${this.userInput}`;
          url = 'http://localhost:8081/aiuml/explainCode';
          dataToSend = {
            type: 'explainCode',
            content: this.userInput
          };
          break;
        default:
          this.aiMessage = '请选择一个功能后再提交！';
          return;
      }

      this.userInput = ''; // 清空输入框

      this.submitRequest(url, dataToSend);
    },

    // 发送网络请求
    submitRequest(url, data) {
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
        .then(response => response.json())
        .then(this.handleResponse)
        .catch(this.handleError);
    },

    // 处理成功响应
    handleResponse(responseData) {
      this.aiMessage = `后端返回的数据：\n${JSON.stringify(responseData, null, 2)}`;
    },

    // 处理错误响应
    handleError(error) {
      this.aiMessage = '提交失败！请检查网络连接或后端服务。';
      console.error('提交失败:', error);
    }
  }
};
</script>

<style scoped>
.ai-panel-container {
  display: flex;
  align-items: flex-start;
}
.toggle-sidebar-btn {
  position: fixed;
  top: 100px;
  right: 20px;
  z-index: 2;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(45deg, #f5f2f2, #f2f5f6);
  color: #070000;
  border: none;
  outline: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease-in-out;
  font-size: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}
.toggle-sidebar-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.3);
}
.rotate-btn {
  transform: rotate(90deg);
}
.sidebar {
  width: 350px;
  height: 100%;
  position: fixed;
  top: 0;
  right: -400px;
  background-color: #f4f4f4;
  transition: right 0.3s ease-in-out;
  overflow-x: hidden;
  padding: 20px;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.2);
  z-index: 1;
  display: flex;
  flex-direction: column;
}
.sidebar.sidebar-show {
  right: 0;
}
.ai-dialog {
  background-color: #ffffff;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  margin-top: 100px;
  flex: 3;
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
  flex: 1;
}
.func-btn:hover {
  background-color: #c8c8c8;
}
.user-dialog {
  margin-top: auto;
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