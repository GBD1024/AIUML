import { h } from '@logicflow/core';
import { RectResize } from '@logicflow/extension';

class ClassModel extends RectResize.model {
  initNodeData(data) {
    super.initNodeData(data);
    this.width = 200;
    this.height = 160;
    this.properties = {
      className: 'NewClass',
      attributes: ['+ attribute'],
      methods: ['+ method']
    };
  }

  setClassName(name) {
    this.setProperty('className', name);
  }

  updateAttribute(index, newValue) {
    const newAttributes = [...this.properties.attributes];
    if (index < newAttributes.length) {
      newAttributes[index] = newValue;
      this.setProperty('attributes', newAttributes);
    }
  }

  updateMethod(index, newValue) {
    const newMethods = [...this.properties.methods];
    if (index < newMethods.length) {
      newMethods[index] = newValue;
      this.setProperty('methods', newMethods);
    }
  }

  addAttribute() {
    this.setProperty('attributes', [...this.properties.attributes, '+ newAttribute']);
  }

  addMethod() {
    this.setProperty('methods', [...this.properties.methods, '+ newMethod']);
  }

  deleteAttribute(index) {
    const newAttributes = [...this.properties.attributes];
    if (newAttributes.length > 0) {
      newAttributes.splice(index, 1);
      this.setProperty('attributes', newAttributes);
    }
  }

  deleteMethod(index) {
    const newMethods = [...this.properties.methods];
    if (newMethods.length > 0) {
      newMethods.splice(index, 1);
      this.setProperty('methods', newMethods);
    }
  }
}

class ClassView extends RectResize.view {
  getResizeShape() {
    const { x, y, width, height } = this.props.model;
    const { className, attributes, methods } = this.props.model.properties;
    const nodeStyle = this.props.model.getNodeStyle();

    // 计算动态区域高度
    const titleHeight = height * 0.25;
    const contentHeight = height - titleHeight;
    const attrHeight = contentHeight / 2;
    const methodHeight = contentHeight / 2;

    const sectionStyle = {
      fill: '#ffffff',
      stroke: nodeStyle.stroke || '#333',
      strokeWidth: nodeStyle.strokeWidth || 1,
      rx: nodeStyle.rx || 5,
      ry: nodeStyle.ry || 5
    };

    const createEditableText = (text, yPosition, isBold, editHandler, index, isAttribute) => {
      return h('g', {}, [
        // 先渲染可编辑文本
        h('foreignObject', {
          x: x - width / 2 + 20, // 向右偏移，避免挡住 `-`
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
              outline: 'none'
            },
            contentEditable: true,
            innerHTML: text,
            onInput: (e) => editHandler(e.target.innerText)
          })
        ]),

        // ✅ 只有属性和方法才有 `-` 按钮，类名不会有
        index !== undefined &&
        h('text', {
          x: x - width / 2 + 5, // **靠左放置**
          y: yPosition,
          fontSize: '14px',
          fontWeight: 'bold',
          cursor: 'pointer',
          fill: 'red',
          onClick: () => isAttribute
            ? this.props.model.deleteAttribute(index)
            : this.props.model.deleteMethod(index)
        }, '−')
      ]);
    };

    return h('g', {}, [
      // ✅ 类名区域（无 `-` 按钮）
      h('rect', {
        ...sectionStyle,
        x: x - width / 2,
        y: y - height / 2,
        width,
        height: titleHeight,
        fill: '#f0f0f0'
      }),
      createEditableText(className, y - height / 2 + titleHeight / 2, true,
        (newName) => this.props.model.setClassName(newName)),

      // ✅ 属性区域
      h('rect', {
        ...sectionStyle,
        x: x - width / 2,
        y: y - height / 2 + titleHeight,
        width,
        height: attrHeight
      }),
      ...attributes.map((attr, index) =>
        createEditableText(attr,
          y - height / 2 + titleHeight + index * 24 + 12,
          false,
          (newValue) => this.props.model.updateAttribute(index, newValue),
          index,
          true // 表示是属性
        )
      ),

      // ✅ `+` 按钮
      h('text', {
        x: x + width / 2 - 15,
        y: y - height / 2 + titleHeight + attributes.length * 24 + 10,
        fontSize: '14px',
        fontWeight: 'bold',
        cursor: 'pointer',
        fill: '#007bff',
        onClick: () => this.props.model.addAttribute()
      }, '+'),

      // ✅ 方法区域
      h('rect', {
        ...sectionStyle,
        x: x - width / 2,
        y: y - height / 2 + titleHeight + attrHeight,
        width,
        height: methodHeight
      }),
      ...methods.map((method, index) =>
        createEditableText(method,
          y - height / 2 + titleHeight + attrHeight + index * 24 + 12,
          false,
          (newValue) => this.props.model.updateMethod(index, newValue),
          index,
          false // 表示是方法
        )
      ),

      // ✅ `+` 按钮
      h('text', {
        x: x + width / 2 - 15,
        y: y - height / 2 + titleHeight + attrHeight + methods.length * 24 + 10,
        fontSize: '14px',
        fontWeight: 'bold',
        cursor: 'pointer',
        fill: '#007bff',
        onClick: () => this.props.model.addMethod()
      }, '+'),

      // ✅ 分割线
      h('line', {
        x1: x - width / 2,
        y1: y - height / 2 + titleHeight,
        x2: x + width / 2,
        y2: y - height / 2 + titleHeight,
        stroke: '#333',
        strokeWidth: 1
      }),
      h('line', {
        x1: x - width / 2,
        y1: y - height / 2 + titleHeight + attrHeight,
        x2: x + width / 2,
        y2: y - height / 2 + titleHeight + attrHeight,
        stroke: '#333',
        strokeWidth: 1
      })
    ]);
  }
}

export default {
  type: 'class',
  view: ClassView,
  model: ClassModel
};
