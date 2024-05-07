<template>
  <el-container style="height: 100vh;">
    <el-header>
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5"><el-button link type="primary" icon="Plus" @click="handleAdd()" v-hasPermi="['business:interface:adddesignsql']">新增</el-button></el-col>
        <el-col :span="1.5"><el-button link type="primary" icon="Delete" @click="handleDelete()" v-hasPermi="['business:interface:removedesignsql']">删除</el-button></el-col>
      </el-row>
    </el-header>
    <el-main>
      <TableDraggingComponent :modelDefs="tablesModel" @updateTableDefine="updateTableDefine"  />
    </el-main>
    <el-footer>
      <div class="resizable" v-resize="onResize">
        <el-tabs v-model="activeName" @tab-click="handleElTabClick">
          <el-tab-pane label="列" name="columnTab">
            <ColumnTabPane/>
          </el-tab-pane>
          <el-tab-pane label="查询条件" name="searchConditionTab">
            <SearchConditionTabPane/>
          </el-tab-pane>
          <el-tab-pane label="排序" name="sortTab">
            <SortTabPane/>
          </el-tab-pane>
          <el-tab-pane label="SQL预览" name="sqlPreview">
            <SqlPreviewTabPane/>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-footer>
    <!--添加表 -->
    <el-dialog title="选择表" v-model="openSelectTab" width="500px" append-to-body>
      <el-form ref="tableFormRef" :model="form" :rules="tableFormRules" label-width="80px">
        <el-form-item label="选择表" prop="tableEnName">
          <el-tree-select
              v-model="form.modelDefId"
              :data="treeModelDef"
              :render-after-expand="false"
              style="width: 240px"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="selectTable">确 定</el-button>
          <el-button @click="openSelectTab=false">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </el-container>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import { tree,getDef,getAllField } from "@/api/business/def";
