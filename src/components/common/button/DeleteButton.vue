<template>
  <el-button
      type="danger"
      plain
      icon="Delete"
      :disabled="multiple"
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
  title?: string
}
const props = withDefaults(defineProps<Props>(), {
  title: '删除',
})
const ids = ref([]);
const form = ref({});
const multiple = ref(false)


onMounted(() => {
  bus.on(tableRowSelectChangeKey, (data) => {
    console.log('tableRowSelectChangeKey:'+JSON.stringify(data))
    ids.value = data.ids
    multiple.value = data.multiple
  })

})
onUnmounted(() => {
  bus.off(tableRowSelectChangeKey)
}))
/** 更新按钮操作 */
function handleDelete() {
  proxy.$modal.confirm('是否确认删除应用定义编号为"' + ids.value + '"的数据项？').then(function() {
    return delApplication(ids.value);
  }).then(() => {
    bus.emit(executeQueryKey)
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});

}
</script>

<style scoped>

</style>
