// GBD/src/components/node/path/ClassNode.js
import { h } from '@logicflow/core'
import RectNode from '../basic/RectNode'

// 类图节点模型
class ClassModel extends RectNode.model {
  initNodeData(data) {
    super.initNodeData(data)
    this.width = 120
    this.height = 120
    // 初始化三个文本区域：类名、属性、操作
    this.className = data.className || 'ClassName'
    this.attributes = data.attributes || '- attributes'
    this.methods = data.methods || '+ methods()'
  }

  // 更新类名的方法
  updateClassName(newName) {
    this.className = newName
    this.setText({ className: this.className, attributes: this.attributes, methods: this.methods })
  }

  // 更新属性的方法
  updateAttributes(newAttributes) {
    this.attributes = newAttributes
    this.setText({ className: this.className, attributes: this.attributes, methods: this.methods })
  }

  // 更新方法的方法
  updateMethods(newMethods) {
    this.methods = newMethods
    this.setText({ className: this.className, attributes: this.attributes, methods: this.methods })
  }

  getNodeStyle() {
    const style = super.getNodeStyle()
    return { ...style, fill: '#FFFFFF', stroke: '#000000' }
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

  // 添加三个文本编辑区域
  getTextShapes() {
    const { x, y, className, attributes, methods } = this.props.model
    return [
      h('foreignObject', {
        x: x - 50,
        y: y - 60,
        width: 100,
        height: 20,
      }, [
        h('input', {
          value: className,
          oninput: (e) => this.props.model.updateClassName(e.target.value),
          style: {
            width: '100%',
            height: '100%',
            border: 'none',
            background: 'transparent',
            outline: 'none',
            fontSize: '12px',
            textAlign: 'center',
          }
        })
      ]),
      h('foreignObject', {
        x: x - 50,
        y: y - 20,
        width: 100,
        height: 40,
      }, [
        h('textarea', {
          value: attributes,
          oninput: (e) => this.props.model.updateAttributes(e.target.value),
          style: {
            width: '100%',
            height: '100%',
            border: 'none',
            background: 'transparent',
            outline: 'none',
            fontSize: '12px',
            resize: 'none',
          }
        })
      ]),
      h('foreignObject', {
        x: x - 50,
        y: y + 20,
        width: 100,
        height: 40,
      }, [
        h('textarea', {
          value: methods,
          oninput: (e) => this.props.model.updateMethods(e.target.value),
          style: {
            width: '100%',
            height: '100%',
            border: 'none',
            background: 'transparent',
            outline: 'none',
            fontSize: '12px',
            resize: 'none',
          }
        })
      ])
    ]
  }

  // 添加分隔线
  getSeparatorLines() {
    const { x, y, width } = this.props.model
    return [
      h('line', {
        x1: x - width / 2,
        y1: y - 40,
        x2: x + width / 2,
        y2: y - 40,
        stroke: '#000000',
        strokeWidth: 1,
      }),
      h('line', {
        x1: x - width / 2,
        y1: y,
        x2: x + width / 2,
        y2: y,
        stroke: '#000000',
        strokeWidth: 1,
      })
    ]
  }

  render() {
    return h('g', {}, [
      this.getResizeShape(),
      ...this.getSeparatorLines(),
      ...this.getTextShapes()
    ])
  }
}

export default {
  type: 'class',
  view: ClassView,
  model: ClassModel
}