import TableDraggingComponent from "@/views/business/designsql/tableDraggingComponent.vue"
import { onMounted,Directive, watch,ref } from 'vue';
import { ElTabs, ElTabPane } from 'element-plus';
import ColumnTabPane from "@/views/business/designsql/columnTabPane.vue"
import SearchConditionTabPane from "@/views/business/designsql/searchConditionTabPane.vue"
import SortTabPane from "@/views/business/designsql/sortTabPane.vue"
import ColumnTabPane from "@/views/business/designsql/sqlPreviewTabPane.vue"
import SqlPreviewTabPane from "./sqlPreviewTabPane.vue";
interface Emits {
  (e: 'updateDesignModel', updateDesignModel: object): void
}

    const emit = defineEmits<Emits>()
    const  form=ref({});
    const  tableFormRules=ref({
        tableEnName: [
          { required: true, message: "请选择表", trigger: "blur" }
        ],
      })
    const  treeModelDef=ref([])
    const  openSelectTab=ref(false)
    const designModel =ref({
      selectColumnTabModel:{},//列表模型
      distinct:Boolean,//是否排重
      conditionTreeModel:{},//条件列树模型
      groupConditionTreeModel:{},//分组列树模型
      tablesModel:[],//表模型列表
      sortColumnModel:[],//排序列模型
      tableJoinModels:[],//表关系模型
    })
   const activeName=ref('columnTab')

    const props= defineProps({
      designModel: {
        type:Object,
        default: () => [{
        selectColumnTabModel: {
          type: Array,
          default: () => [{
            columAndExp: String,//列/表达式
            alias: String,//alias
            aggregation: String,//聚合
            group: Boolean,//是否分组
            chineseName: String,//中文名
            orgTableName: String,//原始表名
            tableAlias: String,//表别名
            fieldName: String,//字段名
            datasourceName:String,//数据源名称
          }]
        },
        distinct: {
          type: Boolean
        },
        conditionTreeModel: {
          type: Object,
          default: () => [{
            type: Number,
            conditionRelaType:String,//条件关系类型:All,Any,None,NotAll
            parentLevel: String,//父级层次
            currentLevel: Number,//当前级别
            childConditionTreeModels: Array,//子树模型
            left: String,//	左边操作列/表达式
            operator: String,//操作符
            right: String,// 右边操作列/表达式
            id:String,//行唯一标识=parentLevel+"."+currentLevel
          }]
        },
        groupConditionTreeModel: {
          type: Object
        },
        tablesModel: {
          type: Array,
          default: () => [{
            orgTableName: String,//原始表名
            tableAlias: String,//表别名
            tableCnName: String,//表中文名
            datasourceName: String,//数据源
            x: Number,
            y: Number,
            h: Number,
            w: Number,
            active: Boolean,
            columns: {
              type: Array,
              default: () => [{
                fieldName: String,//字段英文名
                fieldCnName: String,//字段中文名
              }]
            }
          }]
        },
        sortColumnModel: {
          type: Array,
          default: () => [{
            orgTableName: String,//原始表名
            tableAlias: String,//表别名
            columAndExp: String,//列/表达式
            alias: String,//列别名
            fieldName: String,//字段名
            descending: Boolean,//是否倒排
          }]
        },
        tableJoinModels: {
          type: Array,
          default: () => [{
            joinType: String,//表关联类型
            tableAlias: String,//表别名
            tableCnName: String,//表中文名
            dbColumnJoinModels: {
              type: Array,
              default: () => [{
                operatorSign: String,//操作符
                startColumnName: String,//开始列名
                endColumnName: String,//结束列名
                startPt: {
                  type: Object,
                  default: () => [{
                    x: Number,
                    y: Number
                  }]
                },//开始点
                endPt: {
                  type: Object,
                  default: () => [{
                    x: Number,
                    y: Number
                  }]
                },//结束点
                startIndex: Number,//开始索引
                endIndex: Number,//结束索引
                modelRect: {
                  type: Object,
                  default: () => [{
                    x: Number,
                    y: Number,
                    width: Number,
                    height: Number
                  }]
                }
              }]
            }
          }]
        },
        }]
        }
    })

    const Resize:Directive = {
        bind(el, binding) {
          const onResize = () => {
            let height = window.innerHeight - el.getBoundingClientRect().top;
            el.style.height = `${height}px`;
            binding.value && binding.value();
          };
          onResize();
          window.addEventListener('resize', onResize);

          el['onResize'] = onResize;
        },
        unbind(el) {
          window.removeEventListener('resize', el['onResize']);
        },
    };
    function  onResize() {
        // 这里可以添加你想要执行的代码，比如更新数据等
      }
    function  handleAdd() {
        openSelectTab.value = true
      }
    function  handleDelete(){
      designModel.value.tablesModel = [];
     }
    async function selectTable() {
      //检查目前是否有模型，有则提示，只能增加一个表;否则模型列表增加一个
      if (designModel.value.tablesModel.length > 0) {
        ElMessage('目前只支持一张表!请删除后再加入');
        return
      } else {
        //根据模型定义id查询模型
        let resp = await getDef(form.modelDefId)
        let modelDef = resp.data;
        //构造新模型加入模型列表
        let newModelDef={
          alias:'',
          cnName:'',
          enName:'',
          x: 100,
          y: 100,
          h: 100,
          w: 100,
          active: false,
          datasourceName:'',
          columns:[]
        }
        resp = await getAllField(modelDef);
        newModelDef.cnName = modelDef.cnName;
        newModelDef.enName = modelDef.enName;
        newModelDef.datasourceName = modelDef.datasourceName;
        for(let i=0;i<resp.data.length;i++){
          let item = resp.data[i];
          let tmpItem = {fieldName:item.fieldName,fieldCnName:item.fieldCnName}
          newModelDef.columns.push(tmpItem)
        }
        designModel.value.tablesModel.push(newModelDef);
      }
      openSelectTab.value = false;

    }
      /** 获取接口树列表 */
      function getTreeModelDef(){
      let tmp={};
      tree(tmp).then(response => {
        treeModelDef.value = response.data;
      });
     }
     function updateTableDefine( tableDefineItems) {
       designModel.value.tablesModel = JSON.parse(JSON.stringify(tableDefineItems));
       //更新父窗口模型
       emit('updateDesignModel', designModel.value);
     }

     onMounted(()=>{
       getTreeModelDef()
    })
    watch(() => props, val => {
      designModel.value.selectColumnTabModel = JSON.parse(JSON.stringify(props.selectColumnTabModel));
      designModel.value.distinct = props.distinct;
      designModel.value.conditionTreeModel = JSON.parse(JSON.stringify(props.conditionTreeModel));
      designModel.value.groupConditionTreeModel = JSON.parse(JSON.stringify(props.groupConditionTreeModel));
      designModel.value.tablesModel = JSON.parse(JSON.stringify(props.tablesModel));
      designModel.value.sortColumnModel = JSON.parse(JSON.stringify(props.sortColumnModel));
      designModel.value.tableJoinModels = JSON.parse(JSON.stringify(props.tableJoinModels));
    });
    //页签单击
    function handleElTabClick(tab, event){

    }
</script>

<style>
.resizable {
  overflow: auto;
  resize: vertical;
  cursor: n-resize;
  /* 设置一个初始高度 */
  height: calc(100vh - 100px);
  /* 设置边框以便于拖拽 */
  border-top: 2px solid #000;
}

.resizable:hover {
  border-top-color: #333;
}
</style>
