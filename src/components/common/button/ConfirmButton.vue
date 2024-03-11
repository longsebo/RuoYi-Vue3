<template>
  <el-button type="primary" @click="submitForm">{{props.title}}</el-button>
</template>

<script lang="ts" setup>
import {getCurrentInstance} from 'vue';
import bus from '@/event/bus'
import { addApplication, updateApplication } from "@/api/business/application";
import {executeQueryKey, showDialogKey,validateFormKey} from "../../../config/app.keys";
interface Props {
  title?: string
}
const props = withDefaults(defineProps<Props>(), {
  title: '确定',
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
        bus.emit(showDialogKey,{show:false,form:form.value,title:props.title})
        bus.emit(executeQueryKey)
      });
    } else {
      addApplication(form.value).then(response => {
        proxy.$modal.msgSuccess("新增成功");
        bus.emit(showDialogKey,{show:false,form:form.value,title:props.title})
        bus.emit(executeQueryKey)
      });
    }
  }
}
</script>

<style scoped>

</style>
