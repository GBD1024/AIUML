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
      dropdownVisible: false, // 控制下拉菜单显示
      lfInstance: null, // 用于存储 LogicFlow 实例
    };
  },
  methods: {
    // ✅ 切换下拉菜单
    toggleDropdown() {
      this.dropdownVisible = !this.dropdownVisible;
    },

    // ✅ 由 `Diagram.vue` 传入 LogicFlow 实例
    setLogicFlowInstance(lf) {
      this.lfInstance = lf;

    },

    // ✅ 保存到浏览器缓存
    $_saveGraphToBrowser() {
      if (this.lfInstance) {
        const data = this.lfInstance.getGraphData();
        console.log(data);
        localStorage.setItem("diagramData", JSON.stringify(data));
        alert("💾 图形已保存到浏览器缓存！");
      } else {
        alert("⚠ 画布未初始化！");
      }
    },

    // ✅ 保存到本地文件
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

    // ✅ 恢复浏览器缓存
    $_loadGraphFromBrowser() {
      if (this.lfInstance) {
        const savedData = localStorage.getItem("diagramData");
        console.log(savedData);
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

    // ✅ 清空浏览器缓存
    $_clearGraphBrowser() {
      if (confirm("确定要清空浏览器缓存的绘图吗？")) {
        localStorage.removeItem("diagramData");
        alert("🗑 本地存储的绘图已清空！");
      }
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

/* ✅ 下拉菜单样式 */
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
