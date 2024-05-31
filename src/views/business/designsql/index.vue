<template>
  <el-container class="container">
    <el-header>
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5"><el-button link type="primary" icon="Plus" @click="handleAdd()" v-hasPermi="['business:interface:adddesignsql']">新增</el-button></el-col>
        <el-col :span="1.5"><el-button link type="primary" icon="Delete" @click="handleDelete()" v-hasPermi="['business:interface:removedesignsql']">删除</el-button></el-col>
        <el-col :span="1.5"><el-button link type="primary" icon="Edit" @click="handleSave()" v-hasPermi="['business:interface:savedesignsql']">保存</el-button></el-col>
      </el-row>
    </el-header>
    <el-main :style="{ height: topHeight + 'px' }" class="bordered-main">
      <TableDraggingComponent :tableDefineItems="designModel.tablesModel" @updateTableDefine="updateTableDefine"  />
    </el-main>
    <div class="splitter" @mousedown="startResize" @touchstart="startResize"></div>
    <el-footer class="bottom" :style="{ height: bottomHeight + 'px' }">
        <el-tabs v-model="activeName" @tab-click="handleElTabClick">
          <el-tab-pane label="列" name="columnTab">
            <ColumnTabPane v-model:selectColumnTabModel="designModel.selectColumnTabModel" :distinct="designModel.distinct" @updateDistinct="updateDistinct"/>
          </el-tab-pane>
          <el-tab-pane label="查询条件" name="searchConditionTab">
            <SearchConditionTabPane :conditionTreeModel="designModel.conditionTreeModel" :tablesModel="designModel.tablesModel" @updateConditionTreeModel="updateConditionTreeModel" />
          </el-tab-pane>
          <el-tab-pane label="排序" name="sortTab">
            <SortTabPane :validColumnModel="validColumnModel" :sortColumnModel="designModel.sortColumnModel" @updateSortColumnModel="updateSortColumnModel" />
          </el-tab-pane>
          <el-tab-pane label="SQL预览" name="sqlPreview">
            <SqlPreviewTabPane :designModel="designModel"/>
          </el-tab-pane>
        </el-tabs>
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
import { onMounted,Directive, watch,ref,computed,defineEmits,defineProps } from 'vue';
import { ElTabs, ElTabPane } from 'element-plus';
import SearchConditionTabPane from "@/views/business/designsql/searchConditionTabPane.vue"
import SortTabPane from "@/views/business/designsql/sortTabPane.vue"
import ColumnTabPane from "@/views/business/designsql/columnTabPane.vue"
import SqlPreviewTabPane from "./sqlPreviewTabPane.vue";
import {generatesql} from "@/api/business/interface"
import {updateSearchPersonalized} from "@/api/business/searchpersonalized"
const topHeight = ref(100);
const bottomHeight = ref(300);
let startY = 0;
let startTopHeight = 0;
const { proxy } = getCurrentInstance();

interface Emits {
  (e: 'updateDesignModel', updateDesignModel: object): void
}
const startResize = (event) => {
  event.preventDefault();
  startY = event.clientY;
  startTopHeight = topHeight.value;
  document.addEventListener('mousemove', doResize);
  document.addEventListener('touchmove', doResize);
  document.addEventListener('mouseup', stopResize);
  document.addEventListener('touchend', stopResize);
};

const doResize = (event) => {
  event.preventDefault();
  const diff = event.clientY - startY;
  if(startTopHeight + diff>50 && (500-startTopHeight - diff>50)) {
    topHeight.value = startTopHeight + diff;
    bottomHeight.value = 500 - topHeight.value; // 假设容器高度是500px
  }
};

const stopResize = () => {
  document.removeEventListener('mousemove', doResize);
  document.removeEventListener('touchmove', doResize);
  document.removeEventListener('mouseup', stopResize);
  document.removeEventListener('touchend', stopResize);
};

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
  conditionTreeModel:[],//条件列树模型
  groupConditionTreeModel:{},//分组列树模型
  tablesModel:[],//表模型列表
  sortColumnModel:[],//排序列模型
  tableJoinModels:[],//表关系模型
})
const activeName=ref('columnTab')

