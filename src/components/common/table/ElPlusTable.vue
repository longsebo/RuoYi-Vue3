<template>
  <el-table v-loading="loading" :data="applicationList" @selection-change="handleSelectionChange">
    <el-table-column type="selection" width="55" align="center" />
    <el-table-column label="应用编码" align="center" prop="applicationCode" />
    <el-table-column label="应用名称" align="center" prop="applicationName" />
    <el-table-column label="备注" align="center" prop="remark" />
    <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
      <template #default="scope">
        <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['business:application:edit']">修改</el-button>
        <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['business:application:remove']">删除</el-button>
      </template>
    </el-table-column>
  </el-table>

  <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
  />

</template>

<script lang="ts" setup>
import bus from '@/event/bus'
import {onMounted, ref} from "vue";
import {
  queryListResultKey,executeQueryKey,totalKey,queryParamKey,loadingKey
} from "@/config/app.keys";

const applicationList = ref([]);
const total = ref(0);
const loading = ref(false)
const ids=ref([])
const single = ref(true);
const multiple = ref(true);
const queryParams = ref({
  pageNum: 1,
  pageSize: 10,
})
onMounted(() => {
  bus.on(queryListResultKey,(data) =>{
    applicationList.value = data;
  })
  bus.on(totalKey,(data) =>{
    total.value = data;
  })
  bus.on(queryParamKey,(data) =>{
    console.log('queryParamKey:'+JSON.stringify(data.value));
    queryParams.value = data.value;
  })
  bus.on(loadingKey,(data) =>{
      loading.value = data;
  })
})
function getList() {
  bus.emit(executeQueryKey);
}
function handleUpdate(row: any) {
  console.log(row);
}
function handleDelete(row: any) {
  console.log(row);
}
// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

</script>



<style scoped>

</style>
