<template>
  <el-button link type="primary" :icon="Delete" @click="handleDelete()"
             v-hasPermi="['business:application:remove']">{{props.title}}</el-button>
</template>

<script lang="ts" setup>
import {defineProps, ref, watch} from 'vue';
import {getCurrentInstance} from 'vue';
import { delApplication } from "@/api/business/application";
import {executeQueryKey} from "../../../config/app.keys";
import { Delete } from '@element-plus/icons-vue'
import bus from "@/event/bus";
interface Props {
  title?: string,
  row?:object
}
const props = withDefaults(defineProps<Props>(), {
  title: '删除'
})
const {proxy} = getCurrentInstance();
const ids=ref([])

watch(() => props.row, (newval, oldval) => {
  // console.log('row:'+JSON.stringify(props.row))
  ids.value = [props.row.id]
  console.log('ids',ids.value)
},{immediate:true});
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
