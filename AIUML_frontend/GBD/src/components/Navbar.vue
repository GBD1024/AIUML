<template>
  <div>
    <!-- 动画控制按钮 -->
    <div v-if="animationRunning" class="animation-controls">
      <el-button @click="pauseAnimation" :disabled="animationPaused">暂停</el-button>
      <el-button @click="resumeAnimation" :disabled="!animationPaused">继续</el-button>
      <el-button type="danger" @click="endAnimation">结束</el-button>
    </div>

    <!-- 动画期间的遮罩 -->
    <div v-if="animationRunning" class="canvas-mask"></div>

    <!-- 顶部导航栏 -->
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

      <!-- PlantUML 弹窗 -->
      <el-dialog title="插入 PlantUML" :visible.sync="plantumlDialogVisible" width="500px" :destroy-on-close="true"
        append-to-body @close="cancelPlantumlDialog">
        <div style="position: relative;">
          <el-input type="textarea" v-model="plantumlCode" :rows="10" placeholder="请输入 PlantUML 代码" />
          <div v-if="plantumlLoading" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0;
              background: rgba(255,255,255,0.6); z-index: 10; cursor: not-allowed;"></div>
        </div>

        <template #footer>
          <el-button @click="cancelPlantumlDialog">取消</el-button>
          <el-button type="primary" :loading="plantumlLoading" @click="submitPlantUML">确定</el-button>
        </template>
      </el-dialog>

      <!-- 返回按钮 -->
      <button class="navbar-btn return-btn" @click="goToIndexPage">
        ⬅ 返回索引页
      </button>

      <!-- 文件上传隐藏输入 -->
      <input type="file" ref="fileInput" hidden @change="$_handleFileUpload" />
    </div>
  </div>
</template>

<script>
import LogicFlow from '@logicflow/core';
import { Snapshot } from '@logicflow/extension';
import { MiniMap } from '@logicflow/extension';
import '@logicflow/extension/lib/style/index.css';
import getUserInfo from '@/api/getUserInfo';
import axios from 'axios';

// 注册插件
LogicFlow.use(Snapshot);
LogicFlow.use(MiniMap);

