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
</script>

<style scoped>

</style>
