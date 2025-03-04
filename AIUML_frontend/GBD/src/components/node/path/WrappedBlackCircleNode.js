import { h } from '@logicflow/core';
import { CircleNode, CircleNodeModel } from '@logicflow/core'; // 更新导入路径

class WrappedBlackCircleModel extends CircleNodeModel {
  initNodeData(data) {
    super.initNodeData(data);
    this.radius = 15; // 设置内圆的半径
  }

  getNodeStyle() {
    const style = super.getNodeStyle();
    return {
      ...style,
      fill: '#000000', // 内圆填充颜色为黑色
    };
  }
}

class WrappedBlackCircleView extends CircleNode {
  getShape() {
    const { x, y, radius } = this.props.model;
    const innerStyle = this.props.model.getNodeStyle();
    const outerStyle = {
      ...innerStyle,
      fill: 'none', // 外圆无填充
      stroke: '#000000', // 外圆边框颜色
      'stroke-width': 2, // 外圆边框宽度
    };

    return h('g', {}, [
      h('circle', {
        ...outerStyle,
        cx: x,
        cy: y,
        r: radius + 5, // 外圆半径比内圆大
      }),
      h('circle', {
        ...innerStyle,
        cx: x,
        cy: y,
        r: radius,
      }),
    ]);
  }
}

export default {
  type: 'wrapped',
  view: WrappedBlackCircleView,
  model: WrappedBlackCircleModel,
};