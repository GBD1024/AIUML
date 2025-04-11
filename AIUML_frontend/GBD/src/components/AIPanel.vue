<template>
  <div class="ai-panel-container">
    <!-- 圆形切换按钮（保持原样） -->
    <button @click="isSidebarVisible = !isSidebarVisible"
      :class="['toggle-sidebar-btn', { 'rotate-btn': isSidebarVisible }]">
      <span v-if="isSidebarVisible">X</span>
      <span v-else>AI</span>
    </button>

    <!-- 侧边栏内容 -->
    <aside :class="{ sidebar: true, 'sidebar-show': isSidebarVisible }">
      <!-- 上半部分：与AI的对话框（保持原样） -->
      <div class="ai-dialog" v-html="renderMarkdown(aiMessage)"></div>


      <!-- 中间部分：三个功能按钮 -->
      <!-- 功能按钮组：添加 isLoading 禁用控制 -->
      <div class="button-group">
        <button :class="['func-btn', { 'active': selectedAction === 'generateUML', 'disabled': isLoading }]"
          @click="!isLoading && (selectedAction = 'generateUML')" :disabled="isLoading">生成UML</button>

        <button :class="['func-btn', { 'active': selectedAction === 'generateCode', 'disabled': isLoading }]"
          @click="!isLoading && (selectedAction = 'generateCode')" :disabled="isLoading">生成代码</button>

        <button :class="['func-btn', { 'active': selectedAction === 'explainCode', 'disabled': isLoading }]"
          @click="!isLoading && (selectedAction = 'explainCode')" :disabled="isLoading">代码解释</button>
      </div>





      <!-- 下半部分：用户对话框 -->
      <!-- 用户输入区域 -->
      <div style="position: relative;">
        <textarea v-model="userInput" placeholder="请输入你的问题或代码..." class="user-input" :disabled="isLoading"></textarea>

        <!-- ✨ 遮罩和按钮放一起，并使用 pointer-events 管控 -->
        <div v-if="isLoading" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0;
              background: rgba(0, 0, 0, 0.12); z-index: 20;
              display: flex; align-items: flex-end; justify-content: center; padding-bottom: 20px;
              pointer-events: none;">
          <button @click="confirmCancel" style="pointer-events: auto;
                   padding: 12px 24px; border: 2px solid #000;
                   background: white; color: #000; font-weight: bold;
                   font-size: 16px; border-radius: 8px; cursor: pointer;
                   box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);">
             取消生成
          </button>
        </div>

        <button class="submit-btn" @click="handleSubmit" :disabled="isLoading">
          {{ isLoading ? '加载中...' : '提交' }}
        </button>
      </div>


    </aside>
  </div>
</template>

