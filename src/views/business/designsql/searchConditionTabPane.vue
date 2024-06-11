<template>
  <div>
  <el-table :data="treeData" row-key="id" :tree-props="{children: 'childConditionTreeModels'}" @row-click="handleRowClick">
    <el-table-column  label="层次" width="100">
      <template #default="scope">
        {{scope.row.id}}
      </template>
    </el-table-column>
    <el-table-column  label="条件" width="1200">
      <template #default="scope">
        <el-select
            v-model="scope.row.conditionRelaType"

            style="width: 240px"
            v-show="scope.row.type===1"
        >
          <el-option
              v-for="item in conditionTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
        <el-row v-show="scope.row.type===2" :gutter="28">
          <el-col :span="8">
             <el-input v-model="scope.row.left" placeholder="请输入表达式或点击右边...按钮"/>
          </el-col>
          <el-col :span="2">
            <el-button size="small" @click="showSelectFieldOrParamDlg(scope.row,'left')">...</el-button>
          </el-col>
          <el-col :span="4">
            <el-select
                v-model="scope.row.operator"
                style="width: 100px"
            >
              <el-option
                  v-for="item in operators"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
              />
            </el-select>
          </el-col>
          <el-col :span="8">
            <el-input v-model="scope.row.right" placeholder="请输入表达式或点击右边...按钮"/>
          </el-col>
          <el-col :span="2">
            <el-button size="small" @click="showSelectFieldOrParamDlg(scope.row,'right')">...</el-button>
          </el-col>
          <el-col :span="8">
            <el-checkbox true-value="1" false-value="0" v-model="scope.row.isOptional" label="是否可选"></el-checkbox>
          </el-col>
        </el-row>
      </template>
    </el-table-column>
    <el-table-column label="操作" align="center" width="360" class-name="small-padding fixed-width">
      <template #default="scope">
        <el-button link type="primary" icon="Plus" @click="handleAdd(scope.row)" >新增条件</el-button>
        <el-button link type="primary" :disabled="!allowChangeToGroup" :icon="changToGroupIcon" @click="handleChangeToGroup(scope.row)" >改成组合条件</el-button>
        <el-button link type="primary" :disabled="!allowDeleteCondition" icon="Delete" @click="handleDelete(scope.row)" >删除条件</el-button>
      </template>
    </el-table-column>
  </el-table>
    <el-dialog title="选择字段或参数" v-model="open" width="500px" append-to-body>
      <el-tree
          :data="fieldOrParameterTreeData"
          :props="defaultProps"
          :highlight-current="true"
          node-key="id"
          ref="treeRef"
          :check-strictly="true"
          :expand-on-click-node="false"
          :show-checkbox="false"
          @node-click="handleNodeClick"
      ></el-tree>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="confirmOk">确 定</el-button>
          <el-button @click="open=false">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted,Directive, watch,ref,defineEmits } from 'vue';
import { useIcon } from "@/components/common/util";
import { genId } from "@/components/form/designer/util/common";

const fieldOrParameterTreeData = ref([
]);
const defaultProps = {
  children: 'children',
  label: 'label'
};
const currentNode = ref([]);
const changToGroupIcon = useIcon("ali_changetogroup")
const open = ref(false)
const props= defineProps({
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
      isOptional:String,//是否可选
    }]
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
  interfaceParameterModel: {
    type: Object,
    default: () => [{
      id: Number,//
      parameterName: String,//参数名
      parameterDesc: String,//参数描述
      isFrontpageVisible: String,//是否前端可见
      parameterType: String,//参数类型
      parameterFormat: String,//参数格式
      parentId: Number,//父参数id
      interfaceCode: String,//接口编码
      children: {
        type: Array,
        default: () => [{
          id: Number,//
          parameterName: String,//参数名
          parameterDesc: String,//参数描述
          isFrontpageVisible: String,//是否前端可见
          parameterType: String,//参数类型
          parameterFormat: String,//参数格式
          parentId: Number,//父参数id
          interfaceCode: String,//接口编码
        }]
      }
    }]
  },
})

const conditionTypes=ref([{label:'分支内所有条件必须匹配',value:'All'},
    {label:'分支内所有条件任意一个匹配',value:'Any'},
    {label:'分支中的任何条件都不能匹配',value:'None'},
    {label:'分支中没有一个条件必须匹配',value:'NotAll'}])
