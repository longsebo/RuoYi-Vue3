<template>
  <nested-drag-item style="width: 100%; height: 100%;min-height: 80px; background-color: #fff; "
                    :children="children"></nested-drag-item>
</template>

<script lang="ts" setup>
import {ref, watch} from "vue";
import {getCurrentInstance} from 'vue';
import NestedDragItem from "@/components/form/designer/NestedDragItem.vue"
interface Props {
  params?:object;
}
const props = defineProps<Props>()
const {proxy} = getCurrentInstance();
interface Emits {
  (e: 'update:value', v: string): void
}


const emits = defineEmits<Emits>()
const children = ref([]);
watch(() => props.params, (newVal) =>{
   //获取列定义
  let colDef = props.params.colDef;

  // 获取列定义中的某些属性，例如标题和字段名
  let cellRendererParams = colDef.cellRendererParams;
  console.log('cellRendererParams',cellRendererParams)
  if(cellRendererParams){
    children.value = JSON.parse(cellRendererParams);
  }
},{immediate: true,deep: true})
watch(()=>children,(newVal)=>{
  //console.log('enter children watch',JSON.stringify(newVal))
  //获取列定义
  let colDef = props.params.colDef;
  //
  // // 获取列定义中的某些属性，例如标题和字段名
  // 获取所有列的定义
  const allColumns = props.params.columnApi.api.columnModel.columnDefs;
  // if(props.params.columnApi){
  //   console.log('column size:'+props.params.columnApi.api.columnModel.columnDefs.length)
  // }else{
  //   console.log('props.params.columnApi is not object')
  // }
  // 打印列定义到控制台
  allColumns.forEach(column => {
    if(column.field===colDef.field){
      column.cellRendererParams=JSON.stringify(children.value);
    }
  });
  //console.log('cellRendererParams',colDef.cellRendererParams)
},{immediate: true,deep: true})
</script>

<style scoped>

</style>
