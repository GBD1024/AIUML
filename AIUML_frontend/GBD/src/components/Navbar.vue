<template>
  <div class="navbar">
    <!-- 文件按钮 -->
    <div 
      class="navbar-dropdown" 
      v-for="(button, index) in buttons" 
      :key="index"
      @click.stop
    >
      <button 
        class="navbar-btn" 
        @click="toggleDropdown(index)"
      >
        {{ button.label }}
      </button>
      <div 
        v-if="activeDropdownIndex === index" 
        class="dropdown-menu"
      >
        <button 
          v-for="(item, idx) in button.menuItems" 
          :key="idx" 
          @click="handleMenuItemClick(item.action)"
        >
          {{ item.label }}
        </button>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  name: 'Navbar',
  data() {
    return {
      // 当前展开的下拉菜单索引
      activeDropdownIndex: null,
      lfInstance: null,
      // 定义按钮及其对应的菜单项
      buttons: [
        {
          label: "文件",
          menuItems: [
            { label: "保存至缓存", action: "$_saveGraphToBrowser" },
            { label: "恢复缓存", action: "$_loadGraphFromBrowser" },
            { label: "清空缓存", action: "$_clearGraphBrowser" },
            { label: "保存至本地", action: "$_saveGraphToLocal" },
            { label: "导入本地文件", action: "$_importGraphFromFile" },
          ],
        },
        {
          label: "编辑",
          menuItems: [
            { label: "撤销", action: "$_undo" },
            { label: "重做", action: "$_redo" },
            { label: "复制", action: "$_copy" },
            { label: "粘贴", action: "$_paste" },
          ],
        },
        {
          label: "查看",
          menuItems: [
            { label: "放大", action: "$_zoomIn" },
            { label: "缩小", action: "$_zoomOut" },
            { label: "重置视图", action: "$_resetView" },
          ],
        },
        {
          label: "帮助",
          menuItems: [
            { label: "使用说明", action: "$_showHelp" },
            { label: "反馈问题", action: "$_reportIssue" },
          ],
        },
        {
          label: "分享",
          menuItems: [
            { label: "生成链接", action: "$_generateLink" },
            { label: "导出图片", action: "$_exportImage" },
          ],
        },
      ],
    };
  },
  methods: {
    // 切换指定按钮的下拉菜单状态
    toggleDropdown(index) {
      if (this.activeDropdownIndex === index) {
        // 如果当前按钮的下拉菜单已经展开，则收起
        this.activeDropdownIndex = null;
      } else {
        // 否则，收起其他按钮的下拉菜单，并展开当前按钮的下拉菜单
        this.activeDropdownIndex = index;
      }
    },

    // 处理菜单项点击事件
    handleMenuItemClick(action) {
      if (this[action]) {
        this[action]();
      } else {
        alert(`⚠ 方法 ${action} 未定义！`);
      }
    },

    // 示例方法：撤销
    $_undo() {
      alert("↩️ 撤销操作");
    },

    // 示例方法：重做
    $_redo() {
      alert("↪️ 重做操作");
    },

    // 示例方法：复制
    $_copy() {
      alert("📋 复制操作");
    },

    // 示例方法：粘贴
    $_paste() {
      alert("📋 粘贴操作");
    },

    // 示例方法：放大
    $_zoomIn() {
      alert("🔍 放大视图");
    },

    // 示例方法：缩小
    $_zoomOut() {
      alert("🔍 缩小视图");
    },

    // 示例方法：重置视图
    $_resetView() {
      alert("🔄 重置视图");
    },

    // 示例方法：使用说明
    $_showHelp() {
      alert("📖 显示使用说明");
    },

    // 示例方法：反馈问题
    $_reportIssue() {
      alert("⚠ 提交反馈问题");
    },

    // 示例方法：生成链接
    $_generateLink() {
      alert("🔗 生成分享链接");
    },

    // 示例方法：导出图片
    $_exportImage() {
      alert("🖼 导出图片");
    },

    // 原有方法保持不变...
    setLogicFlowInstance(lf) {
      this.lfInstance = lf;
    },

    $_saveGraphToBrowser() {
      if (this.lfInstance) {
        const data = this.lfInstance.getGraphData();
        localStorage.setItem("diagramData", JSON.stringify(data));
        alert("💾 图形已保存到浏览器缓存！");
      } else {
        alert("⚠ 画布未初始化！");
      }
    },

    $_saveGraphToLocal() {
      if (this.lfInstance) {
        const data = this.lfInstance.getGraphData();
        const jsonStr = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "logicflow-diagram.json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        alert("💾 图形已保存到本地！");
      } else {
        alert("⚠ 画布未初始化！");
      }
    },

    $_loadGraphFromBrowser() {
      if (this.lfInstance) {
        const savedData = localStorage.getItem("diagramData");
        if (savedData) {
          this.lfInstance.render(JSON.parse(savedData));
          alert("🔄 已恢复浏览器保存的绘图！");
        } else {
          alert("⚠ 没有可恢复的数据！");
        }
      } else {
        alert("⚠ 画布未初始化！");
      }
    },

    $_clearGraphBrowser() {
      if (confirm("确定要清空浏览器缓存的绘图吗？")) {
        localStorage.removeItem("diagramData");
        alert("🗑 本地存储的绘图已清空！");
      }
    },

    $_importGraphFromFile() {
      this.$refs.fileInput.click();
    },

    $_handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonData = JSON.parse(e.target.result);
          if (this.lfInstance) {
            this.lfInstance.render(jsonData);
            alert("📥 已成功导入文件并更新画布！");
          } else {
            alert("⚠ 画布未初始化！");
          }
        } catch (error) {
          alert("❌ 解析文件失败，请确保是正确的 JSON 格式！");
        }
      };
      reader.readAsText(file);
    },

    // 关闭所有下拉菜单
    closeDropdowns() {
      this.activeDropdownIndex = null;
    },
  },
  mounted() {
    // 监听全局点击事件
    window.addEventListener('click', this.closeDropdowns);
  },
  beforeDestroy() {
    // 移除全局点击事件监听
    window.removeEventListener('click', this.closeDropdowns);
  },
};
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

.navbar-dropdown {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: 40px;
  left: 0;
  background: white;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  z-index: 30;
  min-width: 100px; /* 固定宽度 */
}

.dropdown-menu button {
  padding: 8px 12px;
  border: none;
  background: white;
  cursor: pointer;
  text-align: left;
  font-size: 14px;
}

.dropdown-menu button:hover {
  background: #f0f0f0;
}
</style>
