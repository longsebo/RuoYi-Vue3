<template>
  <el-button
      v-bind="props"
      icon="Plus"
      @click="handleAdd"
  >{{props.label}}</el-button>
</template>

<script lang="ts" setup>
import bus from '@/event/bus'

import {
  executeQueryKey,resetFormKey,showDialogKey
} from "@/config/app.keys";

interface Props {
  size?:string
  type?:string
  plain?:boolean
  text?:boolean
  bg?:boolean
  link?:boolean
  round?:boolean
  circle?:boolean
  loading?:boolean
  disabled?:boolean
  autofocus?:boolean
  formData:object
  id?:string,
  label?: string
}
const props = withDefaults(defineProps<Props>(), {
  label: '新增',
  type:"primary",
})
/** 新增按钮操作 */
function handleAdd() {
  bus.emit(resetFormKey);
  bus.emit(showDialogKey, {show:true,title:"添加应用定义",form:{}});
}
</script>

<style scoped>

</style>
