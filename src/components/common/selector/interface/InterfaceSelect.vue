<template>
  <el-form ref="interfaceRef" :model="form" :rules="rules" label-width="80px">
    <el-form-item label="选择接口" prop="interfaceCode">
      <el-tree-select
          v-model="interfaceCode"
          :data="treeInterface"
          :render-after-expand="false"
          style="width: 240px"
          @change="handleSelectChange"
      />
    </el-form-item>
    <el-form-item label="" prop="parameterList">
      <el-button type="primary" @click="open=true">参数设置</el-button>
    </el-form-item>
  </el-form>
  <!-- 添加或修改业务功能对话框 -->
  <el-dialog :title="title" v-model="open" width="500px" append-to-body>
    <InterfaceParameter
        ref="interfaceParameterRef" :interfaceCode="interfaceCode" :parameterList="parameterList" @ok="changeParameters" @cancel="cancelChange" />
  </el-dialog>

</template>

<script setup lang="ts">
import {getCurrentInstance, reactive, ref, toRefs} from "vue";
import { tree } from "@/api/business/interface";
import { parameterTreeSelect } from "@/api/business/parameter";
import InterfaceParameter from "./InterfaceParameter.vue";
interface Props {
  interfaceCode: string,
  parameterList: object
}
const emits = defineEmits<Emits>()
const { proxy } = getCurrentInstance();
const { parameter_type } = proxy.useDict("parameter_type");
const props = defineProps<Props>()
const loading = ref(false)
const parameterList = props.parameterList;
const interfaceCode = ref(props.interfaceCode);
const data = reactive({
  form: {},
  queryParams:{
      interfaceCode:'',
      pageSize:1000,
      pageNum:1
  }
});
const treeInterface=ref([])
const { form,queryParams } = toRefs(data);
async function handleSelectChange(value) {
  // 查询接口参数树列表
  try {
    loading.value = true;
    debugger;
    console.log('props.interfaceCode:' + props.interfaceCode)
    queryParams.value.interfaceCode = props.interfaceCode;
    let response = await parameterTreeSelect(queryParams.value)
    parameterList.value = response.rows;
    //total.value = response.total;
    loading.value = false;
  } catch (err) {
    console.log(err)
  } finally {
    loading.value = false;
  }
}
/**
 * 显示参数输入框
 * @param row
 */
function showParameterInput(row){
  if(row.parameterType!='object' && row.parameterType!='array'){
    return true;
  }else{
    return false;
  }
}
/** 获取接口树列表 */
function getTreeInterface(){
  let tmp={};
  tree(tmp).then(response => {
    treeInterface.value = response.data;
  });
}
/**
 * 翻译前端是否可见
 * @param row
 * @param column
 * @returns {*|string}
 */
function  formatFrontPageVisible(row, column){
  if(row.isFrontpageVisible=='Y'){
    return '是'
  }else{
    return '否';
  }
}
/**
 * 翻译参数类型
 * @param row
 * @param column
 * @returns {*|string}
 */
function  formatParameterType(row, column){
  return parameter_type.value.find(k => k.value === row.parameterType)?.label ?? '';
}

getTreeInterface();
</script>
