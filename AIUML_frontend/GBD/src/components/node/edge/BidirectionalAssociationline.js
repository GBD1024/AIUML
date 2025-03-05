import { PolylineEdge, PolylineEdgeModel } from '@logicflow/core';
import { getShapeStyleFuction, getTextStyleFunction } from '../getShapeStyleUtil';

class BidirectionalAssociationLineModel extends PolylineEdgeModel {
    constructor(data, graphModel) {
        super(data, graphModel);
        this.strokeWidth = 1;
        this.isUserDragged = false; // ✅ 记录用户是否拖动过连线
    }

    setAttributes() {
        super.setAttributes();

        // ✅ 如果 `startPoint` 和 `endPoint` 为空，则自动计算
        if (!this.startPoint || !this.endPoint) {
            this.adjustEdgePoints();
        }

        // ✅ 只在导入 JSON 时计算 `pointsList`
        if (!this.pointsList || this.pointsList.length === 0) {
            this.pointsList = this.calculatePoints();
        }
    }

    /**
     * 🚀 计算 `startPoint` 和 `endPoint`，让箭头连接到类的锚点
     * 但仅在首次创建时计算，防止拖动时重置锚点
     */
    adjustEdgePoints() {
        if (this.isUserDragged) return; // ✅ 如果用户已拖动过，则不重新计算锚点

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
     * 🚀 监听用户拖动连线，防止自动计算覆盖用户手动选择的锚点
     */
    updateAttributes(attributes) {
        super.updateAttributes(attributes);

        // ✅ 如果用户拖动了连线，标记为 `isUserDragged = true`
        if (attributes.startPoint || attributes.endPoint) {
            this.isUserDragged = true;
        }
    }

    /**
     * 🚀 计算合理的拐点，避免线条穿透节点
     */
    calculatePoints() {
        const { startPoint, endPoint } = this;

        const middleX = (startPoint.x + endPoint.x) / 2;
        const middleY = (startPoint.y + endPoint.y) / 2;

        // 规则1: 如果是垂直排列，则先垂直移动再水平连接
        if (Math.abs(startPoint.x - endPoint.x) < Math.abs(startPoint.y - endPoint.y)) {
            return [
                startPoint,
                { x: startPoint.x, y: middleY },
                { x: endPoint.x, y: middleY },
                endPoint
            ];
        }

        // 规则2: 如果是水平排列，则先水平移动再垂直连接
        return [
            startPoint,
            { x: middleX, y: startPoint.y },
            { x: middleX, y: endPoint.y },
            endPoint
        ];
    }

    getTextStyle() {
        const style = super.getTextStyle();
        return getTextStyleFunction(style, this.properties);
    }

    getEdgeStyle() {
        const attributes = super.getEdgeStyle();
        const properties = this.properties;
        const style = getShapeStyleFuction(attributes, properties);

        return {
            ...style,
            fill: 'none', // ✅ 确保线条不会被填充
            strokeDasharray: "none" // ✅ 让线条为实线
        };
    }
}

// ✅ 双向关联线视图（无箭头）
class BidirectionalAssociationLine extends PolylineEdge {
    getEndArrow() {
        return null; // ✅ 不返回任何箭头
    }
}

// ✅ 注册 `pro-bidirectionalassociationline`
export default {
    type: 'pro-bidirectionalassociationline',
    view: BidirectionalAssociationLine,
    model: BidirectionalAssociationLineModel
};
