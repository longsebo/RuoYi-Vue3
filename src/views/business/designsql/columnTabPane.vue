<template>
  <el-container>
    <el-header>
      <el-checkbox  v-model="distinct" @updateDistinct="updateDistinct">是否排重</el-checkbox>
    </el-header>
    <el-main>
      <el-row :gutter="15">
        <el-col :span="1.5"><el-button link type="primary" :icon="upArrowIcon" @click="moveUp"  :disabled="currentIndex === 0"/></el-col>
        <el-col :span="1.5"><el-button link type="primary" :icon="downArrowIcon" @click="moveDown" :disabled="currentIndex === selectColumnTabModel.length - 1"/></el-col>
        <el-col :span="1.5"><el-button link type="primary" icon="Plus" @click="addColumn"/></el-col>
        <el-col :span="1.5"><el-button link type="primary" icon="Delete" @click="deleteColumn"/></el-col>
      </el-row>
      <el-table :data="selectColumnTabModel" @row-click="handleRowClick">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="列表达式" align="center" prop="columAndExp">
          <template #default="scope">
            <el-input v-model="scope.row.columAndExp" placeholder="请输入列表达式" />
          </template>
        </el-table-column>
        <el-table-column label="别名" align="center" prop="alias">
          <template #default="scope">
            <el-input v-model="scope.row.alias" placeholder="请输入别名" />
          </template>
        </el-table-column>
        <el-table-column label="聚合" align="center" prop="aggregation" >
          <template #default="scope">
            <el-select v-model="scope.row.aggregation" placeholder="请选择聚合">
              <el-option label="无" value=""></el-option>
              <el-option label="统计个数" value="count"></el-option>
              <el-option label="求和" value="sum"></el-option>
              <el-option label="平均值" value="avg"></el-option>
              <el-option label="最大值" value="max"></el-option>
              <el-option label="最小值" value="min"></el-option>
            </el-select>
          </template>
        </el-table-column>
      </el-table>

    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import {onMounted, ref,onUnmounted,watch,defineProps,defineEmits} from "vue";
import { useIcon } from "@/components/common/util";
import bus from '@/event/bus'
import { genId } from "@/components/form/designer/util/common";
import {
  tabDesignColumnSelectChangeKey
} from "@/config/app.keys";
interface Emits {
  (e: 'updateDistinct', distinct: boolean): void
  (e: 'update:modelValue', selectColumnTabModel:object): void
}
const props= defineProps({
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
  }
})
const upArrowIcon = useIcon("ali_up_arrow")
const downArrowIcon = useIcon("ali_down_arrow")
const distinct = ref(false)
const selectColumnTabModel =ref([])
const currentIndex=ref(-1)

function makeDisplayName (item) {
  if (item.columAndExp == null || item.columAndExp == '') {
    if (item.tableAlias != '') {
       item.columAndExp = item.tableAlias + "." + item.fieldName;
    } else {
      item.columAndExp = item.orgTableName + "." + item.fieldName;
    }
  }

}

watch(() => props, val => {
  distinct.value = props.distinct;
  let tmp1 = JSON.stringify(props.selectColumnTabModel);
  let tmp2 = JSON.stringify(selectColumnTabModel.value);
  if(tmp1!=tmp2) {
    selectColumnTabModel.value = JSON.parse(JSON.stringify(props.selectColumnTabModel))
    for (let i = 0; i < selectColumnTabModel.value.length; i++) {
      let item = selectColumnTabModel.value[i];
      makeDisplayName(item);
    }
  }
},{deep: true,immediate: true});
watch(()=>selectColumnTabModel.value,val=>{
  //如果发生变化，则更新
  let tmp1 = JSON.stringify(props.selectColumnTabModel);
  let tmp2 = JSON.stringify(selectColumnTabModel.value);
  if(tmp1!=tmp2){
    emit('update:selectColumnTabModel', selectColumnTabModel.value);
  }
},{deep: true,immediate: true})
const emit = defineEmits<Emits>()


/**
 * 构造一项
 * @param tableDefine
 * @param selectionElement
 */
