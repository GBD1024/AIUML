import { h } from '@logicflow/core';
import { EllipseResize } from '@logicflow/extension';
// ... existing code ...

class BlackCircleNodeModel extends EllipseResize.model {
  initNodeData(data) {
    super.initNodeData(data);
    this.rx = 20; // 设置椭圆的水平半径
    this.ry = 20; // 设置椭圆的垂直半径
  }

  getNodeStyle() {
    const style = super.getNodeStyle();
    return {
      ...style,
      fill: '#000000', // 确保填充颜色为黑色
    };
  }
}

class BlackCircleNode extends EllipseResize.view {
  getResizeShape() {
    const { x, y, rx, ry } = this.props.model;
    const style = this.props.model.getNodeStyle();

    return h('g', {}, [
      h('ellipse', {
        cx: x,
        cy: y,
        rx,
        ry,
        ...style, // 应用样式，包括填充颜色
        stroke: '#000', // 边框颜色
        'stroke-width': 1,
      })
    ]);
  }
}

export default {
  type: 'pro-startpointnode',
  model: BlackCircleNodeModel,
  view: BlackCircleNode,
};