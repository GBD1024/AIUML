<template>
  <div class="diagram">
    <!-- 传递 `lf` 实例和 `id` 给 Navbar -->
    <Navbar ref="navbar" :diagramId="diagramId" @updateDiagramId="diagramId = $event" />
    <diagram-toolbar class="diagram-toolbar" v-if="lf" :lf="lf" :activeEdges="activeEdges"
      @changeNodeFillColor="$_changeNodeFill" @saveGraph="$_saveGraph" />
    <div class="diagram-main">
      <diagram-sidebar ref="sidebar" class="diagram-sidebar" @dragInNode="$_dragInNode" />
      <div class="diagram-container" ref="container">
        <div class="diagram-wrapper">
          <div class="lf-diagram" ref="diagram"></div>
        </div>
      </div>
    </div>
    <div>
      <!-- 将 getUMLData 方法传递给 AIPanel -->
      <AIPanel ref="aipanel" class="diagram-ai-panel" :getUMLData="getUMLData" />
    </div>
    <!-- 属性面板 -->
    <PropertyPanel class="diagram-panel" v-if="activeNodes.length > 0 || activeEdges.length > 0"
      :style="{ left: panelPosition.left + 'px', top: panelPosition.top + 'px' }" :onlyEdge="activeNodes.length === 0"
      :elementsStyle="properties" @setStyle="$_setStyle" @setZIndex="$_setZIndex" />
  </div>
</template>

<script>
import LogicFlow from '@logicflow/core';
import { SelectionSelect } from '@logicflow/extension';
import '@logicflow/core/dist/style/index.css';
import '@logicflow/extension/lib/style/index.css';
import DiagramToolbar from './DiagramToolbar.vue';
import DiagramSidebar from './DiagramSidebar.vue';
import PropertyPanel from './PropertyPanel.vue';
import AIPanel from './AIPanel.vue';
import { registerCustomElement } from './node';
import Navbar from './Navbar.vue';

