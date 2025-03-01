import { PolylineEdge, PolylineEdgeModel ,h} from '@logicflow/core'; // ✅ 现在需要 PolylineEdge
import { getShapeStyleFuction, getTextStyleFunction } from '../getShapeStyleUtil';

class GeneralizationLineModel extends PolylineEdgeModel {
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

// ✅ 继承 PolylineEdge，但不修改箭头
class GeneralizationLine extends PolylineEdge {
    getEndArrow() {
        return h("g", {}, [
            h("path", {
                stroke: "black",
                strokeWidth: 1,
                fill: "white", // ✅ 确保是空心箭头
                d: "M 0 0 -10 -5 -10 5 z", // ✅ UML 泛化箭头
            })
        ]);
    }
}


// ✅ 注册泛化线（折线）
export default {
    type: 'pro-generalizationline',
    view: GeneralizationLine,
    model: GeneralizationLineModel,
};
