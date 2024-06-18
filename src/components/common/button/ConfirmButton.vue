<template>
  <el-button v-bind="props" @click="submitForm">{{props.label}}</el-button>
</template>

<script lang="ts" setup>
import {getCurrentInstance} from 'vue';
import bus from '@/event/bus'
import { addApplication, updateApplication } from "@/api/business/application";
import {executeQueryKey, showDialogKey,validateFormKey} from "../../../config/app.keys";
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
  label: '确定',
  type:"primary"
})

const {proxy} = getCurrentInstance();
function submitForm() {
  bus.emit(validateFormKey,submitData)
}
function submitData(valid:boolean,form) {
  if (valid) {
    if (form.value.id != null) {
      updateApplication(form.value).then(response => {
        proxy.$modal.msgSuccess("修改成功");
        bus.emit(showDialogKey,{show:false,form:form.value,title:'修改'})
        bus.emit(executeQueryKey)
      });
    } else {
      addApplication(form.value).then(response => {
        proxy.$modal.msgSuccess("新增成功");
        bus.emit(showDialogKey,{show:false,form:form.value,title:'新增'})
        bus.emit(executeQueryKey)
      });
    }
  }
}
</script>

<style scoped>

</style>
