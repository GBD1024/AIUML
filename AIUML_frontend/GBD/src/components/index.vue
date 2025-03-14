<template>
  <div class="home-page">
    <!-- 导航栏 -->
    <div class="nav">

    </div>

    <!-- 搜索框 -->
    <div class="search">
      <input 
        type="text" 
        v-model="searchQuery" 
        placeholder="输入关键字搜索历史绘图"
        @keyup.enter="handleSearch"
      />
      <button @click="handleSearch">搜索</button>
    </div>

    <!-- 功能按钮 -->
     <h3 style="padding: 0 20px;" >新建绘图</h3>
    <div class="actions">
      <button class="action-button" @click="goToDiagramWithHistory(-1)">
        <img :src="a" class="history-image" />
        <div class="history-name">空白绘图</div>
      </button>
    </div>

    <!-- 历史绘图展示 -->
    <div class="history-list">
      <h3>历史绘图</h3>
      <div class="history-grid">
        <button 
          v-for="(item, index) in historyList" 
          :key="index"
          class="history-button"
          @click="goToDiagramWithHistory(item.id)"
        >
          <img :src="item.imageUrl" :alt="item.name" class="history-image" />
          <span class="history-name">{{ item.name }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import '@logicflow/extension/lib/style/index.css';
import getUserInfo from '@/api/getUserInfo';
export default {
  data() {
    return {
        a:"https://q6.itc.cn/images01/20241118/be9dc17ed99a459cb363a337f3069ec2.png",
      searchQuery: "", // 搜索框绑定的值
      historyList: [
        { id: 1, name: "历史绘图1", imageUrl: "https://q7.itc.cn/images01/20241118/9ac61ce74a6c409c86a4ff7e96213239.png" },
        { id: 2, name: "历史绘图2", imageUrl: "https://q7.itc.cn/images01/20241118/9ac61ce74a6c409c86a4ff7e96213239.png" },
        { id: 3, name: "历史绘图3", imageUrl: "https://q7.itc.cn/images01/20241118/9ac61ce74a6c409c86a4ff7e96213239.png" },
        { id: 4, name: "历史绘图4", imageUrl: "https://q7.itc.cn/images01/20241118/9ac61ce74a6c409c86a4ff7e96213239.png" },
        { id: 5, name: "历史绘图5", imageUrl: "https://q7.itc.cn/images01/20241118/9ac61ce74a6c409c86a4ff7e96213239.png" },
      ], // 模拟的历史绘图列表
    };
  },
  methods: {
     // 处理头像下拉菜单点击事件
     handleAvatarCommand(command) {
      if (command === 'logout') {
        this.logout();
      } else if (command === 'settings') {
        this.$router.push('/settings'); // 跳转到设置界面
      }
    },

    // 登出方法
    logout() {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      this.$message.success('已退出登录');
      this.$router.push('/login');
    },

    // 获取用户信息
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
    // 跳转到绘图页面（无数据）
    goToDiagram() {
      this.$router.push("/diagram");
    },

    // 跳转到历史绘图页面（带数据）
    goToDiagramWithHistory(id) {
      this.$router.push({
        path: "/diagram",
        query: { id }, // 通过查询参数传递历史绘图的 ID
      });
    },

    // 处理搜索功能
    handleSearch() {
      alert("搜到了！");
    },
  },
};
</script>

<style>
.nav {
  background: #eaeaea;
  width: 100%;
  height: 80px;
}

.search {
  margin: 20px 0;
  display: flex;
  justify-content: center;
}

.search input {
  padding: 10px;
  width: 300px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.search button {
  padding: 10px 20px;
  margin-left: 10px;
  cursor: pointer;
}

.actions {
  display: flex;
  margin-left: 20px;
  align-items: flex-start; 
  margin-top: 20px;
}

.action-button {
  width: 25%; /* 长方形宽度 */
  height: 200px; /* 长方形高度 */
  font-size: 16px;
  background-color: #f8f9fa;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  border-color: #989898;
}

.action-button:hover {
  background-color: #989898; /* 鼠标悬停效果 */
}

.history-list {
  margin-top: 20px;
  padding: 0 20px;
}

.history-list h3 {
  margin-bottom: 10px;
}

.history-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* 每行最多四个 */
  gap: 10px; /* 按钮之间的间距 */
}

.history-button {
  width: 100%; /* 占满网格单元 */
  height: 200px; /* 长方形高度 */
  font-size: 14px;
  background-color: #f8f9fa;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.history-button:hover {
  background-color: #989898; /* 鼠标悬停效果 */
}

.history-image {
  width: 96%; /* 图片宽度 */
  height: 80%; /* 图片高度 */
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 5px; /* 图片和名称之间的间距 */
}

.history-name {
  font-size: 16px; /* 名称字体大小 */
  color: rgb(0, 0, 0); /* 名称颜色 */
}
</style>