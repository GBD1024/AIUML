import { h } from '@logicflow/core'
import { RectResize } from '@logicflow/extension'

class ClassModel extends RectResize.model {
  initNodeData(data) {
    super.initNodeData(data)
    this.width = 200
    this.height = 160
    this.properties = {
      className: 'NewClass',
      attributes: ['+ attributes'],
      methods: ['+ methods']
    }
  }

  setClassName(name) {
    this.properties.className = name
    this.changeNodeId(name) // 可选：同步修改节点ID
  }

  updateAttribute(index, newValue) {
    if (index < this.properties.attributes.length) {
      this.properties.attributes[index] = newValue
    }
  }

  updateMethod(index, newValue) {
    if (index < this.properties.methods.length) {
      this.properties.methods[index] = newValue
    }
  }

  deleteAttribute(index) {
    this.properties.attributes.splice(index, 1)
  }

  deleteMethod(index) {
    this.properties.methods.splice(index, 1)
  }
}

class ClassView extends RectResize.view {
  getResizeShape() {
    const { x, y, width, height } = this.props.model
    const { className, attributes, methods } = this.props.model.properties
    const nodeStyle = this.props.model.getNodeStyle()

    const sectionStyle = {
      fill: '#ffffff',
      stroke: nodeStyle.stroke || '#333',
      strokeWidth: nodeStyle.strokeWidth || 1,
      rx: nodeStyle.rx || 5,
      ry: nodeStyle.ry || 5
    }

    // 创建可编辑文本
    const createEditableText = (text, yPosition, isBold, editHandler) => {
      return h('foreignObject', {
        x: x - width / 2 + 8,
        y: yPosition - 14,
        width: width - 16,
        height: 24,
        style: 'overflow: visible'
      }, [
        h('div', {
          style: {
            fontFamily: 'Arial',
            fontSize: '14px',
            fontWeight: isBold ? 'bold' : 'normal',
            margin: 0,
            padding: '4px 0',
            whiteSpace: 'pre-wrap',
            cursor: 'text',
            outline: 'none'
          },
          contentEditable: true,
          innerHTML: text,
          onInput: (e) => {
            const target = e.target
            const cursorPosition = getCaretPosition(target) // 获取光标位置
            editHandler(target.innerText) // 更新模型
            setTimeout(() => setCaretPosition(target, cursorPosition), 0) // 恢复光标位置
          }
        })
      ])
    }

    return h('g', {}, [
      // 类名区域
      h('rect', {
        ...sectionStyle,
        x: x - width / 2,
        y: y - height / 2,
        width,
        height: height * 0.25,
        fill: '#f0f0f0'
      }),
      createEditableText(className, y - height / 2 + (height * 0.25) / 2, true,
        (newName) => this.props.model.setClassName(newName)),

      // 属性区域
      h('rect', {
        ...sectionStyle,
        x: x - width / 2,
        y: y - height / 2 + height * 0.25,
        width,
        height: height * 0.375
      }),
      ...attributes.map((attr, index) =>
        createEditableText(attr,
          y - height / 2 + height * 0.25 + index * 24 + 12,
          false,
          (newValue) => this.props.model.updateAttribute(index, newValue))
      ),

      // 方法区域
      h('rect', {
        ...sectionStyle,
        x: x - width / 2,
        y: y - height / 2 + height * 0.625,
        width,
        height: height * 0.375
      }),
      ...methods.map((method, index) =>
        createEditableText(method,
          y - height / 2 + height * 0.625 + index * 24 + 12,
          false,
          (newValue) => this.props.model.updateMethod(index, newValue))
      ),

      // 分割线
      h('line', {
        x1: x - width / 2,
        y1: y - height / 2 + height * 0.25,
        x2: x + width / 2,
        y2: y - height / 2 + height * 0.25,
        stroke: '#333',
        strokeWidth: 1
      }),
      h('line', {
        x1: x - width / 2,
        y1: y - height / 2 + height * 0.625,
        x2: x + width / 2,
        y2: y - height / 2 + height * 0.625,
        stroke: '#333',
        strokeWidth: 1
      })
    ])
  }
}

// 获取光标位置
function getCaretPosition(element) {
  let position = 0
  const selection = window.getSelection()
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0)
    const preCaretRange = range.cloneRange()
    preCaretRange.selectNodeContents(element)
    preCaretRange.setEnd(range.endContainer, range.endOffset)
    position = preCaretRange.toString().length
  }
  return position
}

// 设置光标位置
function setCaretPosition(element, position) {
  const range = document.createRange()
  const selection = window.getSelection()
  const textNode = element.childNodes[0]

  if (textNode && textNode.nodeType === Node.TEXT_NODE) {
    range.setStart(textNode, position)
    range.collapse(true)
    selection.removeAllRanges()
    selection.addRange(range)
  }
}

export default {
  type: 'class',
  view: ClassView,
  model: ClassModel
}