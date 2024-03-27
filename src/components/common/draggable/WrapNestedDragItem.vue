<template>
  <nested-drag-item style="width: 100%; height: 100%;min-height: 80px; background-color: #fff; "
                    :children="children"></nested-drag-item>
</template>

<script lang="ts" setup>
import {ref, watch} from "vue";
import {getCurrentInstance} from 'vue';
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
  console.log('cellRendererParams',JSON.stringify(cellRendererParams))
  if(cellRendererParams){
    children.value = JSON.parse(cellRendererParams).children;
  }
},{immediate: true,deep: true})
watch(()=>children,(newVal)=>{
  //获取列定义
  let colDef = props.params.colDef;

  // 获取列定义中的某些属性，例如标题和字段名
  colDef.cellRendererParams=JSON.stringify(children.value);
  console.log('cellRendererParams',colDef.cellRendererParams)
},{immediate: true,deep: true})
</script>

<style scoped>

</style>
