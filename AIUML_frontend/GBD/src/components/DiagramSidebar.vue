<template>
  <div class="diagram-sidebar">
    <!-- 文件上传 -->
    <div>
      <label class="custom-upload-button" for="upload">
        <div v-if="loading" class="spinner"></div>
        <span v-if="loading">正在生成，请等待...</span>
        <span v-else>上传图片</span>
      </label>
      <input id="upload" type="file" style="display:none;" @change="handleFileUpload">
    </div>

    <!-- UML九种图 -->
    <div>
      <div class="node-category">
        <h1 class="node-category-title">类图</h1>
        <div class="node-item" @mousedown="dragInNode('class')">
          <icon-class class="svg-node" />
        </div>
      </div>
      <div class="node-category">
        <h1 class="node-category-title">对象图</h1>

        <div class="node-item" @mousedown="dragInNode('object')">
          <icon-object class="svg-node" />
        </div>
      </div>
      <div class="node-category">
        <h1 class="node-category-title">用例图</h1>
        <div class="node-item" @mousedown="dragInNode('actor')">
          <icon-actor class="svg-node" />
        </div>
        <div class="node-item" @mousedown="dragInNode('pro-systemnode')">
          <icon-rect class="svg-node" />
        </div>
        <div class="node-item" @mousedown="dragInNode('pro-usecasenode')">
          <icon-ellipse class="svg-node" />
        </div>
      </div>
      <div class="node-category">
        <h1 class="node-category-title">时序图</h1>
        <div class="node-item" @mousedown="dragInNode('actor')">
          <icon-actor class="svg-node" />
        </div>
        <div class="node-item" @mousedown="dragInNode('pro-objectnode')">
          <icon-rect class="svg-node" />
        </div>
        <div class="node-item" @mousedown="dragInNode('sequence-object')">
          <icon-sequence-object class="svg-node" />
        </div>
        <div class="node-item" @mousedown="dragInNode('pro-lifeline')">
          <IconVerticalblackrect class="svg-node" />
        </div>
      </div>
      <div class="node-category">
        <h1 class="node-category-title">状态图</h1>
        <div class="node-item" @mousedown="dragInNode('pro-statenode')">
          <icon-rect-radius class="svg-node" />
        </div>
        <div class="node-item" @mousedown="dragInNode('pro-startpointnode')">
          <icon-black class="svg-node" />
        </div>
        <div class="node-item" @mousedown="dragInNode('pro-endpointnode')">
          <icon-wrapped-black-circle class="svg-node" />
        </div>
      </div>
      <div class="node-category">
        <h1 class="node-category-title">活动图</h1>
        <div class="node-item" @mousedown="dragInNode('pro-decisionnode')">
          <icon-diamond class="svg-node" />
        </div>
        <div class="node-item" @mousedown="dragInNode('pro-startpointnode')">
          <icon-black class="svg-node" />
        </div>
        <div class="node-item" @mousedown="dragInNode('pro-endpointnode')">
          <icon-wrapped-black-circle class="svg-node" />
        </div>
        <div class="node-item" @mousedown="dragInNode('pro-forkandjoinnode')">
          <icon-blackrect class="svg-node" />
        </div>
      </div>
      <div class="node-category">
        <h1 class="node-category-title">通信图(协作图)</h1>
        <div class="node-item" @mousedown="dragInNode('actor')">
          <icon-actor class="svg-node" />
        </div>
        <div class="node-item" @mousedown="dragInNode('object')">
          <icon-object class="svg-node" />
        </div>

      </div>
      <div class="node-category">
        <h1 class="node-category-title">组件图(构件图)</h1>
        <div class="node-item" @mousedown="dragInNode('parallelogram')">
          <icon-parallelogram class="svg-node" />
        </div>
        <div class="node-item" @mousedown="dragInNode('pro-componentnode')">
          <icon-componentnode class="svg-node" />
        </div>
      </div>
      <div class="node-category">
        <h1 class="node-category-title">部署图</h1>

        <div class="node-item" @mousedown="dragInNode('cube')">
          <icon-cube class="svg-node" />
        </div>
      </div>
      <div class="node-category">
        <h1 class="node-category-title">其他</h1>
        <div class="node-item" @mousedown="dragInNode('cylinde')">
          <icon-cylinde class="svg-node" />
        </div>
        <div class="node-item" @mousedown="dragInNode('text')">
          <icon-text class="svg-node" />
        </div>
        <div class="node-item" @mousedown="dragInNode('triangle')">
          <icon-triangle class="svg-node" />
        </div>
        <div class="node-item" @mousedown="dragInNode('right-arrow')">
          <icon-right-arrow class="svg-node" />
        </div>
        <div class="node-item" @mousedown="dragInNode('left-arrow')">
          <icon-left-arrow class="svg-node" />
        </div>
        <div class="node-item" @mousedown="dragInNode('horizontal-arrow')">
          <icon-horizontal-arrow class="svg-node" />
        </div>
        <div class="node-item" @mousedown="dragInNode('vertical-arrow')">
          <icon-vertical-arrow class="svg-node" />
        </div>
        <div class="node-item" @mousedown="dragInNode('pentagon')">
          <icon-pentagon class="svg-node" />
        </div>
        <div class="node-item" @mousedown="dragInNode('hexagon')">
          <icon-hexagon class="svg-node" />
        </div>
        <div class="node-item" @mousedown="dragInNode('septagon')">
          <icon-septagon class="svg-node" />
        </div>
        <div class="node-item" @mousedown="dragInNode('heptagon')">
          <icon-heptagon class="svg-node" />
        </div>
        <div class="node-item" @mousedown="dragInNode('trapezoid')">
          <icon-trapezoid class="svg-node" />
        </div>

        <div class="node-item" @mousedown="dragInNode('pro-circle')">
          <icon-circle class="svg-node" />
        </div>
        <div class="node-item" @mousedown="dragInNode('parallelogram')">
          <icon-parallelogram class="svg-node" />
        </div>
        <div class="node-item" @mousedown="dragInNode('up-arrow')">
          <icon-up-arrow class="svg-node" />
        </div>
        <div class="node-item" @mousedown="dragInNode('down-arrow')">
          <icon-down-arrow class="svg-node" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import IconCircle from './icon/Circle.vue'
