<template>
  <div>
  <el-row :gutter="10" class="mb8">
    <el-col :span="1.5">
      <el-button
          type="primary"
          plain
          :icon="Plus"
          @click="handleAdd"
      >新增</el-button>
    </el-col>
    <el-col :span="1.5">
    <el-button
        type="danger"
        plain
        :icon="Delete"
        :disabled="!multiple"
        @click="handleDelete"
    >删除</el-button>
    </el-col>
    <el-col :span="1.5">
      <el-button
          type="danger"
          plain
          :icon="SaveIcon"
          @click="handleSave"
      >保存</el-button>
    </el-col>
  </el-row>
  <ag-grid-vue style="height: 300px; width: 400px;"
               class="ag-theme-balham"
               :columnDefs="props.columnDefs"
               :rowData="rowData"
               @selection-changed="handleSelectionChange"
               @grid-ready="onGridReady"
               :rowSelection="rowSelection"
               :defaultColDef="defaultColDef"
  ></ag-grid-vue>
  </div>
</template>

<script lang="ts" setup>
import {inject, ref, watch} from "vue";
import {getCurrentInstance} from 'vue';
import {Plus,Delete} from "@element-plus/icons-vue";
import { useIcon } from "@/components/common/util";
import { AgGridVue } from "ag-grid-vue3";
//使用注入方式，获取行数据
import { vFormActiveElementKey } from "@/components/form/state.key";
const {proxy} = getCurrentInstance();
interface Emits {
  (e: 'update:rowData', v: any): void
}
const defaultColDef = ref({
  suppressEnterToBatchSort: true,
  singleClickEdit:true
});
const emits = defineEmits<Emits>()
interface Column {
  headerName: string
  field: string
  editable: boolean
  sortable: boolean
  filter: boolean
  resizable: boolean//是否可调整列大小
  checkboxSelection: boolean//设置数据复选框
  headerCheckboxSelection: boolean//表头是否也显示复选框，用于全选反选用
  headerCheckboxSelectionFilteredOnly: boolean//标题复选框选择将只选择筛选的项目
  lockPinned: boolean//是否冻结列
  pinned: boolean//是否固定列 'left' | 'right',true相当于left
  lockPosition: boolean//禁止拖动列的位置
  lockVisible: boolean//禁用通过菜单更改可见性
  width: number//列宽
  minWidth: number//最小列宽
  maxWidth: number//
  cellEditor: string//内置编辑器：文本编辑器（text）,选择框编辑器（select）,日期选择器（date）,数字编辑器（number）
  //组合框编辑器（richSelect）,大组合框编辑器（largeSelect）,打开文本编辑器（bigSelect）
  cellEditorParams: object
  cellStyle: object
  cellRenderer: string//当自定义渲染组件时，固定为NestedDragItem可以拖拽嵌套组件，可以往拖拽其他组件
  cellRendererParams:object
}

interface Props {
  columnDefs?:Column[],
}
const rowSelection = ref('multiple');
const props = defineProps<Props>()
const multiple =ref(false)
const rowData = ref([])
const SaveIcon = useIcon('ali_save')

const gridApi=ref(null)
const  gridColumnApi=ref(null)
const vFormSelectElem = inject(vFormActiveElementKey)
rowData.value = vFormSelectElem.value.attrs.rowData

function makeNewRow() {
  let row = {
   }
  return row;
}
function onGridReady(params) {
  gridApi.value = params.api;
  gridColumnApi.value = params.columnApi;
}
function handleAdd() {

  const newItems = [
    makeNewRow()
  ];
  gridApi.value.applyTransaction({ add:newItems});

}
function handleDelete(){
  const selectedData = gridApi.value.getSelectedRows();
  console.log('selectedData:'+JSON.stringify(selectedData));
  gridApi.value.applyTransaction({ remove:selectedData });
}
// 多选框选中数据
function handleSelectionChange(event) {
  console.log('enter handleSelectionChange')
  let selectedRows = gridApi.value.getSelectedRows();
  multiple.value = (selectedRows.length >=1)
}
function  handleSave(){
  //保存操作
  let allRowData=[];
  gridApi.value.forEachNode((rowNode) => {
    allRowData.push(rowNode.data);
  });
  //保存操作
  emits('update:rowData', allRowData)
}
</script>

<style scoped>

</style>
