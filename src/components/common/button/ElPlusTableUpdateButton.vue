<template>
  <el-button link type="primary" :icon="Edit" @click="handleUpdate()"
             v-hasPermi="['business:application:edit']">{{ props.title }}</el-button>
</template>

<script lang="ts" setup>
import {defineProps, getCurrentInstance, ref, watch} from 'vue';
import bus from '@/event/bus'
import {resetFormKey, showDialogKey} from "../../../config/app.keys";
import { getApplication } from "@/api/business/application";
const {proxy} = getCurrentInstance();
import { Edit } from '@element-plus/icons-vue'
const id =ref(0)
function handleUpdate() {
  bus.emit(resetFormKey);
  getApplication(id.value).then(response => {
    bus.emit(showDialogKey, {show:true,title:"修改应用定义",form:response.data});
  });
}
interface Props {
  title?: string,
  row?:object
}
const props = withDefaults(defineProps<Props>(), {
  title: '更新'
})
watch(props, (newValue, oldValue) => {
  console.log('row',JSON.stringify(props))
   id.value = props.row.id
   console.log('id',id.value)
},{immediate: true,deep: true})

</script>

<style scoped>

</style>
