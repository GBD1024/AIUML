import { h } from '@logicflow/core'
import RectNode from '../basic/RectNode'
import { getShapeStyleFuction, getTextStyleFunction } from '../getShapeStyleUtil'

// 长方体
class CubeModel extends RectNode.model {
  initNodeData(data) {
    super.initNodeData(data)
    this.width = 80
    this.height = 80
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

class CubeView extends RectNode.view {
  getResizeShape() {
    const { x, y, width, height } = this.props.model
    const style = this.props.model.getNodeStyle()
    
    // 正方体三个面的路径定义（保持原有宽高）
    const frontFace = `
      M ${x - width/2} ${y - height/4}
      L ${x + width/2} ${y - height/4}
      L ${x + width/2} ${y + height/2}
      L ${x - width/2} ${y + height/2}
      Z
    `

    const topFace = `
      M ${x - width/2} ${y - height/4}
      L ${x - width/4} ${y - height/2}
      L ${x + 3*width/4} ${y - height/2}
      L ${x + width/2} ${y - height/4}
      Z
    `

    const sideFace = `
      M ${x + width/2} ${y - height/4}
      L ${x + 3*width/4} ${y - height/2}
      L ${x + 3*width/4} ${y + height/4}
      L ${x + width/2} ${y + height/2}
      Z
    `

    return h('g', {}, [
      // 正面（使用原样式）
      h('path', {
        ...style,
        d: frontFace
      }),

      // 顶面（浅色变体）
      h('path', {
        ...style,
        d: topFace,
        fill: '#e0e0e0' // 可选：添加立体感
      }),

      // 侧面（中灰变体）
      h('path', {
        ...style,
        d: sideFace,
        fill: '#bdbdbd' // 可选：添加立体感
      })
    ])
  }
}


export default {
  type: 'cube',
  view: CubeView,
  model: CubeModel
}