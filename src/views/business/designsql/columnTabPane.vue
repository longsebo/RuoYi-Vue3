<template>
  <el-container>
    <el-header>
      <el-checkbox  v-model="distinct">是否排重</el-checkbox>
    </el-header>
    <el-main>
      <el-row :gutter="15">
        <el-col :span="1.5"><el-button link type="primary" :icon="upArrowIcon" @click="moveUp"/></el-col>
        <el-col :span="1.5"><el-button link type="primary" :icon="downArrowIcon" @click="moveDown"/></el-col>
        <el-col :span="1.5"><el-button link type="primary" icon="Plus" @click="addColumn"/></el-col>
        <el-col :span="1.5"><el-button link type="primary" icon="Delete" @click="deleteColumn"/></el-col>
      </el-row>
      <el-table :data="selectColumnTabModel" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="列表达式" align="center" prop="columAndExp" />
        <el-table-column label="别名" align="center" prop="alias" />
        <el-table-column label="聚合" align="center" prop="aggregation" />
      </el-table>

    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import {onMounted, ref,onUnmounted,watch} from "vue";
import { useIcon } from "@/components/common/util";
import bus from '@/event/bus'
import {
  tabDesignColumnSelectChangeKey
} from "@/config/app.keys";
import {
  tabDesignColumnSelectChangeKey
} from "@/config/app.keys";

const upArrowIcon = useIcon("ali_up_arrow")
const downArrowIcon = useIcon("ali_down_arrow")
const distinct = ref(false)
const selectColumnTabModel =ref([])

/**
 * 构造一项
 * @param tableDefine
 * @param selectionElement
 */
function makeItem(tableDefine, selectionElement) {
  let item={ alias: '',//alias
    aggregation: '',//聚合
    group: false,//是否分组
    chineseName: tableDefine.cnName,//中文名
    orgTableName:tableDefine.enName,//原始表名
    tableAlias: tableDefine.alias,//表别名
    fieldName: selectionElement.fieldName,//字段名
    datasourceName:tableDefine.datasourceName,//数据源名称
     }
    return item;
}

/**
 * 判断selectColumnTabModel是否在新的选择中
 * @param testItem
 * @param tableDefine
 * @param selection
 */
function isExistsInNewSelection(testItem, tableDefine, selection) {
  for(let i=0;i<selection.length;i++){
    if(testItem.fieldName==selection[i].fieldName && testItem.orgTableName==tableDefine.enName &&
       testItem.datasourceName==tableDefine.datasourceName){
      return true;
    }
  }
  return false;
}

onMounted(() => {
  bus.on(tabDesignColumnSelectChangeKey,(tableDefine,selection) =>{

    //查找tableDefine selection在selectColumnTabModel中是否存在,不存在则添加
     for(let i=0;i<selection.length;i++){
        if(!isExistsInSelectColumnTabModel(tableDefine,selection[i])){
          selectColumnTabModel.value.push(makeItem(tableDefine,selection[i]);
        }
     }
      //查找selectCoumnTableModel在selectColumnTabModel中是否存在,不存在则删除
     for(let i=selectColumnTabModel.value.length-1;i>=0;i--){
       if(!isExistsInNewSelection(selectColumnTabModel.value[i],tableDefine,selection)){
         selectColumnTabModel.value.splice(i,1);
        }
      }
  })
})

/**
 * 判断selectColumnTabModel是否在旧的selection中
 * @param tableDefine
 * @param selectionElement
 */
function isExistsInSelectColumnTabModel(tableDefine, selectionElement) {
  for (let i = 0; i < selectColumnTabModel.value.length; i++) {
    if (
        selectColumnTabModel.value[i].datasourceName === tableDefine.datasourceName &&
        selectColumnTabModel.value[i].orgTableName = tableDefine.enName &&
        selectColumnTabModel.value[i].fieldName === selectionElement.fieldName
    ) {
      return true;
    }
  }
  return false;
}

onUnmounted(() => {
  bus.off(tabDesignColumnSelectChangeKey);
})
</script>

<style scoped>

</style>
