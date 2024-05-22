<template>
  <el-table :data="treeData" row-key="id" :tree-props="{children: 'childConditionTreeModels'}" @row-click="handleRowClick">
    <el-table-column  label="层次">
      <template #default="scope">
        {{scope.row.id}}
      </template>
    </el-table-column>
    <el-table-column  label="条件">
      <template #default="scope">
        <el-select
            v-model="scope.row.conditionRelaType"
            size="small"
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
        <el-row v-show="scope.row.type===2">
          <el-col>
             <el-input v-model="scope.row.left" placeholder="请输入表达式或点击右边...按钮"/>
          </el-col>
          <el-col>
            <el-button @click="showSelectFieldOrParamDlg('left')">...</el-button>
          </el-col>
          <el-col>
            <el-select
                v-model="scope.row.operator"
                size="small"
                style="width: 240px"
            >
              <el-option
                  v-for="item in operators"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
              />
            </el-select>
          </el-col>
          <el-col>
            <el-input v-model="scope.row.right" placeholder="请输入表达式或点击右边...按钮"/>
          </el-col>
          <el-col>
            <el-button @click="showSelectFieldOrParamDlg('right')">...</el-button>
          </el-col>
        </el-row>
      </template>
    </el-table-column>
    <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
      <template #default="scope">
        <el-button link type="primary" icon="Plus" @click="handleAdd(scope.row)" >新增条件</el-button>
        <el-button link type="primary" disabled="!allowChangeToGroup" :icon="changToGroupIcon" @click="handleChangeToGroup(scope.row)" >改成组合条件</el-button>
        <el-button link type="primary" disabled="!allowDeleteCondition" icon="Delete" @click="handleDelete(scope.row)" >删除条件</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import { onMounted,Directive, watch,ref,defineEmits } from 'vue';
import { useIcon } from "@/components/common/util";
const changToGroupIcon = useIcon("ali_changetogroup")

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
    }]
  }
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
watch(() => props, val => {
  debugger;
  let tmp1 = JSON.stringify(props.conditionTreeModel);
  let tmp2 = JSON.stringify(treeData.value);
  if(tmp1!=tmp2) {
    treeData.value = JSON.parse(JSON.stringify(props.conditionTreeModel));
  }
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
  let level;
  for(let i=0;i<children.length;i++){
    if(children[i].level>level){
      level = children[i].level;
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
  if(tree.id === row.parentLevel){
    return tree
  }
  let foundNode = null;
  for(let i=0;i<tree.childConditionTreeModels.length;i++){
     if(tree.childConditionTreeModels[i].id ===row.parentLevel){
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
  let currentLevel =0
  let parentLevel;
  let parentNode;
  if(row.type===1){
    currentLevel = getNextLevel(row.childConditionTreeModels);
    parentLevel = row.id;
    parentNode = row;
  }else {
    //如果row为条件，则获取父节点，取父节点子节点最大序号+1作为新节点currentLevel
    parentNode = getParentNode(row,treeData.value);
    if(parentNode!=null) {
      currentLevel = getNextLevel(parentNode.childConditionTreeModels);
      parentLevel = parentNode.id;
    }else{
      return;
    }
  }
  let child = {
    type: 2,
    conditionRelaType:'',
    parentLevel:parentLevel ,//父级层次
    currentLevel: currentLevel,//当前级别
  }
  parentNode.childConditionTreeModels.push(child);
}
//改成条件组
function handleChangeToGroup(row){
  row.type = 1
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
  let parentNode = getParentNode(row,treeData.value);
  if(parentNode!=null){
    let index = findNodeIndex(row,parentNode.childConditionTreeModels)
    if(index!=-1) {
      parentNode.childConditionTreeModels.splice(index, 1)
    }
  }
}
</script>

<style scoped>

</style>