export default {
  name: 'Diagram',
  components: {
    DiagramToolbar,
    DiagramSidebar,
    PropertyPanel,
    AIPanel,
    Navbar
  },
  data() {
    return {
      sidebarWidth: 200,
      diagramWidth: 0,
      diagramHeight: 0,
      lf: null, // 初始化为 null，确保后续检查
      filename: '',
      activeNodes: [],
      activeEdges: [],
      properties: {},
      panelPosition: { left: 0, top: 0 },
      diagramId: null, // 新增 diagramId 字段
      graphData: {}
    };
  },
  watch: {
    activeNodes: 'updatePanelPosition',
    activeEdges: 'updatePanelPosition',
    '$route.query.id': {
      handler(newId) {
        console.log("Diagram.vue 监听 URL id:", newId);
        this.diagramId = newId;
        this.$refs.navbar.setDiagramId(newId); // 同步 Navbar
      },
      immediate: true
    }
  },
  mounted() {
    const { id } = this.$route.query;
    this.diagramId = id || "new";

    const storedData = sessionStorage.getItem("graphData");
    let graphData = null;

    try {
      graphData = storedData ? JSON.parse(storedData) : null;
    } catch (e) {
      console.warn("解析图数据失败:", e);
    }

    this.initLogicFlow(graphData || { nodes: [], edges: [] });
  },
  methods: {
    initLogicFlow(data) {
      LogicFlow.use(SelectionSelect);
      const lf = new LogicFlow({
        container: this.$refs.diagram,
        overlapMode: 1,
        autoWrap: true,
        metaKeyMultipleSelected: true,
        keyboard: { enabled: true },
        grid: { visible: false, size: 5 },
        background: {
          backgroundImage:
            'url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgaTEwIDAgTCAxMCA0MCBtLTIwIDAgTCAwIDIwIEwgNDAgMjAgaS0yMCAwIEwgMjAgMCAwbDIwIDQwIE0wIDMwIEwgNDAgMzAgaS0xMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2QwZDBkMCIgb3BhY2l0eT0iMC4yIiBzdHJva2Utd2lkdGg9IjEiLz48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZDBkMGQwIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=")',
          backgroundRepeat: 'repeat'
        }
      });
      lf.setTheme({
        baseEdge: { strokeWidth: 1 },
        baseNode: { strokeWidth: 1 },
        nodeText: { overflowMode: 'autoWrap', lineHeight: 1.5 },
        edgeText: { overflowMode: 'autoWrap', lineHeight: 1.5 }
      });
      registerCustomElement(lf);
      lf.setDefaultEdgeType('pro-polyline');
      lf.render(data);
      this.lf = lf; // 将 LogicFlow 实例赋值给 this.lf
      // 修改事件监听以实现节点与边均通过右键打开属性栏
      this.lf.on('selection:selected,node:contextmenu,edge:contextmenu,blank:click', () => {
        this.$nextTick(() => {
          const { nodes, edges } = this.lf.getSelectElements();
          this.activeNodes = nodes;
          this.activeEdges = edges;
          this.$_getProperty();
          if (edges.length > 0) {
            this.updatePanelPosition();
          }
        });
      });
      this.$refs.navbar.setLogicFlowInstance(this.lf);
      this.$refs.aipanel.setLogicFlowInstance(this.lf);
      this.$refs.sidebar.setLogicFlowInstance(this.lf);
    },
    $_getProperty() {
      let properties = {};
      const { nodes, edges } = this.lf.graphModel.getSelectElements();
      nodes.forEach(node => {
        properties = { ...properties, ...node.properties };
      });
      edges.forEach(edge => {
        properties = { ...properties, ...edge.properties };
      });
      this.properties = properties;
      return properties;
    },
    $_dragInNode(type) {
      this.lf.dnd.startDrag({ type });
    },
    $_changeNodeFill(color) {
      const { nodes } = this.lf.graphModel.getSelectElements();
      nodes.forEach(({ id }) => {
        this.lf.setProperties(id, { fill: color });
      });
    },
    $_setStyle(item) {
      this.activeNodes.forEach(({ id }) => {
        this.lf.setProperties(id, item);
      });
      this.activeEdges.forEach(({ id }) => {
        this.lf.setProperties(id, item);
      });
      this.$_getProperty();
    },
    $_setZIndex(type) {
      this.activeNodes.forEach(({ id }) => {
        this.lf.setElementZIndex(id, type);
      });
      this.activeEdges.forEach(({ id }) => {
        this.lf.setElementZIndex(id, type);
      });
    },
    $_saveGraph() {
      const data = this.lf.getGraphData();
      this.$refs.navbar.saveGraph(data); // 调用 Navbar 的 saveGraph 方法
    },
    download(filename, text) {
      window.sessionStorage.setItem(filename, text);
      const element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
      element.setAttribute('download', filename);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    },
    updatePanelPosition() {
      if (this.activeNodes.length > 0) {
        const node = this.activeNodes[0];
        this.panelPosition.left = node.x + 50; // 偏移量
        this.panelPosition.top = 50;
      } else if (this.activeEdges.length > 0) {
        const edge = this.activeEdges[0];
        const middleX = (edge.startPoint.x + edge.endPoint.x) / 2;
        const middleY = (edge.startPoint.y + edge.endPoint.y) / 2;
        this.panelPosition.left = middleX + 50; // 调整偏移量以适应你的布局
        this.panelPosition.top = middleY - 100; // 根据需要调整垂直位置
      }
    },
    getUMLData() {
      return this.lf.getGraphData(); // 返回 LogicFlow 的图形数据
    },
  }
};
</script>

<style scoped>
.diagram {
  width: 100%;
  height: 100%;
}

.diagram-toolbar {
  position: absolute;
  top: 50px;
  left: 0px;
  height: 40px;
  width: 100%;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #e5e5e5;
  z-index: 10;
  background: #e5e5e5;
  padding-top: 2px;
  background-color: #f0f0f0;
}

.diagram-main {
  display: flex;
  width: 100%;
  height: 100%;
}

.diagram-sidebar {
  margin-top: 100px;
  width: 25%;
  height: calc(100vh - 130px);
  border-right: 1px solid #dadce0;
  padding: 10px;
  overflow-y: auto;
}

.diagram-panel {
  position: absolute;
  z-index: 10;
  width: 300px;
  height: 550px;
  background: #ffffff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.diagram-container {
  flex: 1;
}

.diagram-wrapper {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
}

.lf-diagram {
  box-shadow: 0px 0px 4px #838284;
  width: 100%;
  height: 100%;
}

::-webkit-scrollbar {
  width: 9px;
  height: 9px;
  background: white;
  border-left: 1px solid #e8e8e8;
}

::-webkit-scrollbar-thumb {
  border-width: 1px;
  border-style: solid;
  border-color: #fff;
  border-radius: 6px;
  background: #c9c9c9;
}

::-webkit-scrollbar-thumb:hover {
  background: #b5b5b5;
}
</style>