const operators=ref([
  {label:'=',value:'='},
  {label:'!=',value:'!='},
  {label:'<>',value:'<>'},
  {label:'>',value:'>'},
  {label:'<',value:'<'},
  {label:'>=',value:'>='},
  {label:'<=',value:'<='},
  {label:'LIKE',value:'LIKE'},
  {label:'NOT LIKE',value:'NOT LIKE'},
  {label:'IN',value:'IN'},
  {label:'NOT IN',value:'NOT IN'},
  {label:'BETWEEN',value:'BETWEEN'},
  {label:'NOT BETWEEN',value:'NOT BETWEEN'},
  {label:'IS NULL',value:'IS NULL'},
  {label:'IS NOT NULL',value:'IS NOT NULL'}
])
const allowChangeToGroup=ref(false)
const allowDeleteCondition = ref(false)
const treeData =ref([])
const emit = defineEmits(['updateConditionTreeModel'])
const currentRow =ref({})
const leftRightFlag = ref('')
const treeRef =ref()
const { proxy } = getCurrentInstance();

/**
 * 递归构造参数节点
 * @param interfaceParameterModel
 */
function recursionMakeTableNode(interfaceParameterModel,parentLabel) {

  let tableNode = {
    id:genId(),
    label:interfaceParameterModel.parameterName,
    children:[],
    nodeType:2,
    parentLabel:parentLabel,
    level:2,
  }
  for(let i=0;i<interfaceParameterModel.children.length;i++){
    let child = interfaceParameterModel.children[i];
    if(child.children.length>0){
      if(tableNode.parentLabel!='') {
        tableNode.children.push(recursionMakeTableNode(child, tableNode.parentLabel + "." + tableNode.label));
      }else{
        tableNode.children.push(recursionMakeTableNode(child,  tableNode.label));
      }
    }else{
      let parentLabel = tableNode.parentLabel==''?tableNode.label:tableNode.parentLabel+"."+tableNode.label;
      let  tableNodeChild = {
        id:genId(),
        label:child.parameterName,
        children:[],
        level:2,
        nodeType:2,
        parentLabel:parentLabel,
      }
      tableNode.children.push(tableNodeChild);
    }
  }
  return tableNode;
}

/**
 * 转换树形结构
 * @param tablesModel
 */
function convertTreeMode(tablesModel,interfaceParameterModel) {
  debugger;
  let treeData = [];
  for(let i=0;i<tablesModel.length;i++){
    let table = tablesModel[i];
    let tableNode = {
      id:genId(),
      label:(table.tableAlias==null||table.tableAlias=='')?table.enName:table.tableAlias,
      children:[],
      level:1,
      disabled: true,
      nodeType:1,
    }
    //循环加入字段
    for(let j=0;j<table.columns.length;j++){
      let column = table.columns[j];
      let columnNode = {
        id:genId(),
        label:column.fieldEnName,
        parentLabel:tableNode.label,
        children:[],
        nodeType:1,
        level:2
      }
      tableNode.children.push(columnNode);
    }
    treeData.push(tableNode);
   }
  //添加参数
  let tableNode = {
    id:genId(),
    label:'接口参数',
    children:[],
    level:1,
    disabled: true,
    nodeType:2,
  }
  for(let i=0;i<interfaceParameterModel.length;i++) {
    let childTableNode = recursionMakeTableNode(interfaceParameterModel[i],'');
    tableNode.children.push(childTableNode);
  }
  treeData.push(tableNode);
  return treeData;
}

watch(() => props, val => {
  debugger;
  let tmp1 = JSON.stringify(props.conditionTreeModel);
  let tmp2 = JSON.stringify(treeData.value);
  if(tmp1!=tmp2) {
    treeData.value = JSON.parse(JSON.stringify(props.conditionTreeModel));
  }
  //转换树形结构
  fieldOrParameterTreeData.value = convertTreeMode(props.tablesModel,props.interfaceParameterModel);
  console.log('watch treeData',JSON.stringify(treeData.value))
},{deep:true,immediate:true});
watch(()=>treeData.value,val=>{
  //如果发生变化，则更新
  let tmp1 = JSON.stringify(props.conditionTreeModel);
  let tmp2 = JSON.stringify(treeData.value);
  if(tmp1!=tmp2){
    emit('updateConditionTreeModel', treeData.value);
  }
},{deep:true,immediate:true})
//单击行
function handleRowClick(row, column, event, index){
    //如果最父级，不能改成组条件,不能删除
    if(row.id==='1'){
      allowChangeToGroup.value = false;
      allowDeleteCondition.value = false;
    }else if(row.type==1){
      allowChangeToGroup.value = false;
      allowDeleteCondition.value = true;
    }else{
      allowChangeToGroup.value = true;
      allowDeleteCondition.value = true;
    }
}

