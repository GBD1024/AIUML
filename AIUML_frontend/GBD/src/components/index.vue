<template>
  <div class="home-page">
    <!-- 导航栏 -->
    <div class="nav">
      <div class="nav-title">AIUML 绘图系统</div>

      <!-- 用户头像 -->
      <el-dropdown class="user-avatar" @command="handleAvatarCommand">
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
    </div>

    <!-- 搜索框 -->
    <div class="search">
      <div class="search-keyword">
        <input type="text" v-model="searchQuery" placeholder="输入关键字搜索历史绘图" @keyup.enter="handleSearch" />
        <button @click="handleSearch">搜索</button>
      </div>
      <div class="search-collaboration">
        <input style="width: 150px;" type="text" v-model="collaborationQuery" placeholder="输入密钥与他人协作绘图"
          @keyup.enter="addDiagram" />
        <button @click="addDiagram">添加</button>
      </div>
    </div>
    <el-dialog title="重命名绘图" :visible.sync="renameDialogVisible">
      <el-input v-model="renameInput" placeholder="请输入新的名称"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="renameDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmRename">确定</el-button>
      </span>
    </el-dialog>


    <!-- 新建绘图 -->
    <h3 style="padding: 0 20px;">新建绘图</h3>
    <div class="actions">
      <button class="action-button" @click="goToDiagramWithHistory(-1)">
        <img :src="defaultImage" class="history-image" />
        <div class="history-name">空白绘图</div>
      </button>
    </div>

    <!-- 历史绘图展示 -->
    <!-- <div class="history-list">
      <h3>历史绘图</h3>

      <p v-if="loading">加载中...</p>

      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

      <div v-if="historyList.length > 0" class="history-grid">
        <div v-for="(item, index) in historyList" :key="index" class="history-item">
          <button class="history-button" @click="goToDiagramWithHistory(item.id)">
            <img :src="item.cover_pic || defaultImage" :alt="item.name" class="history-image" />
            <span class="history-name">{{ item.name }}</span>
          </button>
          <button class="delete-button" @click="handleDelete(item.id)">删除</button>
          <button class="rename-button" @click="openRenameDialog(item.id, item.name)">重命名</button>

        </div>
      </div>

      <p v-else-if="!loading">暂无历史绘图</p>
    </div> -->
    <div class="history-list">
      <!-- 加载 & 错误提示不变 -->
      <p v-if="loading">加载中...</p>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

      <!-- 自己创建的绘图 -->
      <h3>我创建的绘图</h3>
      <div v-if="historyOwn.length > 0" class="history-grid">
        <div v-for="(item, index) in historyOwn" :key="'own-' + index" class="history-item">
          <button class="history-button" @click="goToDiagramWithHistory(item.id)">
            <img :src="item.cover_pic || defaultImage" :alt="item.name" class="history-image" />
            <span class="history-name">{{ item.name }}</span>
          </button>
          <button class="delete-button" @click="handleDelete(item.id)">删除</button>
          <button class="rename-button" @click="openRenameDialog(item.id, item.name)">重命名</button>
        </div>
      </div>
      <p v-else-if="!loading">暂无我创建的绘图</p>

      <!-- 协作绘图 -->
      <h3>协作绘图</h3>
      <div v-if="historyCollaborative.length > 0" class="history-grid">
        <div v-for="(item, index) in historyCollaborative" :key="'collab-' + index" class="history-item">
          <div class="collab-tag">协作</div>
          <button class="history-button" @click="goToDiagramWithHistory(item.id)">
            <img :src="item.cover_pic || defaultImage" :alt="item.name" class="history-image" />
            <span class="history-name">{{ item.name || '未命名协作绘图' }}</span>

          </button>
          <button class="cancel-button" @click="handleCancelCollaboration(item.id)">取消协作</button>
        </div>
      </div>
      <p v-else-if="!loading">暂无协作绘图</p>
    </div>

  </div>
</template>

