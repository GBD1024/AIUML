<template>
  <div class="home-page">
    <!-- 导航栏 -->
    <div class="nav">
      <div class="nav-title">AIUML 绘图系统</div>

      <!-- 用户头像 -->
      <el-dropdown class="user-avatar" @command="handleAvatarCommand">
        <span class="el-dropdown-link">
          <el-avatar :src="avatar" icon="el-icon-user-solid" :title="avatar ? '用户头像' : '正在加载头像...'">
            <i v-if="!avatar" class="el-icon-loading"></i>
          </el-avatar>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="settings">设置</el-dropdown-item>
          <el-dropdown-item command="logout">登出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <!-- 搜索框 -->
    <div class="search">
      <div class="search-keyword">
        <input type="text" v-model="searchQuery" placeholder="输入关键字搜索历史绘图" @keyup.enter="handleSearch" />
        <button @click="handleSearch">搜索</button>
      </div>
      <div class="search-collaboration">
        <input style="width: 150px;" type="text" v-model="collaborationQuery" placeholder="输入密钥与他人协作绘图"
          @keyup.enter="addDiagram" />
        <button @click="addDiagram">添加</button>
      </div>
    </div>
    <el-dialog title="重命名绘图" :visible.sync="renameDialogVisible">
      <el-input v-model="renameInput" placeholder="请输入新的名称"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="renameDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmRename">确定</el-button>
      </span>
    </el-dialog>


    <h3 style="padding: 0 20px;">新建绘图</h3>
    <div class="actions">
      <!-- 空白绘图 -->
      <button class="action-button" @click="goToDiagramWithTemplate(null)">
        <img :src="defaultImage" class="history-image" />
        <div class="history-name">空白绘图</div>
      </button>

      <button class="action-button" v-for="(template, index) in templateDiagrams" :key="'tpl-' + index"
        @click="goToDiagramWithTemplate(template.uml_data)">
        <img :src="template.cover_pic" class="history-image" />
        <div class="history-name">{{ template.name }}</div>
      </button>

    </div>



    <!-- 历史绘图展示 -->
    <!-- <div class="history-list">
      <h3>历史绘图</h3>

      <p v-if="loading">加载中...</p>

      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

      <div v-if="historyList.length > 0" class="history-grid">
        <div v-for="(item, index) in historyList" :key="index" class="history-item">
          <button class="history-button" @click="goToDiagramWithHistory(item.id)">
            <img :src="item.cover_pic || defaultImage" :alt="item.name" class="history-image" />
            <span class="history-name">{{ item.name }}</span>
          </button>
          <button class="delete-button" @click="handleDelete(item.id)">删除</button>
          <button class="rename-button" @click="openRenameDialog(item.id, item.name)">重命名</button>

        </div>
      </div>

      <p v-else-if="!loading">暂无历史绘图</p>
    </div> -->
    <div class="history-list">
      <!-- 加载 & 错误提示不变 -->
      <p v-if="loading">加载中...</p>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

      <!-- 自己创建的绘图 -->
      <h3>我创建的绘图</h3>
      <div v-if="historyOwn.length > 0" class="history-grid">
        <div v-for="(item, index) in historyOwn" :key="'own-' + index" class="history-item">
          <button class="history-button" @click="goToDiagramWithHistory(item.id)">
            <img :src="item.cover_pic || defaultImage" :alt="item.name" class="history-image" />
            <span class="history-name">{{ item.name }}</span>
          </button>
          <button class="delete-button" @click="handleDelete(item.id)">删除</button>
          <button class="rename-button" @click="openRenameDialog(item.id, item.name)">重命名</button>
        </div>
      </div>
      <p v-else-if="!loading">暂无我创建的绘图</p>

      <!-- 协作绘图 -->
      <h3>协作绘图</h3>
      <div v-if="historyCollaborative.length > 0" class="history-grid">
        <div v-for="(item, index) in historyCollaborative" :key="'collab-' + index" class="history-item">
          <div class="collab-tag">协作</div>
          <button class="history-button" @click="goToDiagramWithHistory(item.id)">
            <img :src="item.cover_pic || defaultImage" :alt="item.name" class="history-image" />
            <span class="history-name">{{ item.name || '未命名协作绘图' }}</span>

          </button>
          <button class="cancel-button" @click="handleCancelCollaboration(item.id)">取消协作</button>
        </div>
      </div>
      <p v-else-if="!loading">暂无协作绘图</p>
    </div>

  </div>
