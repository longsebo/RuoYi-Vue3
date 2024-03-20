<template>
  <el-form
    v-if="vFormSelectElem?.attrs"
    :model="vFormSelectElem?.attrs"
    style="padding: 2px;"
  >
    <el-form-item prop="gridOptions.checkboxSelection" label="是否有复选框">
      <el-radio-group v-model="vFormSelectElem.attrs.gridOptions.checkboxSelection">
        <el-radio-button :label="true">是</el-radio-button>
        <el-radio-button :label="false">否</el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item prop="size" label="表头是否有复选框">
      <el-radio-group v-model="vFormSelectElem.attrs.gridOptions.headerCheckboxSelection">
        <el-radio-button label="multiple">是</el-radio-button>
        <el-radio-button label="single">否</el-radio-button>
      </el-radio-group>
    </el-form-item>

    <el-form-item prop="gridOptions.rowSelection" label="是否多行选中">
      <el-radio-group v-model="vFormSelectElem.attrs.gridOptions.rowSelection">
        <el-radio-button :label="true">是</el-radio-button>
        <el-radio-button :label="false">否</el-radio-button>
      </el-radio-group>
    </el-form-item>

    <el-form-item prop="gridOptions.rowHeight" label="行高">
      <el-input v-model="vFormSelectElem.attrs.gridOptions.rowHeight"></el-input>
    </el-form-item>

    <el-form-item prop="gridOptions.width" label="列宽">
      <el-input v-model="vFormSelectElem.attrs.gridOptions.width"></el-input>
    </el-form-item>
    <el-form-item prop="dataSourceType" label="列定义">
      <el-button :icon="columnDefineIcon" circle @click="showColumnDefineDlg" />
    </el-form-item>
    <el-form-item prop="dataSourceType" label="数据源类型">
      <el-radio-group v-model="vFormSelectElem.attrs.dataSourceType" >
        <el-radio-button label="input" >手工录入</el-radio-button>
        <el-radio-button label="bindcomponent" >绑定组件</el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item  label="表格数据" v-show="vFormSelectElem.attrs.dataSourceType==='input'">
      <AgGridInputData
          v-model:rowData="vFormSelectElem.attrs.rowData" :columnDefs="vFormSelectElem.attrs.columnDefs" />
    </el-form-item>
    <el-form-item  label="绑定组件" v-show="vFormSelectElem.attrs.operationtype==='page'">
      <BindComponentInput
          v-model:bindComponent="vFormSelectElem.attrs.bindComponent"  />
    </el-form-item>


    <el-form-item prop="mode" label="模式">
      <el-checkbox-group v-model="mode" :min="0" :max="1">
        <el-checkbox-button label="design">设计</el-checkbox-button>
        <el-checkbox-button label="read">只读</el-checkbox-button>
        <el-checkbox-button label="edit">编辑</el-checkbox-button>
      </el-checkbox-group>
    </el-form-item>
  </el-form>
   <el-dialog title="列定义" v-model="columnDefineVisible" width="800px" append-to-body>
     <AgGridColumnDefine
        :columnDefs="vFormSelectElem.attrs.gridOptions.columnDefs" />
  </el-dialog>
</template>

<script lang="ts" setup>
import {
  ElForm, ElFormItem, ElInput, ElCheckboxGroup, ElRadioGroup, ElRadioButton, ElCheckboxButton, ElSelect, ElOption, ElInputNumber,
} from 'element-plus'
import {computed, inject, ref} from "vue";
import { vFormActiveElementKey } from "@/components/form/state.key";
import AgGridColumnDefine from    "@/components/common/table/aggrid/AgGridColumnDefine.vue";
import BindComponentInput from    "@/components/common/selector/bindcomponent/BindComponentInput.vue";
import AgGridInputData from    "@/components/common/table/aggrid/AgGridInputData.vue";
import {useIcon} from "../../../components/common/util";
const vFormSelectElem = inject(vFormActiveElementKey)
const columnDefineIcon  = useIcon('ali_columndef')
const columnDefineVisible = ref(false)
//console.log('inject vFormSelectElem', JSON.stringify(vFormSelectElem.value.attrs.operationdata.parameterList));
const mode = computed({
  get: () => vFormSelectElem.value.attrs.mode ? [vFormSelectElem.value.attrs.mode] : [],
  set: v => {
    if (v?.length) {
      vFormSelectElem.value.attrs.mode = v[0]
    } else {
      vFormSelectElem.value.attrs.mode = undefined
    }
  }
})


/**
 * 显示列定义对话框
 */
function showColumnDefineDlg() {
  columnDefineVisible.value = true;

}
</script>

<style scoped>

</style>
