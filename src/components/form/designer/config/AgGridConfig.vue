<template>
  <el-form
    v-if="vFormSelectElem?.attrs"
    :model="vFormSelectElem?.attrs"
    style="padding: 2px;"
  >

    <el-form-item prop="tableHeight" label="表格高度">
      <el-tooltip content="格式:xxxpx或者100%" placement="bottom" effect="customized">
        <el-input v-model="vFormSelectElem.attrs.tableHeight"></el-input>
      </el-tooltip>
    </el-form-item>


    <el-form-item prop="tableWidth" label="表格宽度">
      <el-tooltip content="格式:xxxpx或者100%" placement="bottom" effect="customized">
      <el-input v-model="vFormSelectElem.attrs.tableWidth"></el-input>
      </el-tooltip>
    </el-form-item>
    <el-form-item prop="checkboxSelection" label="是否有复选框">
      <el-radio-group v-model="vFormSelectElem.attrs.checkboxSelection">
        <el-radio-button :value="true">是</el-radio-button>
        <el-radio-button :value="false">否</el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item prop="size" label="表头是否有复选框">
      <el-radio-group v-model="vFormSelectElem.attrs.headerCheckboxSelection">
        <el-radio-button :value="true">是</el-radio-button>
        <el-radio-button :value="false">否</el-radio-button>
      </el-radio-group>
    </el-form-item>

    <el-form-item prop="rowSelection" label="是否多行选中">
      <el-radio-group v-model="vFormSelectElem.attrs.rowSelection">
        <el-radio-button value="multiple">是</el-radio-button>
        <el-radio-button value="single">否</el-radio-button>
      </el-radio-group>
    </el-form-item>

    <el-form-item prop="rowHeight" label="行高">
      <el-input v-model="vFormSelectElem.attrs.rowHeight"></el-input>
    </el-form-item>

    <el-form-item prop="width" label="列宽">
      <el-input v-model="vFormSelectElem.attrs.width"></el-input>
    </el-form-item>
    <el-form-item prop="dataSourceType" label="列定义">
      <el-button :icon="columnDefineIcon" circle @click="showColumnDefineDlg" />
    </el-form-item>
    <el-form-item prop="dataSourceType" label="数据源类型">
      <el-radio-group v-model="vFormSelectElem.attrs.dataSourceType" >
        <el-radio-button value="input" >手工录入</el-radio-button>
        <el-radio-button value="bindcomponent" >绑定组件</el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item  label="表格数据" v-show="vFormSelectElem.attrs.dataSourceType==='input'">
    <el-scrollbar always>
      <AgGridInputData
          v-model:rowData="vFormSelectElem.attrs.rowData" :columnDefs="vFormSelectElem.attrs.columnDefs" />
    </el-scrollbar>
    </el-form-item>
    <el-form-item  label="绑定数据来源组件" v-show="vFormSelectElem.attrs.dataSourceType==='bindcomponent'">
      <el-scrollbar always>
      <BindComponentInput
          :bindComponent="vFormSelectElem.attrs.bindComponent"  :multiple="false" @change="changeBindComponent" />
      </el-scrollbar>
    </el-form-item>
    <el-form-item  label="选择行变化通知组件列表" >
      <el-scrollbar always>
      <BindComponentInput
          :bindComponent="vFormSelectElem.attrs.rowSelectTriggerComponents" :multiple="true" @change="changeRowsSelectTriggerComponents" />
      </el-scrollbar>
    </el-form-item>

    <el-form-item prop="mode" label="模式">
      <el-checkbox-group v-model="mode" :min="0" :max="1">
        <el-checkbox-button value="design">设计</el-checkbox-button>
        <el-checkbox-button value="read">只读</el-checkbox-button>
        <el-checkbox-button value="edit">编辑</el-checkbox-button>
      </el-checkbox-group>
    </el-form-item>
  </el-form>
   <el-dialog title="列定义" v-model="columnDefineVisible" width="100%" height="95vh" append-to-body>
     <AgGridColumnDefine
        :columnDefs="vFormSelectElem.attrs.columnDefs" @change="updateColumnDefs" />
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
import {useIcon} from "@/components/common/util";
const vFormSelectElem = inject(vFormActiveElementKey)
const columnDefineIcon  = useIcon('ali_columndef')
const columnDefineVisible = ref(false)

console.log('inject vFormSelectElem', JSON.stringify(vFormSelectElem.value.attrs));


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

/**
 * 更新列定义
 * @param newColDefs
 */
function updateColumnDefs(newColDefs){
  console.log('updateColumnDefs',JSON.stringify(newColDefs))
  vFormSelectElem.value.attrs.columnDefs = newColDefs;
}

/**
 * 回调绑定选择触发组件
 * @param val
 */
function changeRowsSelectTriggerComponents(val:string ){
   console.log('changeRowsSelectTriggerComponents',val)
  //将字符串
  vFormSelectElem.value.attrs.rowSelectTriggerComponents = val
}

/**
 * 回调绑定组件
 * @param val
 */
function changeBindComponent(val:string ){
  console.log('changeBindComponent',val)
  vFormSelectElem.value.attrs.bindComponent = val
}
</script>

<style >
.el-popper.is-customized {
  /* Set padding to ensure the height is 32px */
  padding: 6px 12px;
  background: linear-gradient(90deg, rgb(159, 229, 151), rgb(204, 229, 129));
}

.el-popper.is-customized .el-popper__arrow::before {
  background: linear-gradient(45deg, #b2e68d, #bce689);
  right: 0;
}
</style>
