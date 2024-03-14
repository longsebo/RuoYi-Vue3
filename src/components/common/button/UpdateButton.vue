<template>
  <el-button
      type="success"
      plain
      icon="Edit"
      :disabled="!single"
      @click="handleUpdate"
      v-hasPermi="['business:application:edit']"
  >{{ props.title}}</el-button>
</template>

<script lang="ts" setup>
import bus from '@/event/bus'
import { getApplication } from "@/api/business/application";
import {
  tableRowSelectChangeKey,resetFormKey,showDialogKey
} from "@/config/app.keys";
import {onMounted, ref, watch} from "vue";

interface Props {
  title?: string,
  id?:number
}
const props = withDefaults(defineProps<Props>(), {
  title: '新增',
  id:0
})
const id = ref(0);
const form = ref({});
const single = ref(false)
watch(() => props.id, (newVal) =>{
  console.log('props.id:'+newVal)
  id.value = newVal
})
onMounted(() => {
  id.value =props.id
  bus.on(tableRowSelectChangeKey, (data) => {
    if(data.ids.length>0) {
      id.value = data.ids[0]
      single.value = data.single
    }
  })

})
/** 更新按钮操作 */
function handleUpdate() {
  bus.emit(resetFormKey);

  getApplication(id.value).then(response => {
    form.value = response.data;
    bus.emit(showDialogKey, {show:true,title:"修改应用定义",form:form.value});
  });

}
</script>

<style scoped>

</style>
