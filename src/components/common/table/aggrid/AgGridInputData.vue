<template>
  <el-row :gutter="10" class="mb8">
    <el-col :span="1.5">
      <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
      >新增</el-button>
    </el-col>
    <el-col :span="1.5">
    <el-button
        type="danger"
        plain
        icon="Delete"
        :disabled="!multiple"
        @click="handleDelete"
    >删除</el-button>
    </el-col>
  </el-row>
  <ag-grid-vue style="height: 300px; width: 400px;"
               class="ag-theme-balham"
               :columnDefs="props.columnDefs"
               :rowData="rowData"
               @rowSelected="handleSelectionChange"
  ></ag-grid-vue>
</template>

<script lang="ts" setup>
import {ref, watch} from "vue";
import {getCurrentInstance} from 'vue';
import {Plus,Delete} from "@element-plus/icons-vue";

const {proxy} = getCurrentInstance();
interface Emits {
  (e: 'update:rowData', v: any): void
}

const emits = defineEmits<Emits>()
interface Props {
  columnDefs?:object
}
const props = defineProps<Props>()
const ids = ref([])
const multiple =ref(false)
const rowData = ref([])
watch(rowData, () =>{
  console.log(rowData.value)
  emits('update:rowData', rowData.value)
})
function handleAdd(){
  rowData.value.push({})
}
function handleDelete(){
  rowData.value = rowData.value.filter((item,index)=>{
    return !ids.value.includes(item.id)
  })
  ids.value = []
}
// 多选框选中数据
function handleSelectionChange(event) {
  if(event.node.selected){
    // 处理选中该行的操作
    //判断ids是否存在event.node.data.id,不存在加入
    if(!ids.value.includes(event.node.data.id)) {
      ids.value.push(event.node.data.id);
    }
  } else {
    // 处理撤销选中该行的操作
    //判断ids是否存在event.node.data.id,存在则删除
    if(ids.value.includes(event.node.data.id)) {
      const index = ids.value.indexOf(event.node.data.id);
      if (index > -1) {
        ids.value.splice(index, 1);
      }
    }
  }
  multiple.value = (ids.value.length>1)
}
</script>

<style scoped>

</style>
