<template>
  <el-button
      type="danger"
      plain
      :icon="Delete"
      :disabled="!multiple"
      @click="handleDelete"
      v-hasPermi="['business:application:remove']"
  >{{props.title}}</el-button>
</template>

<script lang="ts" setup>
import bus from '@/event/bus'
import { delApplication } from "@/api/business/application";
import {
  tableRowSelectChangeKey,resetFormKey,executeQueryKey
} from "@/config/app.keys";
import {onMounted, ref, onUnmounted} from "vue";
import {getCurrentInstance} from 'vue';
const {proxy} = getCurrentInstance();
interface Props {
  btId?:string//按钮本身id
  title?: string
  bindComponent?:string//绑定数据源组件 通常为查询按钮，删除后通知它查询
}
const props = withDefaults(defineProps<Props>(), {
  title: '删除',
})
const ids = ref([]);
const form = ref({});
const multiple = ref(false);


onMounted(() => {
  bus.on(props.btId+"_"+tableRowSelectChangeKey, (data) => {
    console.log('tableRowSelectChangeKey:'+JSON.stringify(data))
    ids.value = data.ids
    multiple.value = ids.value.length>0

  })
})
onUnmounted(() => {
  bus.off(props.btId+"_"+tableRowSelectChangeKey)
})
/** 更新按钮操作 */
function handleDelete() {
  proxy.$modal.confirm('是否确认删除应用定义编号为"' + ids.value + '"的数据项？').then(function() {
    return delApplication(ids.value);
  }).then(() => {
    bus.emit(props.bindComponent+"_"+executeQueryKey)
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});

}
</script>

<style scoped>

</style>
