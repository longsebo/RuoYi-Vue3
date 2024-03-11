<template>
  <el-button
      type="primary"
      plain
      icon="Plus"
      @click="handleAdd"
      v-hasPermi="['business:application:add']"
  >新增</el-button>
</template>

<script lang="ts" setup>
import bus from '@/event/bus'

import {
  executeQueryKey,resetFormKey,showDialogKey
} from "@/config/app.keys";

interface Props {
  title?: string
}
const props = withDefaults(defineProps<Props>(), {
  title: '新增',
})
/** 新增按钮操作 */
function handleAdd() {
  bus.emit(resetFormKey);
  bus.emit(showDialogKey, {show:true,title:"添加应用定义",form:{}});
}
</script>

<style scoped>

</style>
