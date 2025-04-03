import { h } from '@logicflow/core';
import { EllipseResize } from '@logicflow/extension';
// ... existing code ...

class WrappedBlackCircleModel extends EllipseResize.model {
  initNodeData(data) {
    super.initNodeData(data);
    this.rx = 15; // 设置内圆的水平半径
    this.ry = 15; // 设置内圆的垂直半径
  }

  getNodeStyle() {
    const style = super.getNodeStyle();
    return {
      ...style,
      fill: '#000000', // 内圆填充颜色为黑色
    };
  }
}

class WrappedBlackCircleView extends EllipseResize.view {
  getResizeShape() {
    const { x, y, rx, ry } = this.props.model;
    const innerStyle = this.props.model.getNodeStyle();
    const outerStyle = {
      ...innerStyle,
      fill: 'none', // 外圆无填充
      stroke: '#000000', // 外圆边框颜色
      'stroke-width': 2, // 外圆边框宽度
    };

    return h('g', {}, [
      h('ellipse', {
        ...outerStyle,
        cx: x,
        cy: y,
        rx: rx + 5, // 外圆水平半径比内圆大
        ry: ry + 5, // 外圆垂直半径比内圆大
      }),
      h('ellipse', {
        ...innerStyle,
        cx: x,
        cy: y,
        rx,
        ry,
      }),
    ]);
  }
}

export default {
  type: 'pro-endpointnode',
  model: WrappedBlackCircleModel,
  view: WrappedBlackCircleView,
};