import { DiamondResize } from '@logicflow/extension';
import { getShapeStyleFuction, getTextStyleFunction } from '../getShapeStyleUtil';

// DecisionNode (菱形决策节点)
class DecisionNodeModel extends DiamondResize.model {
    initNodeData(data) {
        super.initNodeData(data);
        this.rx = 35;
        this.ry = 35;
        this.isResizing = true; // 允许拉伸
    }

    getNodeStyle() {
        const style = super.getNodeStyle();
        const properties = this.getProperties();
        return getShapeStyleFuction(style, properties);
    }

    getTextStyle() {
        const style = super.getTextStyle();
        const properties = this.getProperties();
        return getTextStyleFunction(style, properties);
    }
}

class DecisionNodeView extends DiamondResize.view {
    // 监听拖动事件，使其可调整大小
    setAttributes() {
        super.setAttributes();
        this.graphModel.setNodeAllowResize(true);
    }
}

export default {
    type: 'pro-decisionnode',
    view: DecisionNodeView,
    model: DecisionNodeModel
};
