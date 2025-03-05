import { PolylineEdge, PolylineEdgeModel, h } from '@logicflow/core';
import { getShapeStyleFuction, getTextStyleFunction } from '../getShapeStyleUtil';

class RealizationLineModel extends PolylineEdgeModel {
    constructor(data, graphModel) {
        super(data, graphModel);
        this.strokeWidth = 1;
    }

    setAttributes() {
        super.setAttributes();

        // ✅ 计算 `startPoint` 和 `endPoint`，让线条连接到类的锚点
        this.adjustEdgePoints();

        // ✅ 如果 `pointsList` 为空，自动计算拐点
        if (!this.pointsList || this.pointsList.length === 0) {
            this.pointsList = this.calculatePoints();
        }
    }

    /**
     * 🚀 计算 `startPoint` 和 `endPoint`，让线条连接到类的锚点
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
            fill: 'none',
            strokeDasharray: "6, 4" // ✅ 实现关系使用虚线
        };
    }
}

// ✅ 继承 PolylineEdge（空心三角箭头 + 虚线）
class RealizationLine extends PolylineEdge {
    getEndArrow() {
        return h("g", {}, [
            h("path", {
                stroke: "black",
                strokeWidth: 1,
                fill: "white", // ✅ 确保是空心箭头
                d: "M 0 0 L -10 -5 L -10 5 Z", // ✅ UML 实现箭头
            })
        ]);
    }
}

// ✅ 注册 `pro-realizationline`
export default {
    type: 'pro-realizationline',
    view: RealizationLine,
    model: RealizationLineModel
};
