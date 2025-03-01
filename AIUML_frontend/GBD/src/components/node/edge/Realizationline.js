import { PolylineEdge, PolylineEdgeModel ,h} from '@logicflow/core'; // ✅ 现在需要 PolylineEdge
import { getShapeStyleFuction, getTextStyleFunction } from '../getShapeStyleUtil';

class RealizationLineModel extends PolylineEdgeModel {
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
            strokeDasharray: "6, 4" // ✅ 添加虚线样式（6px 实线，4px 间隔）
        };
    }
}

// ✅ 继承 PolylineEdge
class RealizationLine extends PolylineEdge {
    getEndArrow() {
        return h("g", {}, [
            h("path", {
                stroke: "black",
                strokeWidth: 1,
                fill: "white", // ✅ 确保是空心箭头
                d: "M 0 0 -10 -5 -10 5 z", // ✅ UML 实现箭头
            })
        ]);
    }
}


// ✅ 注册实现线（折线）
export default {
    type: 'pro-realizationline',
    view: RealizationLine,
    model: RealizationLineModel,
};