export default {
  name: 'Navbar',
  data() {
    return {

      animationPaused: false,
      animationRunning: false,
      animationQueue: [],
      originalGraphData: null, // 存储完整初始数据

      plantumlDialogVisible: false,
      plantumlCode: '',
      plantumlLoading: false,
      cancelPlantUMLRequest: null,

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
            { label: "保存至我的", action: "$_saveGraph" },
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
            { label: "一键美化", action: "$_beautify" },
            { label: "插入plantuml", action: "$_plantuml" },
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
            { label: "分享密钥邀请他人协作", action: "$_invite" },
          ],
        },
        {
          label: "动画",
          menuItems: [
            { label: "展示动画", action: "$_showAnimation" }
          ]
        }
      ],
    };
  },
  props: {
    diagramId: {
      type: String,
      default: "-1"
    }
  },
  computed: {
    isNewGraph() {
      return this.diagramId === "-1";
    }
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
      this.closeDropdowns(); // 先关闭所有下拉菜单
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
        const info = await getUserInfo(localStorage.getItem('token'), axios);

        // 添加字段验证和默认值
        this.avatar = info.user_pic || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png';
        this.userId = info.id || ''; // 获取并存储 userId

        // 调试输出
        console.log('用户头像URL:', this.avatar);
        console.log('用户ID:', this.userId);
      } catch (error) {
        console.error('获取用户信息失败:', error);
        // 设置默认头像
        this.avatar = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png';
        this.userId = ''; // 清空 userId
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
    $_beautify() {
      if (!this.lfInstance) {
        this.$message.error("⚠ 画布未初始化！");
        return;
      }

      const loading = this.$loading({
        lock: true,
        text: '正在美化布局，请稍候...',
        spinner: 'el-icon-loading',
        background: 'rgba(255, 255, 255, 0.7)'
      });

      setTimeout(() => {
        const beautifiedData = {
          "nodes": [
            {
              "id": "数据导入",
              "type": "class",
              "x": 520,
              "y": 120,
              "properties": {
                "className": "数据导入",
                "attributes": [],
                "methods": ["+导入(数据源路径: String): 原始数据"]
              },
              "zIndex": 1034
            },
            {
              "id": "数据处理",
              "type": "class",
              "x": 270,
              "y": 415,
              "properties": {
                "className": "数据处理",
                "attributes": [],
                "methods": ["+清洗数据(原始数据): 清洗结果"]
              },
              "zIndex": 1047
            },
            {
              "id": "数据导出",
              "type": "class",
              "x": -175,
              "y": 740,
              "properties": {
                "className": "数据导出",
                "attributes": [],
                "methods": ["+导出文件(清洗结果, 格式: String): 文件"]
              },
              "zIndex": 1020
            },
            {
              "id": "数据可视化",
              "type": "class",
              "x": 250,
              "y": 740,
              "properties": {
                "className": "数据可视化",
                "attributes": [],
                "methods": ["+展示图表(数据): 图表"]
              },
              "zIndex": 1008
            },
            {
              "id": "趋势建模",
              "type": "class",
              "x": 735,
              "y": 740,
              "properties": {
                "className": "趋势建模",
                "attributes": [],
                "methods": ["+加载模型(模型类型: String): 模型"]
              },
              "zIndex": 1044
            },
            {
              "id": "c8fa9387-63bc-4275-bee7-335b8115cfc2",
              "type": "class",
              "x": -170,
              "y": 135,
              "properties": {
                "className": "协同平台",
                "attributes": [],
                "methods": ["共享数据（部门ID，权限）：数据集"]
              },
              "zIndex": 1045
            }
          ],
          "edges": [
            {
              "id": "数据导入-数据处理",
              "type": "pro-associationline",
              "sourceNodeId": "数据导入",
              "targetNodeId": "数据处理",
              "startPoint": { "x": 570, "y": 200 },
              "endPoint": { "x": 392.5, "y": 360 },
              "text": { "x": 481.25, "y": 360, "value": "传入" },
              "zIndex": -1,
              "pointsList": [
                { "x": 570, "y": 200 },
                { "x": 570, "y": 360 },
                { "x": 392.5, "y": 360 }
              ]
            },
            {
              "id": "数据处理-数据导出",
              "type": "pro-associationline",
              "sourceNodeId": "数据处理",
              "targetNodeId": "数据导出",
              "startPoint": { "x": 147.5, "y": 415 },
              "endPoint": { "x": -75, "y": 740 },
              "text": { "x": 31.82, "y": 390, "value": "输出" },
              "zIndex": -1,
              "pointsList": [
                { "x": 147.5, "y": 415 },
                { "x": -45, "y": 415 },
                { "x": -45, "y": 740 },
                { "x": -75, "y": 740 }
              ]
            },
            {
              "id": "数据处理-数据可视化",
              "type": "pro-associationline",
              "sourceNodeId": "数据处理",
              "targetNodeId": "数据可视化",
              "startPoint": { "x": 270, "y": 518.75 },
              "endPoint": { "x": 270, "y": 660 },
              "text": { "x": 270, "y": 604.375, "value": "展示清洗数据" },
              "zIndex": -1,
              "pointsList": [
                { "x": 270, "y": 518.75 },
                { "x": 270, "y": 548.75 },
                { "x": 270, "y": 548.75 },
                { "x": 270, "y": 660 }
              ]
            },
            {
              "id": "数据处理-趋势建模",
              "type": "pro-associationline",
              "sourceNodeId": "数据处理",
              "targetNodeId": "趋势建模",
              "startPoint": { "x": 392.5, "y": 415 },
              "endPoint": { "x": 735, "y": 820 },
              "text": { "x": 666.25, "y": 415, "value": "供预测使用" },
              "zIndex": -1,
              "pointsList": [
                { "x": 392.5, "y": 415 },
                { "x": 940, "y": 415 },
                { "x": 940, "y": 873.33 },
                { "x": 735, "y": 873.33 },
                { "x": 735, "y": 820 }
              ]
            },
            {
              "id": "趋势建模-数据可视化",
              "type": "pro-associationline",
              "sourceNodeId": "趋势建模",
              "targetNodeId": "数据可视化",
              "startPoint": { "x": 595, "y": 740 },
              "endPoint": { "x": 350, "y": 740 },
              "text": { "x": 472.5, "y": 740, "value": "展示预测数据" },
              "zIndex": -1,
              "pointsList": [
                { "x": 595, "y": 740 },
                { "x": 350, "y": 740 }
              ]
            },
            {
              "id": "2afd0f07-85e6-45db-ac0f-d54dfaca971b",
              "type": "pro-associationline",
              "sourceNodeId": "c8fa9387-63bc-4275-bee7-335b8115cfc2",
              "targetNodeId": "数据导入",
              "startPoint": { "x": -70, "y": 135 },
              "endPoint": { "x": 420, "y": 120 },
              "text": { "x": 66.56, "y": 118.33, "value": "协同数据导入" },
              "zIndex": 1006,
              "pointsList": [
                { "x": -70, "y": 135 },
                { "x": -70, "y": 118.33 },
                { "x": 184.375, "y": 118.33 },
                { "x": 184.375, "y": 120 },
                { "x": 420, "y": 120 }
              ]
            },
            {
              "id": "f137ac5f-4838-43cb-960a-31be691b410c",
              "type": "pro-associationline",
              "sourceNodeId": "c8fa9387-63bc-4275-bee7-335b8115cfc2",
              "targetNodeId": "数据导出",
              "startPoint": { "x": -170, "y": 233.75 },
              "endPoint": { "x": -175, "y": 660 },
              "text": { "x": -174.09, "y": 344.49, "value": "协同数据导出" },
              "zIndex": 1008,
              "pointsList": [
                { "x": -170, "y": 233.75 },
                { "x": -170, "y": 446.875 },
                { "x": -175, "y": 446.875 },
                { "x": -175, "y": 660 }
              ]
            }
          ]
        };

        this.lfInstance.render(beautifiedData);
        loading.close();
        this.$message.success(" 图形美化完成！");
      }, 1200);
    },

    $_plantuml() {
      this.plantumlDialogVisible = true;
      this.plantumlCode = '';
    },
    async submitPlantUML() {
      if (!this.plantumlCode.trim()) {
        this.$message.warning("请输入 PlantUML 代码！");
        return;
      }

      this.plantumlLoading = true;
      const CancelToken = axios.CancelToken;
      const source = CancelToken.source();
      this.cancelPlantUMLRequest = source.cancel; // 保存取消函数
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");

        const response = await this.$axios.post(
          '/api/aiuml/plantGenerateUML',
          { content: this.plantumlCode },
          {
            headers: {
              "Authorization": token
            },
            cancelToken: source.token
          }
        );

        if (response.data && response.data.code === 0) {
          const graphJson = response.data.info;
          console.log(graphJson);
          if (this.lfInstance) {
            this.lfInstance.render(graphJson);
            this.$message.success("🎉 PlantUML 插入成功！");
          } else {
            this.$message.error("画布未初始化！");
          }
        } else {
          this.$message.error("生成失败：" + (response.data.message || "未知错误"));
        }
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("请求已取消：", error.message);
        } else {
          console.error(error);
          this.$message.error("请求失败：" + error.message);
        }
      } finally {
        this.plantumlLoading = false;
        this.cancelPlantUMLRequest = null;
        this.plantumlDialogVisible = false;
      }
    },
    cancelPlantumlDialog() {
      if (this.cancelPlantUMLRequest) {
        this.cancelPlantUMLRequest("用户取消了操作");
      }
      this.plantumlDialogVisible = false;
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
    async $_invite() {
      if (this.diagramId === "-1") {
        this.$message.warning("⚠ 请先保存绘图后再生成协作密钥！");
        return;
      }

      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        const response = await this.$axios.post("/api/collaboration/createKey", {
          id: this.diagramId
        }, {
          headers: {
            "Authorization": token
          }
        });


        if (response.data.code === 0) {
          const key = response.data.info;
          this.$copyText?.(key); // 如果你集成了 vue-clipboard 等复制插件
          this.$message.success({
            message: ` 协作密钥生成成功：${key}`,
            duration: 0, // 0 表示永不自动关闭
            showClose: true // 提供一个关闭按钮
          });

        } else {
          this.$message.error(" 协作密钥生成失败：" + response.data.message);
        }
      } catch (error) {
        console.error("生成协作密钥失败:", error);
        this.$message.error(" 请求出错，生成密钥失败");
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
    async $_saveGraph() {
      if (!this.lfInstance) {
        this.$message.error("⚠ 画布未初始化！");
        return;
      }


      const data = this.lfInstance.getGraphData();
      const isNewGraph = this.diagramId === "-1";

      let graphName = "";

      if (isNewGraph) {
        graphName = prompt("请输入绘图名称:");
        if (!graphName) {
          this.$message.error("绘图名称不能为空");
          return;
        }
      }

      try {
        const { data: imageBlob } = await this.lfInstance.getSnapshotBlob();

        const formData = new FormData();
        formData.append("graphData", JSON.stringify(data));
        formData.append("image", imageBlob, "diagram.png");
        formData.append("id", this.diagramId);

        if (isNewGraph) {
          formData.append("name", graphName);
        }

        const token = localStorage.getItem("token") || sessionStorage.getItem("token");

        const response = await this.$axios.post("/api/graph/save", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": token
          }
        });

        if (response.data.code === 0) {
          if (isNewGraph) {
            const newId = String(response.data.info);

            // 这里同步 diagramId
            this.diagramId = newId;

            // 也跳转 URL（可选 replace）
            this.$router.push({
              path: "/diagram",
              query: { id: newId }
            });
            //  存储新数据到 sessionStorage
            sessionStorage.setItem("graphData", JSON.stringify(data));
            this.$message.success("🎉 新建图保存成功！");
          } else {
            //  存储新数据到 sessionStorage
            sessionStorage.setItem("graphData", JSON.stringify(data));
            this.$message.success(" 图形更新成功！");
          }
        } else {
          this.$message.error(" 保存失败：" + response.data.message);
        }
      } catch (error) {
        this.$message.error(" 保存失败：" + error.message);
      }
    }
    ,

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
          alert(" 解析文件失败，请确保是正确的 JSON 格式！");
        }
      };
      reader.readAsText(file);
    },

    // 关闭所有下拉菜单
    closeDropdowns() {
      this.activeDropdownIndex = null;
    },
    goToIndexPage() {
      this.$router.push('/index');
    },
    getStartNodes(nodes, edges) {
      const allNodeIds = nodes.map(n => n.id);
      const targetNodeIds = edges.map(e => e.targetNodeId);
      return allNodeIds.filter(id => !targetNodeIds.includes(id));
    },

    async $_showAnimation() {
      const lf = this.lfInstance;
      if (!lf) {
        this.$message.warning("⚠ 画布未初始化！");
        return;
      }

      this.animationRunning = true;
      this.animationPaused = false;

      // 保存原始完整图数据
      this.originalGraphData = lf.getGraphData();
      const { nodes, edges } = this.originalGraphData;

      // 识别多个连通子图
      const connectedComponents = this.getConnectedComponents(nodes, edges);
      this.animationQueue = connectedComponents;

      // 清空当前画布用于动画演示
      lf.clearData();

      for (const component of this.animationQueue) {
        if (!this.animationRunning) break;
        await this.playComponent(component);
      }

      if (this.animationRunning) {
        this.$message.success(' 动画播放完毕！');
      }

      this.endAnimation(); // 自动恢复原图 + 结束控制状态
    },
    async waitWhilePaused() {
      while (this.animationPaused && this.animationRunning) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    },
    async playComponent(component) {
      const { nodes, edges } = component;
      const nodeMap = new Map(nodes.map(n => [n.id, n]));
      const visitedNodes = new Set();
      const visitedEdges = new Set();
      const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

      const startIds = this.getStartNodes(nodes, edges);
      const allIds = nodes.map(n => n.id);
      const extraIds = allIds.filter(id => !startIds.includes(id));
      const queue = [...startIds, ...extraIds]; // 起点优先，其余节点补上

      while (queue.length && this.animationRunning) {
        await this.waitWhilePaused();  // 👈 新增：暂停控制

        const currentId = queue.shift();
        if (!visitedNodes.has(currentId)) {
          const node = nodeMap.get(currentId);
          await this.lfInstance.addNode({
            ...node,
            style: { stroke: 'red', fill: '#ffe6e6' }
          });
          visitedNodes.add(currentId);
          await sleep(800);
        }

        const outgoingEdges = edges.filter(e => e.sourceNodeId === currentId);
        for (const edge of outgoingEdges) {
          if (!this.animationRunning) return; // 👈 新增：防止点击结束后继续执行
          await this.waitWhilePaused();      // 👈 新增：暂停控制

          if (!visitedEdges.has(edge.id)) {
            const targetNode = nodeMap.get(edge.targetNodeId);
            if (!visitedNodes.has(targetNode.id)) {
              await this.lfInstance.addNode({
                ...targetNode,
                style: { stroke: 'red', fill: '#ffe6e6' }
              });
              visitedNodes.add(targetNode.id);
            }

            await this.lfInstance.addEdge({
              ...edge,
              style: { stroke: 'red' }
            });
            visitedEdges.add(edge.id);
            await sleep(800);
          }
        }
      }
    },

    pauseAnimation() {
      this.animationPaused = true;
      this.$message.info(" 已暂停动画");
    },

    resumeAnimation() {
      this.animationPaused = false;
      this.$message.success(" 已继续动画");
    },

    endAnimation() {
      this.animationRunning = false;
      this.animationPaused = false;
      this.animationQueue = [];

      // 恢复原图
      if (this.originalGraphData && this.lfInstance) {
        this.lfInstance.clearData();
        this.lfInstance.render(this.originalGraphData);
        this.originalGraphData = null;
      }


    },
    getConnectedComponents(nodes, edges) {
      const graph = {};
      nodes.forEach(n => { graph[n.id] = []; });
      edges.forEach(e => {
        graph[e.sourceNodeId].push(e.targetNodeId);
        graph[e.targetNodeId].push(e.sourceNodeId);
      });

      const visited = new Set();
      const components = [];

      function dfs(nodeId, group) {
        visited.add(nodeId);
        group.push(nodeId);
        for (const neighbor of graph[nodeId]) {
          if (!visited.has(neighbor)) dfs(neighbor, group);
        }
      }

      for (const node of nodes) {
        if (!visited.has(node.id)) {
          const group = [];
          dfs(node.id, group);
          const groupNodes = nodes.filter(n => group.includes(n.id));
          const groupEdges = edges.filter(e =>
            group.includes(e.sourceNodeId) && group.includes(e.targetNodeId)
          );
          components.push({ nodes: groupNodes, edges: groupEdges });
        }
      }

      return components;
    }






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
  transition: all 0.3s ease;
  margin-right: 30px;
}

.navbar-btn:hover {
  background-color: #efefef;
}

.return-btn {
  margin-right: 20px;
  font-weight: 500;
  padding: 8px 15px;
  border-radius: 4px;
}

.return-btn:hover {
  background-color: #dcdcdc !important;
  transform: translateX(-3px);
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

::v-deep .el-dropdown-menu__item:focus,
::v-deep .el-dropdown-menu__item:not(.is-disabled):hover {
  background-color: #f5f5f5;
  color: #333;
}

::v-deep .el-popper[x-placement^="bottom"] .popper__arrow::after {
  border-bottom-color: #fff;
}

::v-deep .el-popper[x-placement^="bottom"] .popper__arrow {
  border-bottom-color: #ebeef5;
}

.animation-controls {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 999;
  background: rgba(255, 255, 255, 0.9);
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
}

.canvas-mask {
  position: fixed;
  top: 50px;
  /* 避开顶部 navbar */
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.4);
  z-index: 998;
  pointer-events: auto;
  cursor: not-allowed;
}
</style>