import { h } from '@logicflow/core';
import { RectResize } from '@logicflow/extension';

class ObjectModel extends RectResize.model {
  initNodeData(data) {
    super.initNodeData(data);
    this.width = 200;
    this.height = 100;  // 默认高度增加以展示更多内容
    
    // 对象图属性格式
    this.properties = {
      objectName: data.properties?.objectName || 'newObject',
      attributes: data.properties?.attributes || ['attribute = value']
    };
  }

  setObjectName(name) {
    this.setProperty('objectName', name);
  }

  updateAttribute(index, newValue) {
    const newAttributes = [...this.properties.attributes];
    if (index < newAttributes.length) {
      newAttributes[index] = newValue;
      this.setProperty('attributes', newAttributes);
    }
  }

  addAttribute() {
    this.setProperty('attributes', [...this.properties.attributes, 'newAttr = value']);
  }

  deleteAttribute(index) {
    const newAttributes = [...this.properties.attributes];
    if (newAttributes.length > 0) {
      newAttributes.splice(index, 1);
      this.setProperty('attributes', newAttributes);
    }
  }
}

class ObjectView extends RectResize.view {
  getResizeShape() {
    const { x, y, width, height } = this.props.model;
    const { objectName, attributes } = this.props.model.properties;
    const nodeStyle = this.props.model.getNodeStyle();

    // 各区域高度定义（上下平分）
    const titleHeight = height / 2;
    const contentHeight = height / 2;

    const sectionStyle = {
      fill: '#ffffff',
      stroke: nodeStyle.stroke || '#333',
      strokeWidth: nodeStyle.strokeWidth || 1,
      rx: nodeStyle.rx || 5,
      ry: nodeStyle.ry || 5
    };

    const createEditableText = (text, yPosition, isBold, editHandler, index) => {
      let lastSelection = null;

      return h('g', {}, [
        h('foreignObject', {
          x: x - width / 2 + 20,
          y: yPosition - 14,
          width: width - 40,
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
              outline: 'none',
              textDecoration: isBold ? 'underline' : 'none' // 对象名下划线
            },
            contentEditable: true,
            innerHTML: text,
            onFocus: () => {
              const selection = window.getSelection();
              if (selection.rangeCount > 0) {
                lastSelection = selection.getRangeAt(0);
              }
            },
            onInput: () => {
              const selection = window.getSelection();
              if (selection.rangeCount > 0) {
                lastSelection = selection.getRangeAt(0);
              }
            },
            onBlur: (e) => {
              editHandler(e.target.innerText);
              setTimeout(() => {
                if (lastSelection) {
                  const selection = window.getSelection();
                  selection.removeAllRanges();
                  selection.addRange(lastSelection);
                }
              }, 0);
            }
          })
        ]),
        index !== undefined &&
        h('text', {
          x: x - width / 2 + 5,
          y: yPosition,
          fontSize: '14px',
          fontWeight: 'bold',
          cursor: 'pointer',
          fill: 'red',
          onClick: () => this.props.model.deleteAttribute(index)
        }, '−')
      ]);
    };

    return h('g', {}, [
      // 上半区：对象名（带下划线）
      h('rect', {
        ...sectionStyle,
        x: x - width / 2,
        y: y - height / 2,
        width,
        height: titleHeight,
        fill: '#f0f0f0'
      }),
      createEditableText(
        objectName,
        y - height / 2 + titleHeight / 2 - 7,  // 垂直居中微调
        true,
        (newName) => this.props.model.setObjectName(newName)
      ),

      // 下半区：属性列表
      h('rect', {
        ...sectionStyle,
        x: x - width / 2,
        y: y - height / 2 + titleHeight,
        width,
        height: contentHeight
      }),
      ...attributes.map((attr, index) =>
        createEditableText(
          attr,
          y - height / 2 + titleHeight + index * 24 + 12,
          false,
          (newValue) => this.props.model.updateAttribute(index, newValue),
          index
        )
      ),

      // 添加按钮（固定在右下角）
      h('text', {
        x: x + width / 2 - 15,
        y: y - height / 2 + titleHeight + attributes.length * 24 + 10,
        fontSize: '14px',
        fontWeight: 'bold',
        cursor: 'pointer',
        fill: '#007bff',
        onClick: () => this.props.model.addAttribute()
      }, '+'),

      // 中间分割线
      h('line', {
        x1: x - width / 2,
        y1: y,
        x2: x + width / 2,
        y2: y,
        stroke: '#333',
        strokeWidth: 1
      })
    ]);
  }
}

export default {
  type: 'object',
  view: ObjectView,
  model: ObjectModel
};