import CircleNode from '../basic/CircleNode.js'
// 椭圆
class UsecaseModel extends CircleNode.model {
    initNodeData(data) {
        super.initNodeData(data)
        this.rx = 60
        this.ry = 30
    }
    getNodeStyle() {
        const style = super.getNodeStyle()
        return { ...style }
    }
}
export default {
    type: 'pro-usecasenode',
    view: CircleNode.view,
    model: UsecaseModel
}
