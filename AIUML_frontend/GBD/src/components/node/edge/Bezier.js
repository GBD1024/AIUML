import { BezierEdge, BezierEdgeModel } from '@logicflow/core'
import { getShapeStyleFuction, getTextStyleFunction } from '../getShapeStyleUtil'

class BezierModel extends BezierEdgeModel {
  constructor(data, graphModel) {
    super(data, graphModel)
    this.strokeWidth = 1
  }

  setAttributes() {
    super.setAttributes();

    // ✅ 计算 `startPoint` 和 `endPoint`，让贝塞尔曲线连接到类的锚点
    this.adjustEdgePoints();

    // ✅ 自动计算控制点，确保曲线顺滑
    this.controlPoints = this.calculateControlPoints();
  }

  /**
   * 🚀 计算 `startPoint` 和 `endPoint`，让贝塞尔曲线连接到类的锚点
   */
  adjustEdgePoints() {
    const { sourceNodeId, targetNodeId } = this;
    const sourceNode = this.graphModel.getNodeModelById(sourceNodeId);
    const targetNode = this.graphModel.getNodeModelById(targetNodeId);

    if (!sourceNode || !targetNode) return;

    const sourceAnchors = this.getNodeAnchors(sourceNode);
    const targetAnchors = this.getNodeAnchors(targetNode);

    let minDistance = Infinity;
    let bestStart = sourceAnchors[0];
    let bestEnd = targetAnchors[0];

    // ✅ 找到最近的两个锚点
    sourceAnchors.forEach(sourceAnchor => {
      targetAnchors.forEach(targetAnchor => {
        const distance = Math.hypot(sourceAnchor.x - targetAnchor.x, sourceAnchor.y - targetAnchor.y);
        if (distance < minDistance) {
          minDistance = distance;
          bestStart = sourceAnchor;
          bestEnd = targetAnchor;
        }
      });
    });

    this.startPoint = bestStart;
    this.endPoint = bestEnd;
  }

  /**
   * 🚀 获取类的 4 个锚点（上下左右）
   */
  getNodeAnchors(node) {
    const { x, y, width, height } = node;
    return [
      { x, y: y - height / 2 }, // 上锚点
      { x: x + width / 2, y }, // 右锚点
      { x, y: y + height / 2 }, // 下锚点
      { x: x - width / 2, y }  // 左锚点
    ];
  }

  /**
   * 🚀 计算贝塞尔曲线的控制点，使曲线更加顺滑
   */
  calculateControlPoints() {
    const { startPoint, endPoint } = this;

    const dx = Math.abs(startPoint.x - endPoint.x);
    const dy = Math.abs(startPoint.y - endPoint.y);

    // ✅ 控制点应该位于连线方向的外侧，以形成平滑曲线
    return [
      { x: startPoint.x + dx * 0.5, y: startPoint.y - dy * 0.3 },
      { x: endPoint.x - dx * 0.5, y: endPoint.y + dy * 0.3 }
    ];
  }

  getTextStyle() {
    const style = super.getTextStyle()
    return getTextStyleFunction(style, this.properties)
  }

  getEdgeStyle() {
    const attributes = super.getEdgeStyle()
    const properties = this.properties;
    const style = getShapeStyleFuction(attributes, properties)
    return { ...style, fill: 'none' }
  }
}

export default {
  type: 'pro-bezier',
  view: BezierEdge,
  model: BezierModel
}
