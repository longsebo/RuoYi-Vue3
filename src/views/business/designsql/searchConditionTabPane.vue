<template>
  <el-table :data="treeData" row-key="id" :tree-props="{children: 'childConditionTreeModels'}" @row-click="handleRowClick">
    <el-table-column  label="层次">
      <template #default="scope">
        <el-button>{{scope.id}}</el-button>
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
             <el-input v-model="scrope.row.left" placeholder="请输入表达式或点击右边...按钮"/>
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
            <el-input v-model="scrope.row.right" placeholder="请输入表达式或点击右边...按钮"/>
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
import { onMounted,Directive, watch,ref } from 'vue';
import { useIcon } from "@/components/common/util";
const changToGroupIcon = useIcon("ali_changetogroup")
const conditionTypes=ref[{label:'分支内所有条件必须匹配',value:'All'},
    {label:'分支内所有条件任意一个匹配',value:'Any'},
    {label:'分支中的任何条件都不能匹配',value:'None'},
    {label:'分支中没有一个条件必须匹配',value:'NotAll'}]
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
//新增条件
function handleAdd(row){
 //构造新行
 //如果row为最顶级，则获取子节点最大序号+1作为新节点currentLevel
 //如果row为条件，则获取父节点，取父节点子节点最大序号+1作为新节点currentLevel
 //如果row为分组 ，则获取子节点最大序号+1作为新节点currentLevel
}
//改成条件组
function handleChangeToGroup(row){

}
//删除条件
function handleDelete(row){

}
</script>

<style scoped>

</style>
