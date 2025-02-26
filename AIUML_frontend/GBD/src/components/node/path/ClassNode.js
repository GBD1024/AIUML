// GBD/src/components/node/path/ClassNode.js
import { h } from '@logicflow/core'
import RectNode from '../basic/RectNode'

// 类图节点模型
class ClassModel extends RectNode.model {
  initNodeData(data) {
    super.initNodeData(data)
    this.width = 120
    this.height = 80
    this.text = {
      value: 'ClassName\n- attribute1\n+ method1()',
      x: this.x,
      y: this.y,
    }
  }
  getNodeStyle() {
    const style = super.getNodeStyle()
    return { ...style, fill: '#FFFFFF', stroke: '#000000' } // 设置类图的样式
  }
}

// 类图节点视图
class ClassView extends RectNode.view {
  getResizeShape() {
    const { x, y, width, height } = this.props.model
    const style = this.props.model.getNodeStyle()
    return h('rect', {
      x: x - width / 2,
      y: y - height / 2,
      width,
      height,
      ...style
    })
  }
}

export default {
  type: 'class',
  view: ClassView,
  model: ClassModel
}