import RectNode from './RectNode'

// 带圆角的矩形
class RectRadiusModel extends RectNode.model {
  setAttributes () {
    super.setAttributes()
    this.radius = 20
  }
}
export default {
  type: 'pro-statenode',
  view: RectNode.view,
  model: RectRadiusModel
}