const props= defineProps({
  id:{
    type: Number
  },
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
      type: Array,
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


function  handleAdd() {
    openSelectTab.value = true
  }
function  handleDelete(){
  designModel.value.tablesModel = [];
 }

/**
 * 更新条件树模型
  * @param conditionTreeModel
 */
function updateConditionTreeModel(conditionTreeModel){
  let temp1 = JSON.stringify(designModel.value.conditionTreeModel);
  let temp2 = JSON.stringify(conditionTreeModel);
  if(temp1!=temp2) {
    designModel.value.conditionTreeModel = conditionTreeModel;
  }
}
async function selectTable() {
  //检查目前是否有模型，有则提示，只能增加一个表;否则模型列表增加一个
  if (designModel.value.tablesModel.length > 0) {
    ElMessage('目前只支持一张表!请删除后再加入');
    return
  } else {
    //根据模型定义id查询模型
    let resp = await getDef(form.value.modelDefId)
    let modelDef = resp.data;
    //构造新模型加入模型列表
    let newModelDef={
      alias:'',
      cnName:'',
      enName:'',
      x: 10,
      y: 10,
      h: 150,
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
      let tmpItem = {fieldEnName:item.fieldEnName,fieldCnName:item.fieldCnName}
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
    debugger;
   designModel.value.tablesModel = JSON.parse(JSON.stringify(tableDefineItems));
   //更新父窗口模型
   emit('updateDesignModel', designModel.value);
 }
 function updateDistinct(value){
   designModel.value.distinct = value;
 }
 onMounted(()=>{
   getTreeModelDef()
})
watch(() => props, val => {
  debugger;
  designModel.value.selectColumnTabModel = JSON.parse(JSON.stringify(props.designModel.selectColumnTabModel));
  designModel.value.distinct = props.designModel.distinct;
  designModel.value.conditionTreeModel = JSON.parse(JSON.stringify(props.designModel.conditionTreeModel));
  designModel.value.groupConditionTreeModel = JSON.parse(JSON.stringify(props.designModel.groupConditionTreeModel));
  designModel.value.tablesModel = JSON.parse(JSON.stringify(props.designModel.tablesModel));
  designModel.value.sortColumnModel = JSON.parse(JSON.stringify(props.designModel.sortColumnModel));
  designModel.value.tableJoinModels = JSON.parse(JSON.stringify(props.designModel.tableJoinModels));
},{deep: true,immediate: true});
//页签单击
function handleElTabClick(tab, event){

}

/**
 * 判断表列是否在排序列模型
 * @param tablesModelElement
 * @param column
 */
function isExistsInSortColumns(tablesModelElement: any, column: any) {
  let sortColumnModel1 = designModel.value.sortColumnModel;
  for(let i=0;i<sortColumnModel1.length;i++){
    if(sortColumnModel1[i].orgTableName === tablesModelElement.orgTableName &&
        sortColumnModel1[i].tableAlias === tablesModelElement.tableAlias &&
        sortColumnModel1[i].fieldName===tablesModelElement.fieldName){
        return true;
    }
  }
  return false;
}

/**
 * 构造排序列模型
 * @param tablesModelElement
 * @param column
 */
function makeSortColumn(tablesModelElement: any, column: any) {
   let sortColumn={
     orgTableName: tablesModelElement.enName,//原始表名
     tableAlias: tablesModelElement.alias,//表别名
     columAndExp: '',//列/表达式
     alias: '',//列别名
     fieldName: column.fieldEnName,//字段名
     descending: false//是否倒排
   }
   return sortColumn;
}

//计算排序字段有效列
const validColumnModel = computed(() => {
  //debugger;
  //所有表列，排除sortColumnModel就是有效列
  let validColumnModels=[];
  for(let i=0;i<designModel.value.tablesModel.length;i++){
    let columns = designModel.value.tablesModel[i].columns;
     for(let j=0;j<columns.length;j++){
         if(!isExistsInSortColumns(designModel.value.tablesModel[i],columns[j])){
           validColumnModels.push(makeSortColumn(designModel.value.tablesModel[i],columns[j]))
         }
     }
  }
  console.log('validColumnModels:'+JSON.stringify(validColumnModels))
  return validColumnModels;
})

/**
 * 更新排序字段模型
 * @param sortColumnModel
 */
function updateSortColumnModel(sortColumnModel) {
  let temp1 = JSON.stringify(designModel.value.sortColumnModel);
  let temp2 = JSON.stringify(sortColumnModel);
  if(temp1!=temp2) {
    designModel.value.sortColumnModel = sortColumnModel;
  }
}
//保存sql设计json及预览sql
async function  handleSave() {
 let updateRow ={
   id:props.id,
   designSql:JSON.stringify(designModel.value),
   produceSql:'',
 }
  updateRow.produceSql = await generatesql(designModel.value).data
  updateSearchPersonalized(updateRow).then(res => {
    console.log(res)
    if(res.code==200){
      proxy.$modal.msgSuccess("修改成功");
    }else{
      proxy.$modal.msgSuccess("修改成功");
    }
  })

}
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
.top, .bottom {
  resize: vertical;
  overflow: auto;
}
.splitter {
  margin-top: 10px;
  margin-bottom: 10px;
  height: 10px;
  cursor: ns-resize;
  background-color: #ccc;
}
.bordered-main {
  border: 1px solid #ccc; /* 边框样式，可以根据需要自定义颜色和宽度 */
  border-radius: 4px; /* 可选：圆角 */
}
</style>
