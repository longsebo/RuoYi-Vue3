<template>
  <el-button
      v-bind="props"
      icon="Edit"
      :disabled="!single"
      @click="handleUpdate"
  >{{ props.label}}</el-button>
</template>

<script lang="ts" setup>
import bus from '@/event/bus'
import { getApplication } from "@/api/business/application";
import {
  tableRowSelectChangeKey,resetFormKey,showDialogKey
} from "@/config/app.keys";
import {onMounted, ref, watch} from "vue";

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
  label?: string,
  btId?:string//按钮本身id
  bindDialog?:string//绑定弹窗的id，通常修改时弹出框显示
}
const props = withDefaults(defineProps<Props>(), {
  label: '编辑',
  id: 0,
  type:"success"
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
  bus.on(props.btId+"_"+tableRowSelectChangeKey, (data) => {
    if(data.ids.length>0) {
      id.value = data.ids[0]
      single.value = data.single
    }
  })

})
/** 更新按钮操作 */
function handleUpdate() {
  bus.emit(props.bindDialog+"_"+resetFormKey);

  getApplication(id.value).then(response => {
    form.value = response.data;
    bus.emit(props.bindDialog+"_"+showDialogKey, {show:true,title:"修改应用定义",form:form.value});
  });

}
</script>

<style scoped>

</style>
