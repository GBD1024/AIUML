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
        <div class="node-item" @mousedown="dragInNode('pro-rect')">
          <icon-rect class="svg-node" />
        </div>
        <div class="node-item" @mousedown="dragInNode('pro-ellipse')">
          <icon-ellipse class="svg-node" />
        </div>
      </div>
      <div class="node-category">
        <h1 class="node-category-title">时序图</h1>
        <div class="node-item" @mousedown="dragInNode('actor')">
          <icon-actor class="svg-node" />
        </div>
        <div class="node-item" @mousedown="dragInNode('pro-executionspecification')">
          <icon-rect class="svg-node" />
        </div>
        <div class="node-item" @mousedown="dragInNode('sequence-object')">
          <icon-sequence-object class="svg-node" />
        </div>
        <div class="node-item" @mousedown="dragInNode('vertical-black-rectangle')">
          <IconVerticalblackrect class="svg-node" />
        </div>
      </div>
      <div class="node-category">
        <h1 class="node-category-title">状态图</h1>
        <div class="node-item" @mousedown="dragInNode('rect-radius')">
          <icon-rect-radius class="svg-node" />
        </div>
        <div class="node-item" @mousedown="dragInNode('black')">
          <icon-black class="svg-node" />
        </div>
        <div class="node-item" @mousedown="dragInNode('wrapped')">
          <icon-wrapped-black-circle class="svg-node" />
        </div>
      </div>
      <div class="node-category">
        <h1 class="node-category-title">活动图</h1>
        <div class="node-item" @mousedown="dragInNode('pro-decisionnode')">
          <icon-diamond class="svg-node" />
        </div>
        <div class="node-item" @mousedown="dragInNode('black')">
          <icon-black class="svg-node" />
        </div>
        <div class="node-item" @mousedown="dragInNode('wrapped')">
          <icon-wrapped-black-circle class="svg-node" />
        </div>
        <div class="node-item" @mousedown="dragInNode('black-rectangle')">
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
      this.$emit('dragInNode', type)
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.readAsDataURL(file);
      this.loading = true;
      setTimeout(() => {
        if (!this.lfInstance) {
          alert("⚠ 画布未初始化！");
          this.loading = false;
          return;
        }
        this.lfInstance.render({
          "nodes": [
            {
              "id": "27763cfb-1d07-418b-946b-aa8b9852f6e4",
              "type": "class",
              "x": 180,
              "y": 255,
              "properties": {
                "className": "person",
                "attributes": [
                  "height",
                  "weight"
                ],
                "methods": [
                  "eat()",
                  "say()"
                ]
              },
              "zIndex": 1002
            },
            {
              "id": "ed558610-9054-4b16-9eef-ef42801d8af1",
              "type": "class",
              "x": 350,
              "y": 550,
              "properties": {
                "className": "Chinese",
                "attributes": [],
                "methods": [
                  "speakChinese()"
                ]
              },
              "zIndex": 1004
            }
          ],
          "edges": [
            {
              "id": "e6dd5bf8-70bd-4bb8-8492-d1d03de35adf",
              "type": "pro-polyline",
              "sourceNodeId": "ed558610-9054-4b16-9eef-ef42801d8af1",
              "targetNodeId": "27763cfb-1d07-418b-946b-aa8b9852f6e4",
              "startPoint": {
                "x": 350,
                "y": 470
              },
              "endPoint": {
                "x": 180,
                "y": 335
              },
              "properties": {},
              "zIndex": 1005,
              "pointsList": [
                {
                  "x": 350,
                  "y": 470
                },
                {
                  "x": 350,
                  "y": 365
                },
                {
                  "x": 180,
                  "y": 365
                },
                {
                  "x": 180,
                  "y": 335
                }
              ]
            }
          ]
        });
        this.loading = false;
      }, 5000); // 延迟1.5秒，可根据需要调整
      reader.onload = () => {


        console.log("上传的文件:", file.name);
        console.log("Base64 数据:", reader.result);


      };

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