/**
 * 获取下一个级别，取子节点最大级别+1
 * @param children
 */
function getNextLevel(children) {
  let level=0;
  for(let i=0;i<children.length;i++){
    if(children[i].currentLevel>level){
      level = children[i].currentLevel;
    }
  }
  return level+1;
}

/**
 *
 * @param row
 * @param value
 */
function getParentNode(row, tree) {
  //从树根从上往下找
  if(tree.id.toString() === row.parentLevel.toString()){
    return tree
  }
  let foundNode = null;
  for(let i=0;i<tree.childConditionTreeModels.length;i++){
     if(tree.childConditionTreeModels[i].id.toString() ===row.parentLevel.toString()){
         return tree.childConditionTreeModels[i];
     }
     //否则查找下级
     foundNode = getParentNode(row,tree.childConditionTreeModels[i]);
     if(foundNode!=null){
       return foundNode;
     }
  }
  return null;
}

//新增条件
function handleAdd(row){
 //构造新行
 //如果row为类型1，为最顶级，则获取子节点最大序号+1作为新节点currentLevel
  //如果row为分组 ，则获取子节点最大序号+1作为新节点currentLevel
  let currentLevel1 =0
  let parentLevel;
  let parentNode;
  if(row.type===1){
    currentLevel1 = getNextLevel(row.childConditionTreeModels);
    parentLevel = row.id;
    parentNode = row;
  }else {
    //如果row为条件，则获取父节点，取父节点子节点最大序号+1作为新节点currentLevel
    parentNode = getParentNode(row,treeData.value[0]);
    if(parentNode!=null) {
      currentLevel1 = getNextLevel(parentNode.childConditionTreeModels);
      parentLevel = parentNode.id;
    }else{
      return;
    }
  }
  let child = {
    type: 2,
    conditionRelaType:'',
    parentLevel:parentLevel ,//父级层次
    currentLevel: currentLevel1,//当前级别
    id:parentLevel+"."+currentLevel1.toString(),//id
  }
  parentNode.childConditionTreeModels.push(child);
}
//改成条件组
function handleChangeToGroup(row){
  row.type = 1
  row.childConditionTreeModels=[];
}

/**
 * 查询row在child索引
 * @param row
 * @param child
 */
function findNodeIndex(row,child) {
  for(let i=0;i<child.length;i++){
    if(child[i].id ===row.id){
      return i;
    }
  }
  return -1
}

//删除条件
function handleDelete(row){
  //根节点不能删除
  if(row.id==='1'){
    return;
  }
  //查询父节点
  for(let i=0;i<treeData.value.length;i++) {
    let parentNode = getParentNode(row, treeData.value[i]);
    if (parentNode != null) {
      let index = findNodeIndex(row, parentNode.childConditionTreeModels)
      if (index != -1) {
        parentNode.childConditionTreeModels.splice(index, 1)
      }
    }
  }
}

/**
 * 显示选择字段或条件对话框
 * @param row
 * @param flag
 */
function showSelectFieldOrParamDlg(row,flag) {
  open.value = true;
  currentRow.value = row;
  leftRightFlag.value = flag
}
const handleNodeClick = (data, node, tree) => {
  // console.log(data); // 当前节点的数据对象
  // console.log(node); // 当前节点的Node对象，包含了当前节点的所有信息
  // console.log(tree); // 树组件的实例
  currentNode.value = data;
};
function confirmOk(){
  if(currentNode.value.level==2) {
    let backFillString = '';
    if(currentNode.value.nodeType==1) {
      backFillString = currentNode.value.parentLabel + "." + currentNode.value.label;
    }else{
      if(currentNode.value.parentLabel!='') {
        backFillString = "${" + currentNode.value.parentLabel + "." + currentNode.value.label + "}";
      }else{
        backFillString = "${" + currentNode.value.label + "}";
      }
    }
    if (leftRightFlag.value === 'left') {
      currentRow.value.left = backFillString;
    } else {
      currentRow.value.right = backFillString;
    }
    open.value = false;
  }else{
    proxy.$modal.msgSuccess("请选择字段或条件!");
  }
}

</script>

<style scoped>

</style>
