import { PolylineEdge, PolylineEdgeModel ,h} from '@logicflow/core';
import { getShapeStyleFuction, getTextStyleFunction } from '../getShapeStyleUtil';

// ✅ 关联（Association）线模型
class AssociationLineModel extends PolylineEdgeModel {
    // constructor(data, graphModel) {
    //     super(data, graphModel);
    //     this.strokeWidth = 1;
    // }

    // getTextStyle() {
    //     const style = super.getTextStyle();
    //     return getTextStyleFunction(style, this.properties);
    // }

    // getEdgeStyle() {
    //     const attributes = super.getEdgeStyle();
    //     const properties = this.properties;
    //     const style = getShapeStyleFuction(attributes, properties);

    //     return {
    //         ...style,
    //         fill: 'none', // ✅ 确保线条不会被填充
    //         strokeDasharray: "none" // ✅ 让线条为实线
    //     };
    // }
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

// ✅ 关联（Association）线视图
class AssociationLine extends PolylineEdge {
    // getEndArrow() {
    //     return null; // ✅ 不返回任何箭头
    // }
    getEndArrow() {
            return h("g", {}, [
                h("path", {
                    stroke: "black",
                    strokeWidth: 1,
                    fill: "none",
                    d: "M -10 -5 L 0 0 L -10 5", // ✅ UML 关联关系"屋顶"箭头（左右打开）
                })
            ]);
        }
}

// ✅ 注册 `pro-associationline`
export default {
    type: 'pro-associationline', // ✅ UML 关联线
    view: AssociationLine,
    model: AssociationLineModel
};
