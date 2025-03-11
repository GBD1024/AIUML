<template>
  <div class="navbar">
    <!-- 文件按钮 -->
    <div class="navbar-dropdown" v-for="(button, index) in buttons" :key="index" @click.stop>
      <button class="navbar-btn" @click="toggleDropdown(index)">
        {{ button.label }}
      </button>
      <div v-if="activeDropdownIndex === index" class="dropdown-menu">
        <button v-for="(item, idx) in button.menuItems" :key="idx" @click="handleMenuItemClick(item.action)">
          {{ item.label }}
        </button>
      </div>
    </div>
    <div style="flex-grow: 1;"></div>

    <!-- 用户头像放到顶栏的最右侧 -->
    <el-dropdown class="navbar-avatar" @command="handleAvatarCommand">
      <span class="el-dropdown-link">
        <el-avatar :src="avatar" icon="el-icon-user-solid" :title="avatar ? '用户头像' : '正在加载头像...'">
          <i v-if="!avatar" class="el-icon-loading"></i>
        </el-avatar>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="settings">设置</el-dropdown-item>
        <el-dropdown-item command="logout">登出</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <input type="file" ref="fileInput" hidden @change="$_handleFileUpload" />
  </div>

</template>

<script>
import LogicFlow from '@logicflow/core';
import { Snapshot } from '@logicflow/extension';
import { MiniMap } from '@logicflow/extension';
import '@logicflow/extension/lib/style/index.css';
import  getUserInfo  from '@/api/getUserInfo';


// 注册插件
LogicFlow.use(Snapshot);
LogicFlow.use(MiniMap);

export default {
  name: 'Navbar',
  data() {
    return {
      avatar: '',
      // 当前展开的下拉菜单索引
      activeDropdownIndex: null,
      lfInstance: null,
      undoAble: false, // 撤销是否可用
      redoAble: false, // 重做是否可用
      isMiniMapVisible: false, // MiniMap 是否可见
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
          ],
        },
        {
          label: "查看",
          menuItems: [
            { label: "放大", action: "$_zoomIn" },
            { label: "缩小", action: "$_zoomOut" },
            { label: "显示略缩图", action: "$_toggleMiniMap" }, // 修改为显示/隐藏 MiniMap
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
        this.activeDropdownIndex = null;
      } else {
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
    handleAvatarCommand(command) {
      if (command === 'logout') {
        this.logout();
      } else if (command === 'settings') {
        this.$router.push('/settings'); // 跳转到设置界面
      }
    },

    logout() {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      this.$message.success('已退出登录');
      this.$router.push('/login');
    },
    async fetchUserInfo() {
      try {
        // 确保传递正确的token参数
        const info = await getUserInfo(localStorage.getItem('token'));

        // 添加字段验证和默认值
        this.avatar = info.user_pic || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png';

        // 调试输出
        console.log('用户头像URL:', this.avatar);
      } catch (error) {
        console.error('获取用户信息失败:', error);
        // 设置默认头像
        this.avatar = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png';
      }
    },
    // 示例方法：撤销
    $_undo() {
      if (this.lfInstance) {
        this.lfInstance.undo();
      } else {
        alert("⚠ 画布未初始化！");
      }
    },

    // 示例方法：重做
    $_redo() {
      if (this.lfInstance) {
        this.lfInstance.redo();
      } else {
        alert("⚠ 画布未初始化！");
      }
    },

    // 示例方法：放大
    $_zoomIn() {
      if (this.lfInstance) {
        this.lfInstance.zoom(true);
      } else {
        alert("⚠ 画布未初始化！");
      }
    },

    // 示例方法：缩小
    $_zoomOut() {
      if (this.lfInstance) {
        this.lfInstance.zoom(false);
      } else {
        alert("⚠ 画布未初始化！");
      }
    },

    // 示例方法：显示/隐藏 MiniMap
    $_toggleMiniMap() {
      if (!this.lfInstance) {
        alert("⚠ 画布未初始化！");
        return;
      }

      if (this.isMiniMapVisible) {
        // 隐藏 MiniMap
        this.lfInstance.extension.miniMap.hide();
        this.buttons[2].menuItems[2].label = "显示略缩图"; // 修改按钮文字
      } else {
        // 显示 MiniMap
        this.lfInstance.extension.miniMap.show(10, 100); // 设置位置
        this.buttons[2].menuItems[2].label = "隐藏略缩图"; // 修改按钮文字
      }

      // 切换 MiniMap 状态
      this.isMiniMapVisible = !this.isMiniMapVisible;
    },

    // 示例方法：使用说明
    $_showHelp() {
      alert("📖 这个软件通俗易懂，感觉不需要写使用说明");
    },

    // 示例方法：反馈问题
    $_reportIssue() {
      alert("⚠ 请前往github主页提交反馈问题");
    },

    // 示例方法：导出图片
    $_exportImage() {
      if (this.lfInstance) {
        this.lfInstance.getSnapshot();
        alert("🖼 图片已成功导出！");
      } else {
        alert("⚠ 画布未初始化！");
      }
    },

    // 设置 LogicFlow 实例
    setLogicFlowInstance(lf) {
      this.lfInstance = lf;

      // 初始化 MiniMap 插件
      this.lfInstance.extension.miniMap.init({
        disabledPlugins: [], // 可禁用某些插件
      });
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
    this.fetchUserInfo(); // 新增此行
    window.addEventListener('click', this.closeDropdowns);

    if (this.lfInstance) {
      this.lfInstance.on('history:change', ({ data: { undoAble, redoAble } }) => {
        this.undoAble = undoAble;
        this.redoAble = redoAble;
      });
    }
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

.navbar-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
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
  min-width: 100px;
  /* 固定宽度 */
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

.navbar-avatar {
  margin-right: 20px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.navbar-avatar:hover {
  transform: scale(1.1);
}

.el-avatar {
  border: 2px solid #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.el-icon-loading {
  font-size: 20px;
  color: #909399;
}
</style>
