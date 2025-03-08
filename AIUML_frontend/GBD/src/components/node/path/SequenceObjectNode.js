import { h } from '@logicflow/core';
import { EllipseResize } from '@logicflow/extension';

class SequenceObjectNodeModel extends EllipseResize.model {
  constructor(data, graphModel) {
    super(data, graphModel);
    this.autoGenerateAnchors = false; // 禁用默认锚点生成
  }

  initNodeData(data) {
    super.initNodeData(data);
    this.rx = 7;
    this.ry = 7;
    // 手动初始化锚点
    this.anchorsOffset = [];
    this.anchorPoints = [[0.5, 1, 'bottom']];
  }

  getAnchorPoints() {
    return this.anchorPoints;
  }



  // 隐藏锚点显示
  getAnchorStyle() {
    return {
      ...super.getAnchorStyle(),
      isShowAnchor: false, // 关键：隐藏锚点
      r: 2 // 设置锚点大小为2像素
    };
  }

  getNodeStyle() {
    const style = super.getNodeStyle();
    return {
      ...style,
      fill: '#000000',
    };
  }

  getDefaultAnchor() {
    const { x, y, id } = this;
    return [
      {
        x: x,
        y: y,
        name: 'center',
        id: `${id}_0`
      }
    ];
  }
}

class SequenceObjectNodeView extends EllipseResize.view {
  getResizeShape() {
    const { x, y, rx, ry } = this.props.model;
    const style = this.props.model.getNodeStyle();

    return h('g', {}, [
      h('ellipse', {
        cx: x,
        cy: y,
        rx,
        ry,
        ...style,
        stroke: '#000',
        'stroke-width': 1,
      })
    ]);
  }
}

export default {
  type: 'sequence-object',
  view: SequenceObjectNodeView,
  model: SequenceObjectNodeModel,
};