<script>
import axios from 'axios';
import { Dropdown, DropdownMenu, DropdownItem, Avatar } from 'element-ui';
import getUserInfo from '@/api/getUserInfo';

export default {
  components: {
    [Dropdown.name]: Dropdown,
    [DropdownMenu.name]: DropdownMenu,
    [DropdownItem.name]: DropdownItem,
    [Avatar.name]: Avatar
  },
  data() {
    return {
      renameDialogVisible: false,
      renameId: null,
      renameInput: "",
      avatar: '',
      defaultImage: "https://img0.baidu.com/it/u=1479232965,1336077163&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500",
      searchQuery: "",
      collaborationQuery: "",
      // historyList: [],
      historyOwn: [],
      historyCollaborative: [],
      loading: true,
      errorMessage: "",
      userId: ''
    };
  },
  mounted() {
    this.fetchUserInfo();
    this.fetchHistoryList();
  },
  methods: {
    // 用户相关方法
    async fetchUserInfo() {
      try {
        const info = await getUserInfo(localStorage.getItem('token'), axios);
        this.avatar = info.user_pic || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png';
        this.userId = info.id || '';
      } catch (error) {
        console.error('获取用户信息失败:', error);
        this.avatar = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png';
      }
    },

    handleAvatarCommand(command) {
      if (command === 'logout') {
        this.logout();
      } else if (command === 'settings') {
        this.$router.push('/settings');
      }
    },

    logout() {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      this.$message.success('已退出登录');
      this.$router.push('/login');
    },

    // 历史绘图方法
    async fetchHistoryList() {
      this.loading = true;
      this.errorMessage = "";
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        if (!token) {
          this.errorMessage = "未登录，请先登录！";
          return;
        }

        const response = await axios.get("/api/graph/getAllUmlGraphs", {
          headers: { "Authorization": token }
        });

        // if (response.data.code === 0) {
        //   this.historyList = response.data.info;
        // } else {
        //   this.errorMessage = "获取历史绘图失败：" + response.data.message;
        // }
        if (response.data.code === 0) {
          const data = response.data.info;
          console.log(data);
          this.historyOwn = data.own || [];
          this.historyCollaborative = data.collaborative || [];
        } else {
          this.errorMessage = "获取历史绘图失败：" + response.data.message;
        }
      } catch (error) {
        this.errorMessage = "请求失败，请检查网络连接";
        console.error("请求历史绘图数据出错:", error);
      } finally {
        this.loading = false;
      }
    },

    goToDiagramWithHistory(id) {
      let graphData = {};
      if (id !== -1) {
        const selectedGraph = [...this.historyOwn, ...this.historyCollaborative].find(graph => graph.id === id);
        if (!selectedGraph) return;
        graphData = selectedGraph.uml_data;
      }
      sessionStorage.setItem("graphData", graphData);
      this.$router.push({ path: "/diagram", query: { id } });
    },
    async handleDelete(id) {
      if (!confirm("确定要删除这个绘图吗？")) return;
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        const response = await axios.post(`/api/graph/delete?id=${id}`, null, {
          headers: { "Authorization": token }
        });
        if (response.data.code === 0) {
          this.$message.success("删除成功！");
          this.fetchHistoryList();
        } else {
          this.$message.error(`删除失败：${response.data.message}`);
        }
      } catch (error) {
        console.error("删除请求异常:", error);
        this.$message.error("删除请求失败！");
      }
    },
    openRenameDialog(id, currentName) {
      this.renameId = id;
      this.renameInput = currentName;
      this.renameDialogVisible = true;
    },

    confirmRename() {
      if (!this.renameInput.trim()) {
        this.$message.warning("名称不能为空！");
        return;
      }
      this.handleRename(this.renameId, this.renameInput);
      this.renameDialogVisible = false;
    },
    async handleRename(id, name) {

      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        const response = await axios.post(
          `/api/graph/rename?id=${id}&name=${name}`, null,
          { headers: { "Authorization": token } }
        );

        if (response.data.code === 0) {
          this.$message.success("重命名成功！");
          this.fetchHistoryList();
        } else {
          this.$message.error(`重命名失败：${response.data.message}`);
        }
      } catch (error) {
        console.error("重命名请求异常:", error);
        this.$message.error("重命名请求失败！");
      }
    },

    handleSearch() {
      alert(`搜索功能开发中，关键词：${this.searchQuery}`);
    },
    addDiagram() {
      alert("添加成功");
    }
  }
};
</script>

