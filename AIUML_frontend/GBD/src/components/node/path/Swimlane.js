import { h } from '@logicflow/core';
import { RectResize } from '@logicflow/extension';

class SwimlaneModel extends RectResize.model {
  initNodeData(data) {
    super.initNodeData(data);
    this.width = 300; // 游泳道宽度
    this.height = 200; // 游泳道高度
    this.swimlanes = 3; // 游泳道数量
    this.sectionHeight = this.height / 3; // 每个区域的高度
    this.properties = {
      swimlaneName: 'Swimlane',
      activities: ['Activity 1', 'Activity 2', 'Activity 3']
    };
  }

  setSwimlaneName(name) {
    this.properties.swimlaneName = name;
  }

  updateActivity(index, newValue) {
    if (index < this.properties.activities.length) {
      this.properties.activities[index] = newValue;
    }
  }

  deleteActivity(index) {
    this.properties.activities.splice(index, 1);
  }
}

class SwimlaneView extends RectResize.view {
  getResizeShape() {
    const { model } = this.props;
    const { x, y, width, height, sectionHeight,properties } = model;
    const { swimlaneName, activities } = properties;

    const sectionStyle = {
      fill: '#ffffff',
      stroke: '#333',
      strokeWidth: 1,
      rx: 5,
      ry: 5
    };

    // 创建可编辑文本
    const createEditableText = (text, yPosition, editHandler) => {
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
            margin: 0,
            padding: '4px 0',
            whiteSpace: 'pre-wrap',
            cursor: 'text',
            outline: 'none'
          },
          contentEditable: true,
          innerHTML: text,
          onInput: (e) => {
            const target = e.target;
            const cursorPosition = getCaretPosition(target);
            editHandler(target.innerText);
            setTimeout(() => setCaretPosition(target, cursorPosition), 0);
          }
        })
      ]);
    };

    return h('g', {}, [
      // 游泳道背景
      h('rect', {
        ...sectionStyle,
        x: x - width / 2,
        y: y - height / 2,
        width,
        height,
        fill: '#f0f0f0'
      }),

      // 游泳道名称
      createEditableText(swimlaneName, y - height / 2 + sectionHeight / 2, (newName) => {
        model.setSwimlaneName(newName);
      }),

      // 活动区域
      ...activities.map((activity, index) => {
        const yPosition = y - height / 2 + sectionHeight + index * sectionHeight;
        return h('g', {}, [
          h('rect', {
            ...sectionStyle,
            x: x - width / 2,
            y: yPosition,
            width,
            height: sectionHeight
          }),
          createEditableText(activity, yPosition + sectionHeight / 2, (newValue) => {
            model.updateActivity(index, newValue);
          })
        ]);
      }),

      // 分割线
      h('line', {
        x1: x - width / 2,
        y1: y - height / 2 + sectionHeight,
        x2: x + width / 2,
        y2: y - height / 2 + sectionHeight,
        stroke: '#333',
        strokeWidth: 1
      }),
      h('line', {
        x1: x - width / 2,
        y1: y - height / 2 + 2 * sectionHeight,
        x2: x + width / 2,
        y2: y - height / 2 + 2 * sectionHeight,
        stroke: '#333',
        strokeWidth: 1
      })
    ]);
  }
}

function getCaretPosition(element) {
  let position = 0;
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    const preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(element);
    preCaretRange.setEnd(range.endContainer, range.endOffset);
    position = preCaretRange.toString().length;
  }
  return position;
}

function setCaretPosition(element, position) {
  const range = document.createRange();
  const selection = window.getSelection();
  const textNode = element.childNodes[0];

  if (textNode && textNode.nodeType === Node.TEXT_NODE) {
    range.setStart(textNode, position);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
  }
}

export default {
  type: 'swimlane',
  view: SwimlaneView,
  model: SwimlaneModel
};