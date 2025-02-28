<template>
  <div class="diagram">
    <!-- ✅ 传递 `lf` 实例给 Navbar -->
    <Navbar ref="navbar" />
    <diagram-toolbar class="diagram-toolbar" v-if="lf" :lf="lf" :activeEdges="activeEdges"
      @changeNodeFillColor="$_changeNodeFill" @saveGraph="$_saveGraph" />
    <div class="diagram-main">
      <diagram-sidebar class="diagram-sidebar" @dragInNode="$_dragInNode" />
      <div class="diagram-container" ref="container">
        <div class="diagram-wrapper">
          <div class="lf-diagram" ref="diagram"></div>
        </div>
      </div>
    </div>
    <div>
      <AIPanel class="diagram-ai-panel" />
    </div>
    <!-- 属性面板 -->
    <PropertyPanel class="diagram-panel diagram-panel-center" v-if="activeNodes.length > 0 || activeEdges.length > 0"
      :onlyEdge="activeNodes.length === 0" :elementsStyle="properties" @setStyle="$_setStyle"
      @setZIndex="$_setZIndex" />
  </div>
</template>

<script>
import LogicFlow from '@logicflow/core'
import { SelectionSelect } from '@logicflow/extension'
import '@logicflow/core/dist/style/index.css'
import '@logicflow/extension/lib/style/index.css'
import DiagramToolbar from './DiagramToolbar.vue'
import DiagramSidebar from './DiagramSidebar.vue'
import PropertyPanel from './PropertyPanel.vue'
import AIPanel from './AIPanel.vue'
import { registerCustomElement } from './node'
import Navbar from './Navbar.vue'

export default {
  name: 'Diagram',
  data() {
    return {
      sidebarWidth: 200,
      diagramWidth: 0,
      diagramHeight: 0,
      lf: '',
      filename: '',
      activeNodes: [],
      activeEdges: [],
      properties: {}
    }
  },
  mounted() {
    let data = ''
    if (window.location.search) {
      const query = window.location.search.substring(1).split('&').reduce((map, kv) => {
        const [key, value] = kv.split('=')
        map[key] = value
        return map
      }, {})
      this.filename = query.filename
      const d = window.sessionStorage.getItem(this.filename)
      if (d) {
        data = JSON.parse(d)
      }
    }
    this.initLogicFlow(data)
  },
  methods: {
    initLogicFlow(data) {
      // 引入框选插件
      LogicFlow.use(SelectionSelect)
      const lf = new LogicFlow({
        container: this.$refs.diagram,
        overlapMode: 1,
        autoWrap: true,
        metaKeyMultipleSelected: true,
        keyboard: {
          enabled: true
        },
        grid: {
          visible: false,
          size: 5
        },
        background: {
          backgroundImage: 'url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2QwZDBkMCIgb3BhY2l0eT0iMC4yIiBzdHJva2Utd2lkdGg9IjEiLz48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZDBkMGQwIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=")',
          backgroundRepeat: 'repeat'
        }
      })
      lf.setTheme(
        {
          baseEdge: { strokeWidth: 1 },
          baseNode: { strokeWidth: 1 },
          nodeText: { overflowMode: 'autoWrap', lineHeight: 1.5 },
          edgeText: { overflowMode: 'autoWrap', lineHeight: 1.5 }
        }
      )
      // 注册自定义元素
      registerCustomElement(lf)
      lf.setDefaultEdgeType('pro-polyline')
      lf.render(data)
      this.lf = lf
      this.lf.on('selection:selected,node:contextmenu,blank:click,edge:click', () => {
        this.$nextTick(() => {
          const { nodes, edges } = this.lf.getSelectElements()
          this.$set(this, 'activeNodes', nodes)
          this.activeNodes = nodes
          this.activeEdges = edges
          this.$_getProperty()
          
        })
      })
      this.$refs.navbar.setLogicFlowInstance(this.lf);
    },
    // 获取可以进行设置的属性
    $_getProperty() {
      let properties = {}
      const { nodes, edges } = this.lf.getSelectElements()
      nodes.forEach(node => {
        properties = { ...properties, ...node.properties }
      })
      edges.forEach(edge => {
        properties = { ...properties, ...edge.properties }
      })
      this.properties = properties
      return properties
    },
    $_dragInNode(type) {
      this.lf.dnd.startDrag({
        type
      })
    },
    $_changeNodeFill(color) {
      const { nodes } = this.lf.graphModel.getSelectElements()
      nodes.forEach(({ id }) => {
        this.lf.setProperties(id, {
          fill: color
        })
      })
    },
    $_setStyle(item) {
      this.activeNodes.forEach(({ id }) => {
        this.lf.setProperties(id, item)
      })
      this.activeEdges.forEach(({ id }) => {
        this.lf.setProperties(id, item)
      })
      this.$_getProperty()
    },
    $_setZIndex(type) {
      this.activeNodes.forEach(({ id }) => {
        this.lf.setElementZIndex(id, type)
      })
      this.activeEdges.forEach(({ id }) => {
        this.lf.setElementZIndex(id, type)
      })
    },
    $_saveGraph() {
      const data = this.lf.getGraphData()
      this.download(this.filename, JSON.stringify(data))
    },
    download(filename, text) {
      window.sessionStorage.setItem(filename, text)
      const element = document.createElement('a')
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
      element.setAttribute('download', filename)
      element.style.display = 'none'
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
    }
  },
  components: {
    DiagramToolbar,
    DiagramSidebar,
    Navbar,
    PropertyPanel,
    AIPanel
  }
}
</script>

<style scoped>
.diagram {
  width: 100%;
  height: 100%;
}

.diagram * {
  box-sizing: border-box;
}

.diagram-toolbar {
  position: absolute;
  top: 50px; /* 向下调整，避开新增的导航栏 */
  left: 0px;
  height: 40px;
  width: 100%;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #e5e5e5;
  z-index: 10;
  background: #e5e5e5;
  padding-top:2px;
  background-color: #f0f0f0; /* 添加背景色 */
}
.diagram-main {
  display: flex;
  width: 100%;
  height: 100%;
}

.diagram-sidebar {
  margin-top: 100px;
  width: 350px;
  height: calc(100% - 40px);
  border-right: 1px solid #dadce0;
  padding: 10px;
}

.diagram-panel {
  width: 300px;
  background: #fff;
  height: calc(100% - 40px);
  position: absolute;
  right: 0px;
  top: 40px;
  border-left: 1px solid #dadce0;
}

.diagram-container {
  flex: 1;
}

/* 由于背景图和gird不对齐，需要css处理一下 */
.diagram /deep/ .lf-background {
  left: -9px;
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

/* 添加新的样式类 */
.diagram-panel-center {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  width: 300px;
  height: 550px;
  /* 根据需要调整宽度 */
  background: #ffffff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  /* 可选：添加阴影效果 */
}
</style>