import { RectResize } from '@logicflow/extension';
import { getShapeStyleFuction, getTextStyleFunction } from '../getShapeStyleUtil';

// ExecutionSpecification (执行规范矩形)
class ExecutionSpecificationModel extends RectResize.model {
    initNodeData(data) {
        super.initNodeData(data);
        this.isResizing = true; // 允许拉伸
    }

    setToBottom() {
        this.zIndex = 0;
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

class ExecutionSpecificationView extends RectResize.view {
    // 监听拖动事件，使其可调整大小
    setAttributes() {
        super.setAttributes();
        this.graphModel.setNodeAllowResize(true);
    }
}

export default {
    type: 'pro-objectnode',
    view: ExecutionSpecificationView,
    model: ExecutionSpecificationModel
};