<template>
  <div>
    <div class="toolbar-item" :class="{ 'selection-active': selectionOpened }" @click="$_selectionSelect()">
      <area-select size="18" />
    </div>
    <!-- <div>
      <button @click="$_saveGraph">保存</button>
    </div> -->
    <!-- <div class="toolbar-item toolbar-color-picker">
      <el-popover
        placement="top-start"
        title="填充样式"
        width="220"
        trigger="click"
      >
        <sketch-picker :value="fillColor"  @input="$_changeFillColor"/>
        <color-fill size="24" slot="reference" />
      </el-popover>
    </div> -->
    <!-- <div class="toolbar-item">
      <color-text size="20" />
    </div>
    <div class="toolbar-item">
      <icon-font size="18" />
    </div>
    <div class="toolbar-item">
      <icon-blod size="18" />
    </div>
    <div class="toolbar-item">
      <icon-line size="18" />
    </div> -->
    <div class="toolbar-item" @click="$_zoomIn()">
      <zoom-in size="18" />
    </div>
    <div class="toolbar-item" @click="$_zoomOut()">
      <zoom-out size="18" />
    </div>
    <div class="toolbar-item" :class="{ 'disabled': !undoAble }" @click="$_undo()">
      <step-back size="18" />
    </div>
    <div class="toolbar-item" :class="{ 'disabled': !redoAble }" @click="$_redo()">
      <step-foward size="18" />
    </div>

    <div style="margin-left: 30px">
      <el-select v-model="linetype" size="mini" @change="$_changeLineType" popper-class="custom-select-dropdown">
        <el-option v-for="item in lineOptions" :key="item.value" :value="item.value" :label="item.label"></el-option>
      </el-select>
    </div>
    <div class="search-container">
      <input v-model="searchQuery" placeholder="搜索节点..." class="search-input" />
      <button @click="onSearchConfirm" class="search-button">搜索节点</button>
    </div>

  </div>
</template>

<script>
// import { Sketch } from 'vue-color'
// import ColorFill from './icon/ColorFill.vue'
// import ColorText from './icon/ColorText.vue'
// import IconFont from './icon/Font.vue'
// import IconBlod from './icon/Blod.vue'
// import IconLine from './icon/Line.vue'
import ZoomIn from './icon/ZoomIn.vue'
import ZoomOut from './icon/ZoomOut.vue'
import StepBack from './icon/StepBack.vue'
import StepFoward from './icon/StepFoward.vue'
import AreaSelect from './icon/AreaSelect.vue'

export default {
  props: {
    lf: Object,
    activeEdges: Array,
    fillColor: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      searchQuery: '',
      selectionOpened: false,
      undoAble: false,
      redoAble: false,
      colors: '#595959',
      linetype: 'pro-polyline',
      lineOptions: [
        {
          value: 'pro-polyline',
          label: '折线'
        },
        {
          value: 'pro-line',
          label: '直线'
        },
        {
          value: 'pro-bezier',
          label: '曲线'
        },
        {
          value: 'pro-associationline',
          label: '关联'
        },
        {
          value: 'pro-bidirectionalassociationline',
          label: '双向关联（无箭头实线）'
        },
        {
          value: 'pro-generalizationline',
          label: '泛化'
        },
        {
          value: 'pro-realizationline',
          label: '实现'
        },
        {
          value: 'pro-aggregationline',
          label: '聚合'
        },
        {
          value: 'pro-compositionline',
          label: '组合'
        },
        {
          value: 'pro-dependencyline',
          label: '依赖'
        },
        {
          value: 'pro-messageflowline',
          label: '消息传递（通信图）'
        },
        {
          value: 'pro-dashedline',
          label: '虚线'
        }

      ]
    }
  },
  mounted() {
    this.$props.lf.on('history:change', ({ data: { undoAble, redoAble } }) => {
      this.$data.redoAble = redoAble
      this.$data.undoAble = undoAble
    })

  },
  methods: {
    onSearchInput() {
      // 如果你希望输入过程就实时搜索，可保留这句
      // this.$emit('searchNode', this.searchQuery);
    },
    onSearchConfirm() {
      this.$emit('searchNode', this.searchQuery);
    },
    $_changeFillColor(val) {
      this.$emit('changeNodeFillColor', val.hex)
    },
    $_saveGraph() {
      this.$emit('saveGraph')
    },
    $_zoomIn() {
      this.$props.lf.zoom(true)
    },
    $_zoomOut() {
      this.$props.lf.zoom(false)
    },
    $_undo() {
      if (this.$data.undoAble) {
        this.$props.lf.undo()
      }
    },
    $_redo() {
      if (this.$data.redoAble) {
        this.$props.lf.redo()
      }
    },
    $_selectionSelect() {
      this.selectionOpened = !this.selectionOpened
      if (this.selectionOpened) {
        this.lf.extension.selectionSelect.openSelectionSelect()
      } else {
        this.lf.extension.selectionSelect.closeSelectionSelect()
      }
    },
    $_changeLineType(value) {
      const { lf, activeEdges } = this.$props
      const { graphModel } = lf
      lf.setDefaultEdgeType(value)
      if (activeEdges && activeEdges.length > 0) {
        activeEdges.forEach(edge => {
          graphModel.changeEdgeType(edge.id, value)
        })
      }
    }
  },
  components: {
    // ColorFill,
    // ColorText,
    // IconFont,
    // IconBlod,
    // IconLine,
    ZoomIn,
    ZoomOut,
    StepBack,
    StepFoward,
    AreaSelect,
    // SketchPicker: Sketch
  }
}
</script>

<style scoped>
.toolbar-item {
  width: 18px;
  height: 18px;
  float: left;
  margin: 12px 4px;
  cursor: pointer;
  margin-left: 30px;
}

.toolbar-color-picker {
  width: 24px;
  height: 24px;
  margin: 8px 4px;
}

.selection-active {
  background: #6a6a6a;
}

::v-deep .el-select .el-input__inner:focus {
  border-color: #606266;
}

::v-deep .el-select .el-input.is-focus .el-input__inner {
  border-color: #606266;
}

::v-deep .el-select:hover .el-input__inner {
  border-color: #606266;
}

::v-deep .el-select-dropdown__item.selected,
::v-deep .el-select-dropdown__item.selected.hover {
  color: #333 !important;
  font-weight: bold;
}

::v-deep .el-select-dropdown__item.hover,
::v-deep .el-select-dropdown__item:hover {
  background-color: #f5f5f5;
}

.toolbar-item.disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.toolbar-item.disabled:hover {
  cursor: not-allowed;
  background-color: transparent;
}

::v-deep .custom-select-dropdown {
  .el-select-dropdown__item {
    color: #606266;

    &.selected {
      color: #333 !important;
      background-color: #f5f5f5 !important;
      font-weight: bold;
    }

    &:hover {
      background-color: #f5f5f5;
      color: #606266;
    }
  }
}
.search-container {
  display: flex;
  align-items: center;
  margin-left: 20px;
}

.search-input {
  padding: 4px 8px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px 0 0 4px;
}

.search-button {
  padding: 2.5px 12px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-left: none;
  background-color: #666666;
  color: white;
  border-radius: 4px 4px 4px 4px;
  cursor: pointer;
}

.search-button:hover {
  background-color: #969696;
}

</style>
