// 基础图形
import CircleNode from './basic/CircleNode'
import RectNode from './basic/RectNode'
import RectRadiusNode from './basic/StateNode'
import EllipseNode from './basic/EllipseNode'
import TextNode from './basic/TextNode'
import DiamondNode from './basic/DiamondNode'
// path绘制的个性化图形
import CylindeNode from './path/CylindeNode'
import TriangleNode from './path/TriangleNode'
import ParallelogramNode from './path/ParallelogramNode'
import ActorNode from './path/ActorNode'
import ClassNode from './path/ClassNode'
import PentagonNode from './path/PentagonNode'
import HexagonNode from './path/HexagonNode'
import SeptagonNode from './path/SeptagonNode'
import HeptagonNode from './path/HeptagonNode'
import TrapezoidNode from './path/TrapezoidNode'
import CrossNode from './path/CrossNode'
import MinusNode from './path/MinusNode'
import TimesNode from './path/TimesNode'
import DivideNode from './path/DivideNode'
import CubeNode from './path/CubeNode'
import DecisionNode from './path/DecisionNode'
import ExecutionSpecification from './path/ObjcetNode'
import ComponentNode from './path/ComponentNode'
// 多边形绘制的箭头
import LeftArrow from './arrow/LeftArrow'
import RightArrow from './arrow/RightArrow'
import HorizontalArrow from './arrow/HorizontalArrowNode'
import UpArrow from './arrow/UpArrowNode'
import DownArrow from './arrow/DownArrowNode'
import VerticalArrow from './arrow/VerticalArrowNode'
// image绘制图片节点
import ImageSetting from './image/Setting'
import ImageUser from './image/User'
import ImageCloud from './image/Cloud'
// image绘制左上角icon节点
import IconMessage from './icon/Message'
// 注册边
import Ployline from './edge/Polyline'
import Line from './edge/Line'
import Bezier from './edge/Bezier'
import Generalizationline from './edge/Generalizationline'
import Realizationline from './edge/Realizationline'
import Aggregationline from './edge/Aggregationline'
import Compositionline from './edge/Compositionline'
import Dependencyline from './edge/Dependencyline'
import Associationline from './edge/Associationline'
import Dashedline from './edge/Dashedline'
import BlackNode from './path/StartPointNode'
import WrappedBlackCircleNode from './path/EndPointNode'
import BlackrectNode from './path/ForkAndJoinNode'
import Swimlane from './path/Swimlane'
import BidirectionalAssociationline from './edge/BidirectionalAssociationline'
import ObjectNode from './path/Object'
import SequenceObjectNode from './path/SequenceObjectNode'
import Verticalblackrect from './path/LifeLine'
import MessageFlowline from './edge/MessageFlowline'
import SystemNode from './path/SystemNode'
import UsecaseNode from './path/UsecaseNode'
export const registerCustomElement = (lf) => {

  lf.register(CircleNode)
  lf.register(RectNode)
  lf.register(RectRadiusNode)
  lf.register(EllipseNode)
  lf.register(DiamondNode)
  lf.register(TextNode)

  lf.register(CylindeNode)
  lf.register(TriangleNode)
  lf.register(ParallelogramNode)
  lf.register(ActorNode)
  lf.register(ClassNode)
  lf.register(PentagonNode)
  lf.register(HexagonNode)
  lf.register(SeptagonNode)
  lf.register(HeptagonNode)
  lf.register(TrapezoidNode)
  lf.register(CrossNode)
  lf.register(MinusNode)
  lf.register(TimesNode)
  lf.register(DivideNode)
  lf.register(CubeNode)

  lf.register(LeftArrow)
  lf.register(RightArrow)
  lf.register(HorizontalArrow)
  lf.register(UpArrow)
  lf.register(DownArrow)
  lf.register(VerticalArrow)

  lf.register(ImageSetting)
  lf.register(ImageUser)
  lf.register(ImageCloud)
  lf.register(IconMessage)

  lf.register(Ployline)
  lf.register(Line)
  lf.register(Bezier)
  lf.register(Generalizationline)
  lf.register(Realizationline)
  lf.register(Aggregationline)
  lf.register(Compositionline)
  lf.register(Dependencyline)
  lf.register(Associationline)
  lf.register(Dashedline)
  lf.register(BlackNode)
  lf.register(WrappedBlackCircleNode)
  lf.register(BlackrectNode)
  lf.register(Swimlane)
  lf.register(BidirectionalAssociationline)
  lf.register(DecisionNode)
  lf.register(ExecutionSpecification)
  lf.register(ObjectNode)
  lf.register(SequenceObjectNode)
  lf.register(Verticalblackrect)
  lf.register(ComponentNode)
  lf.register(MessageFlowline)
  lf.register(SystemNode)
  lf.register(UsecaseNode)

}

