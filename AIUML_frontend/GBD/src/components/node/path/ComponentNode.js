import { h } from '@logicflow/core';
import { RectResize } from '@logicflow/extension';
import { getShapeStyleFuction } from '../getShapeStyleUtil';

// 组件模型
class ComponentNodeModel extends RectResize.model {
    initNodeData(data) {
        super.initNodeData(data);
        this.width = 140;
        this.height = 80;
    }

    getNodeStyle() {
        const style = super.getNodeStyle();
        const properties = this.getProperties();
        return getShapeStyleFuction(style, properties);
    }
}

// 组件视图
class ComponentNodeView extends RectResize.view {
    getResizeShape() {
        const { x, y, width, height } = this.props.model;

        // 动态获取节点样式
        const nodeStyle = this.props.model.getNodeStyle();

        // 小矩形的尺寸
        const smallWidth = width * 0.3;  // 小矩形宽度
        const smallHeight = height * 0.2;  // 小矩形高度
        const gap = smallHeight * 0.7;  // 小矩形间距
        const leftX = x - width / 2 - smallWidth / 2;  // 右移部分嵌入大矩形

        // 计算左侧连接线的分段位置
        const topLineEndY = y - gap - smallHeight;  // 第一段终点（左上小矩形的顶部）
        const middleLineStartY = y - gap;  // 第二段起点（左上小矩形的底部）
        const middleLineEndY = y + gap;  // 第二段终点（左下小矩形的顶部）
        const bottomLineStartY = y + gap + smallHeight;  // 第三段起点（左下小矩形的底部）

        // 主矩形背景
        const mainRect = {
            x: x - width / 2,
            y: y - height / 2,
            width,
            height,
            fill: nodeStyle.fill,
            stroke: nodeStyle.stroke,
            strokeWidth: nodeStyle.strokeWidth
        };

        // 左上小矩形背景
        const topSmallRect = {
            x: leftX,
            y: y - gap - smallHeight,
            width: smallWidth,
            height: smallHeight,
            fill: nodeStyle.fill,
            stroke: nodeStyle.stroke,
            strokeWidth: nodeStyle.strokeWidth
        };

        // 左下小矩形背景
        const bottomSmallRect = {
            x: leftX,
            y: y + gap,
            width: smallWidth,
            height: smallHeight,
            fill: nodeStyle.fill,
            stroke: nodeStyle.stroke,
            strokeWidth: nodeStyle.strokeWidth
        };

        // 主轮廓路径
        const outlinePath = {
            d: `
                M ${x - width / 2} ${y - height / 2} 
                L ${x + width / 2} ${y - height / 2} 
                L ${x + width / 2} ${y + height / 2} 
                L ${x - width / 2} ${y + height / 2} 
                Z`,
            fill: "none",
            stroke: nodeStyle.stroke,
            strokeWidth: nodeStyle.strokeWidth
        };

        // 左侧正确的连接线
        const leftConnectorPaths = [
            `M ${x - width / 2} ${y - height / 2} L ${x - width / 2} ${topLineEndY}`, // 第一段：从大矩形顶部到左上小矩形顶部
            `M ${x - width / 2} ${middleLineStartY} L ${x - width / 2} ${middleLineEndY}`, // 第二段：从左上小矩形底部到左下小矩形顶部
            `M ${x - width / 2} ${bottomLineStartY} L ${x - width / 2} ${y + height / 2}`  // 第三段：从左下小矩形底部到大矩形底部
        ];

        return h('g', {}, [
            // 绘制大矩形
            h('rect', { ...mainRect }),

            // 绘制主轮廓
            h('path', { ...outlinePath }),

            // 绘制左侧正确的连接线（避免穿过小矩形）
            ...leftConnectorPaths.map(path => h('path', { d: path, fill: "none", stroke: nodeStyle.stroke, strokeWidth: nodeStyle.strokeWidth })),

            // 绘制左上小矩形（覆盖在大矩形之上）
            h('rect', { ...topSmallRect }),

            // 绘制左下小矩形（覆盖在大矩形之上）
            h('rect', { ...bottomSmallRect })
        ]);
    }
}

// 注册组件
export default {
    type: 'pro-componentnode',
    view: ComponentNodeView,
    model: ComponentNodeModel
};