<script>
import { marked } from 'marked';
export default {
  props: {
    getUMLData: Function
  },
  data() {
    return {
      isLoading: false,
      abortController: null,


      lfInstance: null,
      isSidebarVisible: false,
      aiMessage: '你好！我可以帮助你生成 UML、代码或解释代码。请选择以下功能：',
      userInput: '',
      selectedAction: ''
    };
  },
  methods: {
    setLogicFlowInstance(lf) {
      this.lfInstance = lf;

      // 初始化 MiniMap 插件
      this.lfInstance.extension.miniMap.init({
        disabledPlugins: [], // 可禁用某些插件
      });
    },
    renderMarkdown(text) {
      return marked.parse(text || '');
    },
    toggleSidebar() {
      this.isSidebarVisible = !this.isSidebarVisible;
    },
    handleSubmit() {
      if (!this.userInput.trim()) {
        this.aiMessage = '请输入有效的内容！';
        return;
      }

      if (!this.selectedAction) {
        this.aiMessage = '请选择一个功能后再提交！';
        return;
      }

      this.isLoading = true;

      let url = '';
      let dataToSend = {};

      switch (this.selectedAction) {
        case 'generateUML':
          this.aiMessage = `正在生成 UML 图...\n用户输入：${this.userInput}`;
          url = 'api/aiuml/generateUML';
          dataToSend = {
            type: 'generateUML',
            content: this.userInput,
            umlData: this.getUMLData()
          };
          break;
        case 'generateCode':
          this.aiMessage = `正在生成代码...\n用户输入：${this.userInput}`;
          url = 'api/aiuml/generateCode';
          dataToSend = {
            type: 'generateCode',
            content: this.userInput,
            umlData: this.getUMLData()
          };
          break;
        case 'explainCode':
          this.aiMessage = `正在解释代码...\n用户输入：${this.userInput}`;
          url = 'api/aiuml/explainCode';
          dataToSend = {
            type: 'explainCode',
            content: this.userInput
          };
          break;
      }

      this.userInput = '';
      this.submitRequest(url, dataToSend);
    },

    submitRequest(url, data) {
      this.abortController = new AbortController(); // 创建中断控制器
      const signal = this.abortController.signal;

      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify(data),
        signal // ✅ 传入 signal
      })
        .then(response => response.json())
        .then(this.handleResponse)
        .catch(err => {
          if (err.name === 'AbortError') {
            this.aiMessage = '❌ 请求已取消';
          } else {
            this.handleError(err);
          }
        })
        .finally(() => {
          this.isLoading = false;
          this.abortController = null;
        });
    },
    cancelRequest() {
      if (this.abortController) {
        this.abortController.abort();
      }
    },
    confirmCancel() {
      this.$confirm?.('生成过程可能较慢，确定要取消吗？', '确认取消', {
        confirmButtonText: '确定',
        cancelButtonText: '继续等待',
        type: 'warning'
      }).then(() => {
        this.cancelRequest();
      }).catch(() => {
        // 用户点了“继续等待”，不做任何事
      });
    },

    handleResponse(responseData) {
      switch (this.selectedAction) {
        case 'generateUML':
          this.aiMessage = "正在生成UML，请耐心等待";
          if (this.lfInstance) {
            const savedData = responseData.info;
            console.log(savedData);
            if (savedData) {
              this.lfInstance.render(savedData);
              this.aiMessage = "UML图已绘制";
            } else {
              this.aiMessage = "⚠ 无数据可渲染";
            }
          } else {
            alert("⚠ 画布未初始化！");
            this.aiMessage = "⚠ 渲染失败，画布未初始化";
          }
          break;
        case 'generateCode':
          this.aiMessage = responseData.info;
          break;
        case 'explainCode':
          this.aiMessage = responseData.info;
      }
    },
    handleError(error) {
      this.aiMessage = '提交失败！请检查网络连接或后端服务。';
      console.error('提交失败:', error);
    }
  }
};
</script>

<style scoped>
/* 保持圆形按钮原有样式 */
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

/* 功能按钮样式修改 */
.func-btn {
  background-color: #e5e5e5;
  color: #000000;
  border: none;
  border-radius: 5px;
  padding: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
}

/* 选中状态保持黑色 */
.func-btn.active {
  background-color: #000 !important;
  color: white !important;
}

/* 点击瞬间效果 */
.func-btn:active {
  background-color: #333 !important;
}

/* 提交按钮样式 */
.submit-btn {
  width: 100%;
  background-color: #e5e5e5;
  color: #000000;
  border: none;
  border-radius: 5px;
  padding: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 50px;
}

/* 提交按钮点击效果 */
.submit-btn:active {
  background-color: #000 !important;
  color: white !important;
}

/* 保持原有hover效果 */
.func-btn:hover,
.submit-btn:hover {
  background-color: #c8c8c8;
}

/* 其他原有样式保持不变 */
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

  /* 使用块级布局，更灵活地控制内容显示 */
  display: block;

  /* 文本格式优化，保留空格、缩进和换行 */
  white-space: pre-wrap;
  text-align: left;

  /* 添加滚动条以应对内容溢出，提升用户体验 */
  overflow-y: auto;

  /* 设置合适的字体样式，更适合代码或长文本阅读 */
  font-family: Consolas, Monaco, 'Courier New', monospace;
  font-size: 15px;
  color: #333;
  line-height: 1.5;
  max-height: 400px;
  /* 防止内容过多时对话框无限拉伸 */
}


.ai-dialog p {
  margin: 0;
  font-size: 16px;
  color: #333;
  text-align: left;
}

.button-group {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 20px;
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

.func-btn.disabled,
.func-btn:disabled,
.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
  background-color: #ddd !important;
  color: #999 !important;
}
</style>