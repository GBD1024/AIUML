import { CircleNode, CircleNodeModel, h } from '@logicflow/core';

class BlackCircleNodeModel extends CircleNodeModel {
  initNodeData(data) {
    super.initNodeData(data);
    this.radius = 20; // 设置圆的半径
    this.properties.fill = '#000000'; // 设置圆的填充颜色为黑色，使用properties保存样式信息
  }
}

class BlackCircleNode extends CircleNode {
  getShape() {
    const { x, y, properties: { fill } } = this.props.model;
    const radius = this.props.model.radius;

    return h('g', {}, [
      h('circle', {
        cx: x,
        cy: y,
        r: radius,
        fill: fill, // 使用设置的填充颜色
        stroke: '#000', // 圆的边框颜色
        'stroke-width': 1
      })
    ]);
  }
}

export default {
  type: 'black',
  model: BlackCircleNodeModel,
  view: BlackCircleNode,
};