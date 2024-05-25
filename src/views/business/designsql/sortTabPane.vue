<template>
  <div class="common-layout">
    <el-container style="height: 100vh;">
      <el-aside width="200px">
        <el-row>
          <el-col :span="9">
            <el-table :data="validColumnModel" style="width: 100%"  @row-click="handleRowClickValidColumn" >
              <el-table-column prop="fullFieldName" label="有效列" ></el-table-column>
            </el-table>
          </el-col>
          <!-- <el-col :span="5" class="container1">
            <el-button @click="addToSort" :disabled="isDisableRightBt" > &lt; </el-button>
            <el-button @click="removeFromSort" :disabled="isDisableLeftBt"> &lt; </el-button>
          </el-col>  -->
        </el-row>
      </el-aside>
      <div width="80px">
        <el-row>
          <el-col :span="5" class="container1">
            <el-button @click="addToSort" :disabled="isDisableRightBt" > &lt; </el-button>
            <el-button @click="removeFromSort" :disabled="isDisableLeftBt"> &lt; </el-button>
          </el-col>
        </el-row>
      </div>
      <el-main style="flex: 1">
        <el-row>
          <el-col :span="10">
            <el-table :data="sortColumnModel" style="width: 100%" @row-click="handleRowClickSortColumn">
              <el-table-column prop="fullFieldName" label="排序列" ></el-table-column>
              <el-table-column prop="descending" label="是否倒排" >
                <template #default="scope">
                  <el-checkbox v-model="scope.row.descending"  size="large" />
                </template>
              </el-table-column>
            </el-table>
          </el-col>
          <el-col :span="2" class="container1">
            <el-button @click="moveUp" :disabled="isDisableUpBt"> ∧ </el-button>
            <el-button @click="moveDown" :disabled="isDisableDownBt"> ∨ </el-button>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref,defineEmits,defineProps,watch,computed } from 'vue';
interface Emits {
  (e: 'update:modelValue', sortColumnModel:object): void
}
const emit = defineEmits<Emits>()
const sortColumnModel = ref([])
const validColumnModel = ref([])
const currentValidColumnIndex = ref(-1)
const currentSortColumnIndex = ref(-1)

const isDisableRightBt = computed(() => {
  return currentValidColumnIndex.value<0; //
});
const isDisableLeftBt = computed(() => {
  return currentSortColumnIndex.value<0; // 根据实际条件返回true或false
});
const isDisableUpBt = computed(() => {
  return currentSortColumnIndex.value==1; // 根据实际条件返回true或false
});
const isDisableDownBt = computed(() => {
  return currentSortColumnIndex.value==sortColumnModel.value.length-1; // 根据实际条件返回true或false
});
const props= defineProps({
  validColumnModel: {
    type: Array,
    default: () => [{
      orgTableName: String,//原始表名
      tableAlias: String,//表别名
      columAndExp: String,//列/表达式
      alias: String,//列别名
      fieldName: String,//字段名
      descending: Boolean,//是否倒排
      fullFieldName:String,//完整字段名：原始表名(类别名).字段名(列别名)
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
      fullFieldName:String,//完整字段名：原始表名(类别名).字段名(列别名)
    }]
  },
})
watch(() => props, val => {
  validColumnModel.value = JSON.parse(JSON.stringify(validColumnModel));
  for(let i=0;i<validColumnModel.value.length;i++){
    validColumnModel.value[i].fullFieldName =
        validColumnModel.value[i].tableAlias==null?validColumnModel.value[i].orgTableName:validColumnModel.value[i].tableAlias
        +"."
        validColumnModel.value[i].alias==null?validColumnModel.value[i].fieldName:validColumnModel.value[i].alias;
  }
  let sortColumnModelJson1 = JSON.stringify(sortColumnModel.value);
  let sortColumnModelJson2 = JSON.stringify(props.sortColumnModel.value);
  if(sortColumnModelJson1!=sortColumnModelJson2) {
    sortColumnModel.value = JSON.parse(JSON.stringify(props.sortColumnModel));
    for (let i = 0; i < sortColumnModel.value.length; i++) {
      sortColumnModel.value[i].fullFieldName =
          sortColumnModel.value[i].tableAlias == null ? sortColumnModel.value[i].orgTableName : sortColumnModel.value[i].tableAlias
              + "."
      sortColumnModel.value[i].alias == null ? sortColumnModel.value[i].fieldName : sortColumnModel.value[i].alias;
    }
  }
});
watch(()=>sortColumnModel,val =>{
  let sortColumnModelJson1 = JSON.stringify(sortColumnModel.value);
  let sortColumnModelJson2 = JSON.stringify(props.sortColumnModel.value);
  if(sortColumnModelJson1!=sortColumnModelJson2){
    emit('update:modelValue',sortColumnModel.value)
  }
})
//增加到排序列
function addToSort() {
  if (currentValidColumnIndex.value >= 0 && currentValidColumnIndex.value < validColumnModel.value.length) {
     let tempSort = validColumnModel.value[currentValidColumnIndex.value];
     validColumnModel.value.splice(currentValidColumnIndex.value,1)
     sortColumnModel.value.push(tempSort)
  }
}
//从排序列中删除
function removeFromSort(){
  if (currentSortColumnIndex.value >= 0 && currentSortColumnIndex.value < sortColumnModel.value.length) {
    let tempSort = sortColumnModel.value[currentSortColumnIndex.value];
    sortColumnModel.value.splice(currentSortColumnIndex.value,1)
    validColumnModel.value.push(tempSort)
  }
}
//排序列上移
function moveUp(){
    if(currentSortColumnIndex.value!=0){
      let tempSort1 = sortColumnModel.value[currentSortColumnIndex.value-1];
      let tempSort2 = sortColumnModel.value[currentSortColumnIndex.value];
      sortColumnModel.value.splice(currentSortColumnIndex.value-1,2)
      sortColumnModel.value.splice(currentSortColumnIndex.value-1,0,tempSort2,tempSort1);
    }
}
//排序列下移
function moveDown(){
  if(currentSortColumnIndex.value<sortColumnModel.value.length){
    let tempSort1 = sortColumnModel.value[currentSortColumnIndex.value];
    let tempSort2 = sortColumnModel.value[currentSortColumnIndex.value+1];
    sortColumnModel.value.splice(currentSortColumnIndex.value,2)
    sortColumnModel.value.splice(currentSortColumnIndex.value,0,tempSort2,tempSort1);
  }
}
//单击行
function handleRowClickValidColumn(row, column, event, index){
  currentValidColumnIndex.value = index;
}
//单击行
function handleRowClickSortColumn(row, column, event, index){
  currentSortColumnIndex.value = index;
}
</script>

<style scoped>
::v-deep(.el-container) {
  display: flex; /* 启用Flex布局 */
  flex-direction: row; /* 指定主轴方向为行 */
}

::v-deep(.el-main) {
  overflow: auto; /* 当内容过多时，可以滚动查看 */
}
.container1 {
  display: flex; /* 使用Flexbox布局 */
  flex-direction: column; /* 垂直排列 */
  justify-content: center; /* 垂直居中 */
  align-items:center;
}
::v-deep(.el-button+.el-button) {
  margin-left: 0px;
}
</style>