</template>

<script>
import axios from 'axios';
import { Dropdown, DropdownMenu, DropdownItem, Avatar } from 'element-ui';
import getUserInfo from '@/api/getUserInfo';

export default {
  components: {
    [Dropdown.name]: Dropdown,
    [DropdownMenu.name]: DropdownMenu,
    [DropdownItem.name]: DropdownItem,
    [Avatar.name]: Avatar
  },
  data() {
    return {
      renameDialogVisible: false,
      renameId: null,
      renameInput: "",
      avatar: '',
      defaultImage: "https://img0.baidu.com/it/u=1479232965,1336077163&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500",
      searchQuery: "",
      collaborationQuery: "",
      // historyList: [],
      historyOwn: [],
      historyCollaborative: [],
      loading: true,
      errorMessage: "",
      userId: '',
      templateDiagrams: [
        {
          name: "类图模板",
          cover_pic: "https://jing104-demo.oss-cn-beijing.aliyuncs.com/21e9f227-5c79-4e2b-b92f-d1a769b4ea35.png", // 更新封面
          uml_data: {
            "nodes": [
              {
                "id": "animal-class",
                "type": "class",
                "x": 200,
                "y": 105,
                "properties": {
                  "className": "Animal",
                  "attributes": [],
                  "methods": [],
                  "nodeSize": {
                    "width": 198.4375,
                    "height": 170.9375
                  }
                },
                "zIndex": 1016
              },
              {
                "id": "elephant-class",
                "type": "class",
                "x": 200,
                "y": 395,
                "properties": {
                  "className": "Elephant",
                  "attributes": [],
                  "methods": []
                },
                "zIndex": 1013
              },
              {
                "id": "water-object",
                "type": "object",
                "x": 490,
                "y": -35,
                "properties": {
                  "objectName": "Water",
                  "attributes": [],
                  "nodeSize": {
                    "width": 206.25,
                    "height": 96.875
                  }
                },
                "zIndex": 1011
              },
              {
                "id": "oxygen-object",
                "type": "object",
                "x": 630,
                "y": 210,
                "properties": {
                  "objectName": "Oxygen",
                  "attributes": []
                },
                "zIndex": 1018
              }
            ],
            "edges": [
              {
                "id": "inheritance-line",
                "type": "pro-generalizationline",
                "sourceNodeId": "elephant-class",
                "targetNodeId": "animal-class",
                "startPoint": {
                  "x": 200,
                  "y": 345
                },
                "endPoint": {
                  "x": 200,
                  "y": 190.46875
                },
                "properties": {},
                "zIndex": 1010,
                "pointsList": [
                  {
                    "x": 200,
                    "y": 345
                  },
                  {
                    "x": 200,
                    "y": 190.46875
                  }
                ]
              },
              {
                "id": "dependency-on-water",
                "type": "pro-dependencyline",
                "sourceNodeId": "animal-class",
                "targetNodeId": "water-object",
                "startPoint": {
                  "x": 205.3125,
                  "y": 19.53125
                },
                "endPoint": {
                  "x": 386.875,
                  "y": -35
                },
                "properties": {},
                "zIndex": 1012,
                "pointsList": [
                  {
                    "x": 205.3125,
                    "y": 19.53125
                  },
                  {
                    "x": 205.3125,
                    "y": -35
                  },
                  {
                    "x": 386.875,
                    "y": -35
                  }
                ]
              },
              {
                "id": "dependency-on-oxygen",
                "type": "pro-dependencyline",
                "sourceNodeId": "animal-class",
                "targetNodeId": "oxygen-object",
                "startPoint": {
                  "x": 299.21875,
                  "y": 105
                },
                "endPoint": {
                  "x": 580,
                  "y": 160
                },
                "properties": {},
                "zIndex": 1014,
                "pointsList": [
                  {
                    "x": 299.21875,
                    "y": 105
                  },
                  {
                    "x": 580,
                    "y": 105
                  },
                  {
                    "x": 580,
                    "y": 160
                  }
                ]
              }
            ]
          }
        },
        {
          name: "流程图模板",
          cover_pic: "https://jing104-demo.oss-cn-beijing.aliyuncs.com/307237a3-2513-460f-87a1-8b56570bc08e.png", // 更新封面
          uml_data: {
            "nodes": [
              {
                "id": "start-node",
                "type": "pro-startpointnode",
                "x": 145,
                "y": -2.5757174171303632e-14,
                "properties": {},
                "zIndex": 1000
              },
              {
                "id": "decision-node-1",
                "type": "pro-decisionnode",
                "x": 145,
                "y": 135,
                "properties": {
                  "nodeSize": {
                    "rx": 35.78125,
                    "ry": 31.875
                  }
                },
                "zIndex": 1021,
                "text": {
                  "x": 145,
                  "y": 135,
                  "value": "条件判断1"
                }
              },
              {
                "id": "process-node-1",
                "type": "pro-statenode",
                "x": 145,
                "y": 250,
                "properties": {
                  "nodeSize": {
                    "width": 104.6875,
                    "height": 86.25
                  }
                },
                "zIndex": 1024,
                "text": {
                  "x": 145,
                  "y": 250,
                  "value": "执行步骤1"
                }
              },
              {
                "id": "decision-node-2",
                "type": "pro-decisionnode",
                "x": 145,
                "y": 350,
                "properties": {
                  "nodeSize": {
                    "rx": 29.53125,
                    "ry": 36.5625
                  }
                },
                "zIndex": 1027,
                "text": {
                  "x": 145,
                  "y": 350,
                  "value": "条件判断2"
                }
              },
              {
                "id": "process-node-2",
                "type": "pro-statenode",
                "x": 145,
                "y": 455,
                "properties": {
                  "nodeSize": {
                    "width": 92.1875,
                    "height": 87.8125
                  }
                },
                "zIndex": 1029,
                "text": {
                  "x": 145,
                  "y": 455,
                  "value": "执行步骤2"
                }
              },
              {
                "id": "end-node",
                "type": "pro-endpointnode",
                "x": 145,
                "y": 550,
                "properties": {},
                "zIndex": 1005
              }
            ],
            "edges": [
              {
                "id": "edge-start-to-decision1",
                "type": "pro-line",
                "sourceNodeId": "start-node",
                "targetNodeId": "decision-node-1",
                "startPoint": {
                  "x": 145,
                  "y": 19.999999999999975
                },
                "endPoint": {
                  "x": 145,
                  "y": 103.125
                },
                "properties": {},
                "zIndex": -1
              },
              {
                "id": "edge-decision1-to-process1",
                "type": "pro-line",
                "sourceNodeId": "decision-node-1",
                "targetNodeId": "process-node-1",
                "startPoint": {
                  "x": 145,
                  "y": 166.875
                },
                "endPoint": {
                  "x": 145,
                  "y": 206.875
                },
                "properties": {},
                "zIndex": -1
              },
              {
                "id": "edge-process1-to-decision2",
                "type": "pro-line",
                "sourceNodeId": "process-node-1",
                "targetNodeId": "decision-node-2",
                "startPoint": {
                  "x": 145,
                  "y": 293.125
                },
                "endPoint": {
                  "x": 145,
                  "y": 313.4375
                },
                "properties": {},
                "zIndex": -1
              },
              {
                "id": "edge-decision2-to-process2",
                "type": "pro-line",
                "sourceNodeId": "decision-node-2",
                "targetNodeId": "process-node-2",
                "startPoint": {
                  "x": 145,
                  "y": 386.5625
                },
                "endPoint": {
                  "x": 145,
                  "y": 411.09375
                },
                "properties": {},
                "zIndex": -1
              },
              {
                "id": "edge-process2-to-end",
                "type": "pro-line",
                "sourceNodeId": "process-node-2",
                "targetNodeId": "end-node",
                "startPoint": {
                  "x": 145,
                  "y": 498.90625
                },
                "endPoint": {
                  "x": 145,
                  "y": 530
                },
                "properties": {},
                "zIndex": -1
              }
            ]
          }
        }, {
          name: "E-R图模板",
          cover_pic: "https://jing104-demo.oss-cn-beijing.aliyuncs.com/1b7df6a9-2b2d-415c-bd96-877e124344cd.png", // 更新封面
          uml_data: {
            "nodes": [
              {
                "id": "relationship",
                "type": "pro-decisionnode",
                "x": 365,
                "y": 270,
                "properties": {
                  "nodeSize": {
                    "rx": 42.5,
                    "ry": 33.75
                  }
                },
                "zIndex": 1097,
                "text": {
                  "x": 365,
                  "y": 270,
                  "value": "关系"
                }
              },
              {
                "id": "ea450312-055e-4752-b013-77be3261bca8",
                "type": "pro-systemnode",
                "x": 180,
                "y": 70,
                "properties": {},
                "zIndex": 1072,
                "text": {
                  "x": 180,
                  "y": 70,
                  "value": "属性一"
                }
              },
              {
                "id": "387a92da-8ce2-4bae-b4f3-7643ef9300d8",
                "type": "pro-usecasenode",
                "x": 365,
                "y": 155,
                "properties": {},
                "zIndex": 1099,
                "text": {
                  "x": 365,
                  "y": 155,
                  "value": "实体一"
                }
              },
              {
                "id": "fdfc4995-1aed-47b4-9ab7-11a87b4ebdd7",
                "type": "pro-usecasenode",
                "x": 365,
                "y": 390,
                "properties": {},
                "zIndex": 1095,
                "text": {
                  "x": 365,
                  "y": 390,
                  "value": "实体二"
                }
              },
              {
                "id": "c4855ce6-795e-4f5d-acb6-e28ade207a09",
                "type": "pro-systemnode",
                "x": 365,
                "y": -5,
                "properties": {},
                "zIndex": 1082,
                "text": {
                  "x": 365,
                  "y": -5,
                  "value": "属性二"
                }
              },
              {
                "id": "9b48c91b-8e67-4318-9340-aff206fa9dfb",
                "type": "pro-systemnode",
                "x": 575,
                "y": 70,
                "properties": {},
                "zIndex": 1084,
                "text": {
                  "x": 575,
                  "y": 70,
                  "value": "属性三"
                }
              },
              {
                "id": "b39ff889-1171-49b4-b18e-18fdc113dfef",
                "type": "pro-systemnode",
                "x": 170,
                "y": 520,
                "properties": {},
                "zIndex": 1075,
                "text": {
                  "x": 170,
                  "y": 520,
                  "value": "属性一"
                }
              },
              {
                "id": "e6f6e080-d41a-49da-9ff1-b73a7f43dbdc",
                "type": "pro-systemnode",
                "x": 365,
                "y": 520,
                "properties": {},
                "zIndex": 1077,
                "text": {
                  "x": 365,
                  "y": 520,
                  "value": "属性二"
                }
              },
              {
                "id": "ef1eca74-bae6-4673-a102-89373af206e9",
                "type": "pro-systemnode",
                "x": 545,
                "y": 520,
                "properties": {},
                "zIndex": 1079,
                "text": {
                  "x": 545,
                  "y": 520,
                  "value": "属性三"
                }
              }
            ],
            "edges": [
              {
                "id": "bb140ed6-e309-4959-88ed-0730379c91e2",
                "type": "pro-bidirectionalassociationline",
                "sourceNodeId": "387a92da-8ce2-4bae-b4f3-7643ef9300d8",
                "targetNodeId": "ea450312-055e-4752-b013-77be3261bca8",
                "startPoint": {
                  "x": 305.052105958591,
                  "y": 153.75
                },
                "endPoint": {
                  "x": 180,
                  "y": 110
                },
                "properties": {},
                "zIndex": 1086,
                "pointsList": [
                  {
                    "x": 305.052105958591,
                    "y": 153.75
                  },
                  {
                    "x": 180,
                    "y": 153.75
                  },
                  {
                    "x": 180,
                    "y": 110
                  }
                ]
              },
              {
                "id": "62c84ca2-d85c-4391-8aa0-a3737c61f03d",
                "type": "pro-bidirectionalassociationline",
                "sourceNodeId": "387a92da-8ce2-4bae-b4f3-7643ef9300d8",
                "targetNodeId": "c4855ce6-795e-4f5d-acb6-e28ade207a09",
                "startPoint": {
                  "x": 365,
                  "y": 125
                },
                "endPoint": {
                  "x": 365,
                  "y": 35
                },
                "properties": {},
                "zIndex": 1088,
                "pointsList": [
                  {
                    "x": 365,
                    "y": 125
                  },
                  {
                    "x": 365,
                    "y": 35
                  }
                ]
              },
              {
                "id": "467d4471-985c-4f52-a9fa-6565ade3c05d",
                "type": "pro-bidirectionalassociationline",
                "sourceNodeId": "387a92da-8ce2-4bae-b4f3-7643ef9300d8",
                "targetNodeId": "9b48c91b-8e67-4318-9340-aff206fa9dfb",
                "startPoint": {
                  "x": 424.947894041409,
                  "y": 153.75
                },
                "endPoint": {
                  "x": 575,
                  "y": 110
                },
                "properties": {},
                "zIndex": 1090,
                "pointsList": [
                  {
                    "x": 424.947894041409,
                    "y": 153.75
                  },
                  {
                    "x": 575,
                    "y": 153.75
                  },
                  {
                    "x": 575,
                    "y": 110
                  }
                ]
              },
              {
                "id": "8f94b01c-b691-4a8c-be7f-d893b9d5b04b",
                "type": "pro-bidirectionalassociationline",
                "sourceNodeId": "fdfc4995-1aed-47b4-9ab7-11a87b4ebdd7",
                "targetNodeId": "b39ff889-1171-49b4-b18e-18fdc113dfef",
                "startPoint": {
                  "x": 305,
                  "y": 390
                },
                "endPoint": {
                  "x": 170,
                  "y": 480
                },
                "properties": {},
                "zIndex": 1092,
                "pointsList": [
                  {
                    "x": 305,
                    "y": 390
                  },
                  {
                    "x": 170,
                    "y": 390
                  },
                  {
                    "x": 170,
                    "y": 480
                  }
                ]
              },
              {
                "id": "225b187f-c0ee-44d4-b6f8-4e4820663f9a",
                "type": "pro-bidirectionalassociationline",
                "sourceNodeId": "fdfc4995-1aed-47b4-9ab7-11a87b4ebdd7",
                "targetNodeId": "e6f6e080-d41a-49da-9ff1-b73a7f43dbdc",
                "startPoint": {
                  "x": 365,
                  "y": 420
                },
                "endPoint": {
                  "x": 365,
                  "y": 480
                },
                "properties": {},
                "zIndex": 1094,
                "pointsList": [
                  {
                    "x": 365,
                    "y": 420
                  },
                  {
                    "x": 365,
                    "y": 480
                  }
                ]
              },
              {
                "id": "de1de9cd-d401-48d9-b46b-cfb7e4c38805",
                "type": "pro-bidirectionalassociationline",
                "sourceNodeId": "fdfc4995-1aed-47b4-9ab7-11a87b4ebdd7",
                "targetNodeId": "ef1eca74-bae6-4673-a102-89373af206e9",
                "startPoint": {
                  "x": 425,
                  "y": 390
                },
                "endPoint": {
                  "x": 545,
                  "y": 480
                },
                "properties": {},
                "zIndex": 1096,
                "pointsList": [
                  {
                    "x": 425,
                    "y": 390
                  },
                  {
                    "x": 545,
                    "y": 390
                  },
                  {
                    "x": 545,
                    "y": 480
                  }
                ]
              },
              {
                "id": "3fe4df9b-d14d-477b-b799-ae14a99e8cfa",
                "type": "pro-bidirectionalassociationline",
                "sourceNodeId": "relationship",
                "targetNodeId": "fdfc4995-1aed-47b4-9ab7-11a87b4ebdd7",
                "startPoint": {
                  "x": 365,
                  "y": 303.75
                },
                "endPoint": {
                  "x": 365,
                  "y": 360
                },
                "properties": {},
                "text": {
                  "x": 365,
                  "y": 318.75,
                  "value": "1"
                },
                "zIndex": 1104,
                "pointsList": [
                  {
                    "x": 365,
                    "y": 303.75
                  },
                  {
                    "x": 365,
                    "y": 333.75
                  },
                  {
                    "x": 365,
                    "y": 333.75
                  },
                  {
                    "x": 365,
                    "y": 330
                  },
                  {
                    "x": 365,
                    "y": 330
                  },
                  {
                    "x": 365,
                    "y": 360
                  }
                ]
              },
              {
                "id": "5a3945c0-f462-4457-8042-6bf864f6d429",
                "type": "pro-bidirectionalassociationline",
                "sourceNodeId": "387a92da-8ce2-4bae-b4f3-7643ef9300d8",
                "targetNodeId": "relationship",
                "startPoint": {
                  "x": 365,
                  "y": 185
                },
                "endPoint": {
                  "x": 365,
                  "y": 236.25
                },
                "properties": {},
                "text": {
                  "x": 365,
                  "y": 200,
                  "value": "n"
                },
                "zIndex": 1102,
                "pointsList": [
                  {
                    "x": 365,
                    "y": 185
                  },
                  {
                    "x": 365,
                    "y": 215
                  },
                  {
                    "x": 365,
                    "y": 215
                  },
                  {
                    "x": 365,
                    "y": 206.25
                  },
                  {
                    "x": 365,
                    "y": 206.25
                  },
                  {
                    "x": 365,
                    "y": 236.25
                  }
                ]
              }
            ]
          }
        }
      ]
    };
  },
  mounted() {
    this.fetchUserInfo();
    this.fetchHistoryList();
  },
  methods: {
    // 用户相关方法
    async fetchUserInfo() {
      try {
        const info = await getUserInfo(localStorage.getItem('token'), axios);
        this.avatar = info.user_pic || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png';
        this.userId = info.id || '';
      } catch (error) {
        console.error('获取用户信息失败:', error);
        this.avatar = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png';
      }
    },

    handleAvatarCommand(command) {
      if (command === 'logout') {
        this.logout();
      } else if (command === 'settings') {
        this.$router.push('/settings');
      }
    },

    logout() {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      this.$message.success('已退出登录');
      this.$router.push('/login');
    },

    // 历史绘图方法
    async fetchHistoryList() {
      this.loading = true;
      this.errorMessage = "";
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        if (!token) {
          this.errorMessage = "未登录，请先登录！";
          return;
        }

        const response = await axios.get("/api/graph/getAllUmlGraphs", {
          headers: { "Authorization": token }
        });

        // if (response.data.code === 0) {
        //   this.historyList = response.data.info;
        // } else {
        //   this.errorMessage = "获取历史绘图失败：" + response.data.message;
        // }
        if (response.data.code === 0) {
          const data = response.data.info;
          console.log(data);
          this.historyOwn = data.own || [];
          this.historyCollaborative = data.collaborative || [];
        } else {
          this.errorMessage = "获取历史绘图失败：" + response.data.message;
        }
      } catch (error) {
        this.errorMessage = "请求失败，请检查网络连接";
        console.error("请求历史绘图数据出错:", error);
      } finally {
        this.loading = false;
      }
    },

    goToDiagramWithHistory(id) {
      let graphData = {};
      if (id !== -1) {
        const selectedGraph = [...this.historyOwn, ...this.historyCollaborative].find(graph => graph.id === id);
        if (!selectedGraph) return;
        graphData = selectedGraph.uml_data;
      }
      sessionStorage.setItem("graphData", graphData);
      this.$router.push({ path: "/diagram", query: { id } });
    },
    goToDiagramWithTemplate(umlData) {
      const data = umlData || { nodes: [], edges: [] }; // 空白或模板
      sessionStorage.setItem("graphData", JSON.stringify(data));
      this.$router.push({ path: "/diagram", query: { id: -1 } });
    },

    async handleDelete(id) {
      if (!confirm("确定要删除这个绘图吗？")) return;
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        const response = await axios.post(`/api/graph/delete?id=${id}`, null, {
          headers: { "Authorization": token }
        });
        if (response.data.code === 0) {
          this.$message.success("删除成功！");
          this.fetchHistoryList();
        } else {
          this.$message.error(`删除失败：${response.data.message}`);
        }
      } catch (error) {
        console.error("删除请求异常:", error);
        this.$message.error("删除请求失败！");
      }
    },
    openRenameDialog(id, currentName) {
      this.renameId = id;
      this.renameInput = currentName;
      this.renameDialogVisible = true;
    },

    confirmRename() {
      if (!this.renameInput.trim()) {
        this.$message.warning("名称不能为空！");
        return;
      }
      this.handleRename(this.renameId, this.renameInput);
      this.renameDialogVisible = false;
    },
    async handleCancelCollaboration(graphId) {
      if (!confirm("确定要取消该协作绘图吗？")) return;

      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");

        const response = await axios.post(
          "/api/collaboration/cancelCollaboration",
          { graph_id: graphId },
          { headers: { Authorization: token } }
        );

        if (response.data.code === 0) {
          this.$message.success("取消协作成功！");
          this.fetchHistoryList(); // 重新加载列表
        } else {
          this.$message.error(`取消失败：${response.data.message}`);
        }
      } catch (error) {
        console.error("取消协作请求失败：", error);
        this.$message.error("请求失败，请检查网络连接！");
      }
    },

    async handleRename(id, name) {

      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        const response = await axios.post(
          `/api/graph/rename?id=${id}&name=${name}`, null,
          { headers: { "Authorization": token } }
        );

        if (response.data.code === 0) {
          this.$message.success("重命名成功！");
          this.fetchHistoryList();
        } else {
          this.$message.error(`重命名失败：${response.data.message}`);
        }
      } catch (error) {
        console.error("重命名请求异常:", error);
        this.$message.error("重命名请求失败！");
      }
    },

    handleSearch() {
      alert(`搜索功能开发中，关键词：${this.searchQuery}`);
    },
    async addDiagram() {
      if (!this.collaborationQuery.trim()) {
        this.$message.warning("请输入协作密钥！");
        return;
      }

      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        if (!token) {
          this.$message.error("未登录，无法添加协作绘图！");
          return;
        }

        const payload = {
          secret_key: this.collaborationQuery.trim()
        };

        const response = await axios.post(
          "/api/collaboration/createCollaboration",
          payload,
          { headers: { Authorization: token } }
        );

        if (response.data.code === 0) {
          this.$message.success("协作绘图添加成功！");
          this.collaborationQuery = "";
          this.fetchHistoryList(); // 重新拉取列表以刷新显示
        } else {
          this.$message.error(`添加失败：${response.data.message}`);
        }
      } catch (error) {
        console.error("添加协作绘图失败:", error);
        this.$message.error("请求失败，请检查网络连接！");
      }
    }

  }
};
</script>

