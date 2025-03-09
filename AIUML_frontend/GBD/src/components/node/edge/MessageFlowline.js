import { LineEdge, LineEdgeModel, h } from '@logicflow/core';
import { getShapeStyleFuction, getTextStyleFunction } from '../getShapeStyleUtil';

class MessageFlowLineModel extends LineEdgeModel {
    constructor(data, graphModel) {
        super(data, graphModel);
        this.strokeWidth = 1;
        this.isUserDragged = false;
        this.zIndex = -1; // 保证线在节点下面
    }

    setAttributes() {
        super.setAttributes();
        if (!this.startPoint || !this.endPoint) {
            this.adjustEdgePoints();
        }

    }

    adjustEdgePoints() {
        const { sourceNodeId, targetNodeId } = this;
        const sourceNode = this.graphModel.getNodeModelById(sourceNodeId);
        const targetNode = this.graphModel.getNodeModelById(targetNodeId);

        if (!sourceNode || !targetNode) return;

        if (!this.isUserDragged) {
            this.startPoint = this.getClosestPointOnNode(sourceNode, this.endPoint);
            this.endPoint = this.getClosestPointOnNode(targetNode, this.startPoint);
        }
    }

    getClosestPointOnNode(node, point) {
        const { x, y, width, height } = node;
        const left = x - width / 2;
        const right = x + width / 2;
        const top = y - height / 2;
        const bottom = y + height / 2;

        const dx = point.x - x;
        const dy = point.y - y;
        const slope = dy / dx;

        let closestX = point.x;
        let closestY = point.y;

        if (Math.abs(dx) > Math.abs(dy)) {
            closestX = dx > 0 ? right : left;
            closestY = y + slope * (closestX - x);
        } else {
            closestY = dy > 0 ? bottom : top;
            closestX = x + (closestY - y) / slope;
        }

        closestX = Math.max(left, Math.min(closestX, right));
        closestY = Math.max(top, Math.min(closestY, bottom));

        return { x: closestX, y: closestY };
    }

    updateAttributes(attributes) {
        super.updateAttributes(attributes);
        if (attributes.startPoint || attributes.endPoint) {
            this.isUserDragged = true;
        }
    }

    getTextStyle() {
        const style = super.getTextStyle();
        return getTextStyleFunction(style, this.properties);
    }

    getEdgeStyle() {
        const attributes = super.getEdgeStyle();
        const properties = this.properties;
        const style = getShapeStyleFuction(attributes, properties);
        return { ...style, fill: 'none', endArrow: null }; // 移除默认终点箭头
    }
}

class MessageFlowLine extends LineEdge {
    getMiddleArrow() {
        const { startPoint, endPoint } = this.props.model;
        const middleX = (startPoint.x + endPoint.x) / 2;
        const middleY = (startPoint.y + endPoint.y) / 2;
        const angle = Math.atan2(endPoint.y - startPoint.y, endPoint.x - startPoint.x) * (180 / Math.PI);

        const length = Math.min(20, Math.hypot(endPoint.x - startPoint.x, endPoint.y - startPoint.y) * 0.1);
        const offset = 10;
        const offsetX = offset * Math.sin(angle * Math.PI / 180);
        const offsetY = -offset * Math.cos(angle * Math.PI / 180);

        return h("g", { transform: `translate(${middleX + offsetX}, ${middleY + offsetY}) rotate(${angle})` }, [
            h("path", {
                stroke: "black",
                strokeWidth: 1,
                fill: "none",
                d: `M ${-length} 0 L 0 0 M -10 -5 L 0 0 L -10 5`, // UML 消息流箭头
            })
        ]);
    }

    getShape() {
        const edgeShape = super.getShape();
        const arrowShape = this.getMiddleArrow();
        return h("g", {}, [edgeShape, arrowShape]);
    }

    getEndArrow() {
        return null;
    }
}

export default {
    type: 'pro-messageflowline',
    view: MessageFlowLine,
    model: MessageFlowLineModel
};
