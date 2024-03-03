<template>
  <el-table v-loading="loading" :data="parameterList"  row-key="id">
    <el-table-column type="selection" width="55" align="center" />
    <el-table-column label="参数名称" align="center" prop="parameterName" />
    <el-table-column label="参数描述" align="center" prop="parameterDesc" />
    <el-table-column label="前端是否可见" align="center" prop="isFrontpageVisible" :formatter="formatFrontPageVisible" />
    <el-table-column label="参数类型" align="center" prop="parameterType" :formatter="formatParameterType" />
    <el-table-column label="参数格式" align="center" prop="parameterFormat" />
    <el-table-column label="参数值" align="center"  prop="parameterValue">
      <template #default="scope">
        <el-input type="text" v-show="showParameterInput(scope.row)" v-model="scope.row.parameterValue" placeholder="请输入参数表达式"></el-input>
      </template>
    </el-table-column>
  </el-table>
  <div class="dialog-footer">
    <el-button type="primary" @click="submitForm">确 定</el-button>
    <el-button @click="cancel">取 消</el-button>
  </div>
</template>

<script lang="ts" setup>
import {getCurrentInstance, ref} from "vue";
const { proxy } = getCurrentInstance();
const { parameter_type } = proxy.useDict("parameter_type");
const parameterList = ref([])
interface Emits {
  (e: 'ok', val: object): void
  (e: 'cancel'): void
}
const emits = defineEmits<Emits>()
function submitForm(){
  emits('ok', parameterList);
}
function cancel(){
  emits('cancel');
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
/**
 * 翻译参数类型
 * @param row
 * @param column
 * @returns {*|string}
 */
function  formatParameterType(row, column){
  return parameter_type.value.find(k => k.value === row.parameterType)?.label ?? '';
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
</script>

<style scoped>

</style>
