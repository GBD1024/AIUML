import { h } from '@logicflow/core';
import { RectResize } from '@logicflow/extension';

// 黑色矩形的模型
class BlackRectangleModel extends RectResize.model {
  initNodeData(data) {
    super.initNodeData(data);
    this.width = 120; // 默认宽度
    this.height = 10; // 默认高度
    this.fillColor = '#000000'; // 填充颜色
    this.strokeStyle = '#000000'; // 边框颜色
    this.lineWidth = 2; // 边框宽度
  }
}

// 黑色矩形的视图
class BlackRectangleView extends RectResize.view {
  getResizeShape() {
    const { model } = this.props;
    const { x, y, width, height, fillColor, strokeStyle, lineWidth } = model;

    return h('g', {}, [
      h('rect', {
        x: x - width / 2,
        y: y - height / 2,
        width,
        height,
        fill: fillColor,
        stroke: strokeStyle,
        'stroke-width': lineWidth,
        rx: 5,
        ry: 5 // 圆角矩形
      })
    ]);
  }
}

// 注册节点
export default {
  type: 'pro-forkandjoinnode',
  view: BlackRectangleView,
  model: BlackRectangleModel
};