function makeItem(tableDefine, selectionElement) {
  let item={
    id:genId(),
    alias: '',//alias
    aggregation: '',//聚合
    group: false,//是否分组
    chineseName: tableDefine.cnName,//中文名
    orgTableName:tableDefine.enName,//原始表名
    tableAlias: tableDefine.alias,//表别名
    fieldName: selectionElement.fieldEnName,//字段名
    datasourceName:tableDefine.datasourceName,//数据源名称
     }
    makeDisplayName(item);
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
    if(testItem.fieldName==selection[i].fieldEnName && testItem.orgTableName==tableDefine.enName &&
       testItem.datasourceName==tableDefine.datasourceName){
      return true;
    }
  }
  return false;
}

onMounted(() => {
  bus.on(tabDesignColumnSelectChangeKey,(complexParam) =>{
     debugger;
     let selection1 = complexParam.selection;
     let tableDefine = complexParam.tableDefine;
    //查找tableDefine selection在selectColumnTabModel中是否存在,不存在则添加
     for(let i=0;i<selection1.length;i++){
        if(!isExistsInSelectColumnTabModel(tableDefine,selection1[i])){
          selectColumnTabModel.value.push(makeItem(tableDefine,selection1[i]));
        }
     }
      //查找selectCoumnTableModel在selectColumnTabModel中是否存在,不存在则删除
     for(let i=selectColumnTabModel.value.length-1;i>=0;i--){
       //手工添加的不删除
       if(selectColumnTabModel.value[i].orgTableName!=null &&selectColumnTabModel.value[i].orgTableName!=''
           && selectColumnTabModel.value[i].fieldName!=null &&selectColumnTabModel.value[i].fieldName!='') {
         if (!isExistsInNewSelection(selectColumnTabModel.value[i], tableDefine, selection1)) {
           selectColumnTabModel.value.splice(i, 1);
         }
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
    if(selectColumnTabModel.value[i].datasourceName === tableDefine.datasourceName &&
        selectColumnTabModel.value[i].orgTableName === tableDefine.enName &&
        selectColumnTabModel.value[i].fieldName === selectionElement.fieldEnName
    ) {
      return true;
    }
  }
  return false;
}
//更新排重模型
function updateDistinct(){
  emit('updateDistinct',distinct.value);
}
//上移
function moveUp(){
  if (currentIndex.value <= 0) return;
  const temp = selectColumnTabModel.value[currentIndex.value - 1];
  selectColumnTabModel.value.splice(currentIndex.value - 1, 1);
  selectColumnTabModel.value.splice(currentIndex.value , 0, temp);
  //当前行减1
  if(currentIndex.value-1>=0){
    currentIndex.value = currentIndex.value-1;
  }
}
//下移
function moveDown(){
  if(currentIndex.value===-1) return;
  if (currentIndex.value === selectColumnTabModel.value.length - 1) return;
  const temp = selectColumnTabModel.value[currentIndex.value  + 1];
  selectColumnTabModel.value.splice(currentIndex.value  + 1, 1);
  selectColumnTabModel.value.splice(currentIndex.value , 0, temp);
  //当前行加1
  if(currentIndex.value+1<selectColumnTabModel.value.length){
    currentIndex.value = currentIndex.value+1;
  }
}
//增加列
function addColumn(){
  selectColumnTabModel.value.push({})
}
//删除列
function deleteColumn(){
  if(currentIndex.value>=0 && currentIndex.value<selectColumnTabModel.value.length) {
    selectColumnTabModel.value.splice(currentIndex.value, 1);
  }
}

/**
 * 获取行索引
 * @param row
 */
function getRowIndex(row) {
  for(let i=0;i<selectColumnTabModel.value.length;i++){
    if(row.id === selectColumnTabModel.value[i].id){
      return i;
    }
  }
  return -1;
}

//单击行
function handleRowClick(row, column, event){
  currentIndex.value = getRowIndex(row);
}

onUnmounted(() => {
  bus.off(tabDesignColumnSelectChangeKey);
})
</script>

<style scoped>

</style>