import IconRect from './icon/Rect.vue'
import IconRectRadius from './icon/RectRadius.vue'
import IconActor from './icon/Actor.vue'
import IconCylinde from './icon/Cylinde.vue'
import IconDiamond from './icon/Diamond.vue'
import IconEllipse from './icon/Ellipse.vue'
import IconParallelogram from './icon/Parallelogram.vue'
import IconText from './icon/Text.vue'
import IconTriangle from './icon/Triangle.vue'
import IconLeftArrow from './icon/LeftArrow.vue'
import IconRightArrow from './icon/RightArrow.vue'
import IconHorizontalArrow from './icon/HorizontalArrow.vue'
import IconUpArrow from './icon/UpArrow.vue'
import IconDownArrow from './icon/DownArrow.vue'
import IconVerticalArrow from './icon/VerticalArrow.vue'
import IconPentagon from './icon/Pentagon.vue'
import IconHexagon from './icon/Hexagon.vue'
import IconSeptagon from './icon/Septagon.vue'
import IconHeptagon from './icon/Heptagon.vue'
import IconTrapezoid from './icon/Trapezoid.vue'
import IconClass from './icon/Class.vue'
import IconCube from './icon/Cube.vue'
import IconBlack from './icon/Black.vue'
import IconWrappedBlackCircle from './icon/WrappedBlackCircleIcon.vue'
import IconBlackrect from './icon/Blackrect.vue'
import IconObject from './icon/Object.vue'
import IconSequenceObject from './icon/SequenceObjectNode.vue'
import IconVerticalblackrect from './icon/Verticalblackrect.vue'
import IconComponentnode from './icon/ComponentNode.vue'

export default {
  data() {
    return {
      loading: false,
      lfInstance: null,
    };
  },

  name: 'DiagramSidebar',
  methods: {
    setLogicFlowInstance(lf) {
      this.lfInstance = lf;

      // 初始化 MiniMap 插件
      this.lfInstance.extension.miniMap.init({
        disabledPlugins: [], // 可禁用某些插件
      });
    },
    dragInNode(type) {
      console.log("拖拽的节点类型:", type);
      this.$emit('dragInNode', type)
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      this.loading = true;

      const formData = new FormData();
      formData.append("file", file);

      fetch("api/aiuml/picToUml", {
        method: "POST",
        body: formData
      })
        .then(async (response) => {
          if (!response.ok) {
            throw new Error("上传失败");
          }
          const result = await response.json();
          if (result.code !== 0) {
            throw new Error(result.msg || "后端解析失败");
          }

          const diagramData = result.info;
          if (!this.lfInstance) {
            alert("⚠ 画布未初始化！");
            return;
          }

          this.lfInstance.render(diagramData);
        })
        .catch((error) => {
          console.error("上传或渲染出错：", error);
          alert("上传失败：" + error.message);
        })
        .finally(() => {
          this.loading = false;
        });
    }

  },
  components: {
    IconCircle,
    IconRect,
    IconRectRadius,
    IconActor,
    IconCylinde,
    IconDiamond,
    IconEllipse,
    IconParallelogram,
    IconText,
    IconTriangle,
    IconRightArrow,
    IconLeftArrow,
    IconHorizontalArrow,
    IconUpArrow,
    IconDownArrow,
    IconVerticalArrow,
    IconPentagon,
    IconHexagon,
    IconSeptagon,
    IconHeptagon,
    IconTrapezoid,
    IconClass,
    IconCube,
    IconBlack,
    IconWrappedBlackCircle,
    IconBlackrect,
    IconObject,
    IconSequenceObject,
    IconVerticalblackrect,
    IconComponentnode
  }
}
</script>

<style scoped>
.diagram-sidebar {
  user-select: none;
}

.node-category-title {
  margin: 0;
  font-size: 14px;
  display: block;
  border-bottom: 1px solid #e5e5e5;
  line-height: 30px;
  margin-bottom: 10px;
}

.node-item {
  width: 35px;
  height: 35px;
  margin-right: 5px;
  display: inline-block;
}

.node-category {
  border-bottom: 1px solid #e5e5e5;
  margin-bottom: 15px;
}

.svg-node {
  left: 1px;
  top: 1px;
  width: 32px;
  height: 30px;
  display: block;
  position: relative;
  overflow: hidden;
}

.custom-upload-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 95%;
  padding: 10px;
  font-size: 16px;
  cursor: pointer;
  color: #000;
  background-color: #fff;
  border: 1px solid #000;
  transition: all 0.3s ease;
  margin-bottom: 20px;
  position: relative;
}

.custom-upload-button:hover {
  background-color: #f2f2f2;
  /* 悬停时更浅的背景 */
  border-color: #333333;
  /* 更深的边框颜色 */
}

.custom-upload-button:active {
  background-color: #e6e6e6;
  border-color: #333333;
  transform: translateY(1px);
  /* 轻微按下效果 */
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #333;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
  margin-right: 8px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>