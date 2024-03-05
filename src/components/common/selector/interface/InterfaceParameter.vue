<template>
  <el-table  :data="parameterList"  row-key="id" @row-click="handleRowClick">
    <el-table-column type="selection" width="55" align="center" />
    <el-table-column label="参数名称" align="center" prop="parameterName" />
    <el-table-column label="参数描述" align="center" prop="parameterDesc" />
    <el-table-column label="前端是否可见" align="center" prop="isFrontpageVisible" :formatter="formatFrontPageVisible" />
    <el-table-column label="参数类型" align="center" prop="parameterType" :formatter="formatParameterType" />
    <el-table-column label="参数格式" align="center" prop="parameterFormat" />
    <el-table-column label="参数值" align="center"  prop="parameterValue">
      <template #default="scope" >
        <div v-show="showParameterInput(scope.row)">
        <ComponentInput  :selectVariable="scope.row.parameterValue||''" @change="changeParameterValue" />
        </div>
      </template>
    </el-table-column>
  </el-table>
  <div class="dialog-footer">
    <el-button type="primary" @click="submitForm">确 定</el-button>
    <el-button @click="cancel">取 消</el-button>
  </div>
</template>

<script lang="ts" setup>
import {getCurrentInstance, ref, watch} from "vue";
import ComponentInput from "@/components/common/selector/component/ComponentInput.vue";
const { proxy } = getCurrentInstance();
const { parameter_type } = proxy.useDict("parameter_type");
const currentRow = ref({})
interface Props {
  parameterList: object
}
const parameterList = ref(props.parameterList)
const props = defineProps<Props>()
interface Emits {
  (e: 'ok', val: object): void
  (e: 'cancel'): void
}
const emits = defineEmits<Emits>()
watch(() => [props.parameterList], () => {
  parameterList.value = props.parameterList.value;
  console.log('parameterList in InterfaceParameter.vue', JSON.stringify(parameterList.value))
}, { immediate: true })

function submitForm(){
  emits('ok', parameterList);
}
function cancel(){
  emits('cancel');
}

/**
 * 改变当前行参数值
 * @param value
 */
function changeParameterValue(value){
  currentRow.value.parameterValue = value;
}

/**
 * 记录当前行
 */
function handleRowClick(row, column, event){
  currentRow.value = row;
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

</script>

<style scoped>

</style>
