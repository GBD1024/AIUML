import { RectResize } from '@logicflow/extension'
import { getShapeStyleFuction, getTextStyleFunction } from '../getShapeStyleUtil'

// 矩形
class SystemModel extends RectResize.model {

    setToBottom() {
        this.zIndex = 0
    }

    getNodeStyle() {
        const style = super.getNodeStyle()
        const properties = this.getProperties()
        return getShapeStyleFuction(style, properties)
    }

    getTextStyle() {
        const style = super.getTextStyle()
        const properties = this.getProperties()
        return getTextStyleFunction(style, properties)
    }
}

export default {
    type: 'pro-systemnode',
    view: RectResize.view,
    model: SystemModel
}
