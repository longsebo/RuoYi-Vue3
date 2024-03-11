<template>
  <el-button link type="primary" icon="Edit" @click="handleUpdate()"
             v-hasPermi="['business:application:edit']">{{ props.title }}</el-button>
</template>

<script lang="ts" setup>
import {defineProps, getCurrentInstance, ref, watch} from 'vue';
import bus from '@/event/bus'
import {resetFormKey, showDialogKey} from "../../../config/app.keys";
import { getApplication } from "@/api/business/application";
const {proxy} = getCurrentInstance();
const id =ref(0)
function handleUpdate() {
  bus.emit(resetFormKey);
  getApplication(id.value).then(response => {
    bus.emit(showDialogKey, {show:true,title:"修改应用定义",form:response.data});
  });
}
interface Props {
  title?: string,
  id?:string
}
const props = withDefaults(defineProps<Props>(), {
  title: '删除',
  id:''
})
watch(props.id, (newValue, oldValue) => {
  id.value = props.id
  console.log('id',id.value)
},{immediate: true})

</script>

<style scoped>

</style>
