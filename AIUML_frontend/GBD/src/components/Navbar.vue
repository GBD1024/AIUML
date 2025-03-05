<template>
  <div class="navbar">
    <!-- ✅ “文件”按钮（支持下拉菜单） -->
    <div class="navbar-dropdown">
      <button class="navbar-btn" @click="toggleDropdown">文件</button>
      <div v-if="dropdownVisible" class="dropdown-menu">
        <button @click="$_saveGraphToBrowser"> 保存至缓存</button>
        <button @click="$_loadGraphFromBrowser"> 恢复缓存</button>
        <button @click="$_clearGraphBrowser"> 清空缓存</button>
        <button @click="$_saveGraphToLocal"> 保存至本地</button>
        <button @click="$_importGraphFromFile"> 导入本地文件</button>
        <input type="file" ref="fileInput" @change="$_handleFileUpload" accept=".json,.txt" style="display: none;" />
      </div>
    </div>

    <button class="navbar-btn">编辑</button>
    <button class="navbar-btn">查看</button>
    <button class="navbar-btn">帮助</button>
    <button class="navbar-btn">分享</button>
  </div>
</template>

<script>
export default {
  name: 'Navbar',
  data() {
    return {
      dropdownVisible: false,
      lfInstance: null,
    };
  },
  methods: {
    toggleDropdown() {
      this.dropdownVisible = !this.dropdownVisible;
    },

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

    // ✅ 触发文件选择
    $_importGraphFromFile() {
      this.$refs.fileInput.click();
    },

    // ✅ 处理文件上传并读取内容
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
    }
  }
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