<style scoped>
.home-page {
  font-family: "Arial", sans-serif;
}

.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  background: #0d0d0d;
  height: 70px;
  position: relative;
}

.nav-title {
  font-size: 24px;
  font-weight: bold;
  color: #ffffff;
}

.user-avatar {
  margin-right: 20px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.user-avatar:hover {
  transform: scale(1.05);
}

.el-avatar {
  border: 2px solid #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.search {
  margin: 20px 0;
  display: flex;
  justify-content: space-between;
  /* 保持原有的布局 */
  width: 100%;
  /* 确保宽度为100% */
}

.search-keyword {
  display: flex;
  justify-content: center;
  /* 水平居中 */
  align-items: center;
  /* 垂直居中 */
  flex: 1;
  /* 占据剩余空间 */
}

.search-collaboration {
  display: flex;
  align-items: center;
  /* 垂直居中 */
  margin-right: 50px;
}

.search input {
  padding: 10px;
  width: 300px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 10px;
}

.search button {
  padding: 10px 20px;
  background-color: #4c4c4c;
  color: #ffffff;
  border: 1px solid #cccccc;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}



.search button:hover {
  background-color: #302222;
  /* 悬停浅灰色 */
  border-color: #999999;
  /* 深灰色边框 */
}


.history-list {
  margin-top: 20px;
  padding: 0 20px;
}

.history-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  padding: 10px;
}

.history-item {
  position: relative;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  overflow: hidden;
  transition: box-shadow 0.3s;
}

.history-item:hover {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.history-button {
  width: 100%;
  height: 200px;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
}

.history-image {
  width: 100%;
  height: 160px;
  object-fit: contain;
  /* 确保图片完整展示 */
  border-bottom: 1px solid #ebeef5;
  background-color: #fafafa;
  /* 可选：填充空白区域的背景色 */
}

.history-name {
  display: block;
  padding: 10px;
  font-size: 14px;
  color: #606266;
}

.delete-button,
.rename-button {
  position: absolute;
  padding: 5px 10px;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: opacity 0.3s;
  width: 65px;
  /* 设置固定宽度 */
  text-align: center;
  /* 确保文本居中对齐 */
}

.delete-button {
  top: 40px;
  right: 10px;
  background: #5a5a5a;
  /* 较深的灰色 */
}

.rename-button {
  top: 10px;
  right: 10px;
  background: #8a8a8a;
  /* 较浅的灰色 */
}

/* 悬停效果 */
.delete-button:hover {
  opacity: 0.8;
}

.rename-button:hover {
  opacity: 0.8;
}


.error-message {
  color: #ff4d4f;
  text-align: center;
  padding: 20px;
}

.actions {
  padding: 0 20px;
  margin-bottom: 30px;
}

.action-button {
  width: 25%;
  height: 200px;
  border-radius: 8px;
  border: 1px solid #ebeef5;
  background: #fafafa;
  cursor: pointer;
  transition: border-color 0.3s;
  margin-right: 10px;
}

.action-button:hover {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.collab-tag {
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: #409EFF;
  color: white;
  padding: 2px 6px;
  font-size: 12px;
  border-radius: 4px;
  z-index: 1;
}

.cancel-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #5a5a5a;
  ;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  cursor: pointer;
  width: 80px;
  text-align: center;
}

.cancel-button:hover {
  opacity: 0.8;
}
</style>