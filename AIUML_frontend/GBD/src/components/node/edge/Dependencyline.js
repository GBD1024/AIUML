import { PolylineEdge, PolylineEdgeModel, h } from '@logicflow/core';
import { getShapeStyleFuction, getTextStyleFunction } from '../getShapeStyleUtil';

// ✅ 依赖（Dependency）线模型
class DependencyLineModel extends PolylineEdgeModel {
    constructor(data, graphModel) {
        super(data, graphModel);
        this.strokeWidth = 1;
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
            strokeDasharray: "6, 4" // ✅ 依赖关系使用虚线
        };
    }
}

// ✅ 依赖（Dependency）线视图，添加"屋顶"箭头
class DependencyLine extends PolylineEdge {
    getEndArrow() {
        return h("g", {}, [
            h("path", {
                stroke: "black",
                strokeWidth: 1,
                fill: "none",
                d: "M -10 -5 L 0 0 L -10 5", // ✅ UML 依赖关系"屋顶"箭头（左右打开）
            })
        ]);
    }
}

// ✅ 注册 `pro-dependencyline`
export default {
    type: 'pro-dependencyline', // ✅ 依赖关系线
    view: DependencyLine,
    model: DependencyLineModel
};