<style scoped>
.home-page {
  font-family: "Arial", sans-serif;
}

.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  background: #0d0d0d;
  height: 70px;
  position: relative;
}

.nav-title {
  font-size: 24px;
  font-weight: bold;
  color: #ffffff;
}

.user-avatar {
  margin-right: 20px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.user-avatar:hover {
  transform: scale(1.05);
}

.el-avatar {
  border: 2px solid #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.search {
  margin: 20px 0;
  display: flex;
  justify-content: space-between;
  /* 保持原有的布局 */
  width: 100%;
  /* 确保宽度为100% */
}

.search-keyword {
  display: flex;
  justify-content: center;
  /* 水平居中 */
  align-items: center;
  /* 垂直居中 */
  flex: 1;
  /* 占据剩余空间 */
}

.search-collaboration {
  display: flex;
  align-items: center;
  /* 垂直居中 */
  margin-right: 50px;
}

.search input {
  padding: 10px;
  width: 300px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 10px;
}

.search button {
  padding: 10px 20px;
  background-color: #4c4c4c;
  color: #ffffff;
  border: 1px solid #cccccc;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}



.search button:hover {
  background-color: #302222;
  /* 悬停浅灰色 */
  border-color: #999999;
  /* 深灰色边框 */
}


.history-list {
  margin-top: 20px;
  padding: 0 20px;
}

.history-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  padding: 10px;
}

.history-item {
  position: relative;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  overflow: hidden;
  transition: box-shadow 0.3s;
}

.history-item:hover {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.history-button {
  width: 100%;
  height: 200px;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
}

.history-image {
  width: 100%;
  height: 160px;
  object-fit: contain;
  /* 确保图片完整展示 */
  border-bottom: 1px solid #ebeef5;
  background-color: #fafafa;
  /* 可选：填充空白区域的背景色 */
}

.history-name {
  display: block;
  padding: 10px;
  font-size: 14px;
  color: #606266;
}

.delete-button,
.rename-button {
  position: absolute;
  padding: 5px 10px;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: opacity 0.3s;
  width: 65px;
  /* 设置固定宽度 */
  text-align: center;
  /* 确保文本居中对齐 */
}

.delete-button {
  top: 40px;
  right: 10px;
  background: #5a5a5a;
  /* 较深的灰色 */
}

.rename-button {
  top: 10px;
  right: 10px;
  background: #8a8a8a;
  /* 较浅的灰色 */
}

/* 悬停效果 */
.delete-button:hover {
  opacity: 0.8;
}

.rename-button:hover {
  opacity: 0.8;
}


.error-message {
  color: #ff4d4f;
  text-align: center;
  padding: 20px;
}

.actions {
  padding: 0 20px;
  margin-bottom: 30px;
}

.action-button {
  width: 25%;
  height: 200px;
  border-radius: 8px;
  border: 1px solid #ebeef5;
  background: #fafafa;
  cursor: pointer;
  transition: border-color 0.3s;
  margin-right: 10px;
}

.action-button:hover {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.collab-tag {
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: #409EFF;
  color: white;
  padding: 2px 6px;
  font-size: 12px;
  border-radius: 4px;
  z-index: 1;
}

.cancel-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #5a5a5a;
  ;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  cursor: pointer;
  width: 80px;
  text-align: center;
}

.cancel-button:hover {
  opacity: 0.8;
}
</style>