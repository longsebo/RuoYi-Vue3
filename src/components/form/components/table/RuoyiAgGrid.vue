<template>
  <template v-if="cMode === 'design'">
    <ag-grid-table  v-bind="props"  />
  </template>
  <template v-else-if="cMode === 'edit'">
    <ag-grid-table  v-bind="props" />
  </template>
  <template v-else-if="cMode === 'read'">
    <ag-grid-table  v-bind="props" />
  </template>
  <template v-else-if="cMode === 'hidden' ">
    <ag-grid-table  v-show="false" v-bind="props" />
  </template>
</template>

<script lang="ts" setup>
import {ElButton, ElMessage} from 'element-plus'
import {computed, inject, nextTick, useAttrs} from "vue";
import { formModeKey } from "@/components/form/state.key";
import { vFormSchemeKey } from '@/components/form/state.key';
import AgGridTable from '@/components/common/table/aggrid/AgGridTable.vue'



const formScheme = inject(vFormSchemeKey)!

interface Props {
  checkboxSelection?:boolean //设置数据复选框
  headerCheckboxSelection?:boolean  //表头是否也显示复选框，用于全选反选用
  rowSelection?: string //设置多行选中 ，若是single
  rowHeight?:string//行高
  width?:string//列宽
  columnDefs:object
  style?:any
  dataSourceType?:string//数据源类型：input(手工录入),bindcomponent(绑定组件)
  rowData?:object//行数据
  bindComponent?:string//数据源绑定组件
  rowSelectTriggerComponents?:string//行选择触发组件，通知组件进行处理
  tableHeight?:string
  tableWidth?:string
}

interface Emits {
  (e: 'update:value', v: string): void
}

const props = defineProps<Props>()

const emits = defineEmits<Emits>()


const attrs = useAttrs()
const formMode = inject(formModeKey)
const cMode = computed<FormFieldMode>(() => {
  if (props.mode) {
    return props.mode
  }
  if (formMode?.value) {
    return formMode.value
  }
  return "edit"
})
//console.log('$attrs:'+JSON.stringify(props));




</script>

<style scoped>

</style>
