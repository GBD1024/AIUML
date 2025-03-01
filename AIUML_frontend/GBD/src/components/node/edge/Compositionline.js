import { PolylineEdge, PolylineEdgeModel ,h} from '@logicflow/core'; // ✅ 现在需要 PolylineEdge
import { getShapeStyleFuction, getTextStyleFunction } from '../getShapeStyleUtil';

class CompositionLineModel extends PolylineEdgeModel {
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
        return { ...style, fill: 'none' };
    }
}

// ✅ 继承 PolylineEdge
class CompositionLine extends PolylineEdge {
    getEndArrow() {
        return h("g", {}, [
            h("path", {
                stroke: "black",
                strokeWidth: 1,
                fill: "black", // ✅ 确保是黑色实心箭头
                d: "M 2 0 L -6 -4 L -14 0 L -6 4 Z", // ✅ UML 组合箭头
            })
        ]);
    }
}


// ✅ 注册组合线（折线）
export default {
    type: 'pro-compositionline',
    view: CompositionLine,
    model: CompositionLineModel,
};
