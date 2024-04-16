<template>
  <el-button v-bind="props" :icon="Search" @click="handleQuery">{$attrs.title}</el-button>
</template>

<script lang="ts" setup>
import bus from '@/event/bus'
import {onMounted, ref, onUnmounted, defineProps} from "vue";
import { listApplication  } from "@/api/business/application";
import {
  queryParamKey,queryListResultKey,executeQueryKey,totalKey,loadingKey
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
  operationtype?:string
  operationdata:object,
  id?:string
}

const props = withDefaults(defineProps<Props>(), {
  title: '搜索'
})
const queryParams = ref({})
onMounted(() => {
  bus.on(props.id+"_"+queryParamKey,(data) =>{
    console.log('queryParamKey:'+JSON.stringify(data.value));
    queryParams.value = data.value;
  })
  bus.on(props.id+"_"+executeQueryKey,() => {
    getList();
  })
})
onUnmounted(() =>{
  bus.off(props.id+"_"+queryParamKey);
  bus.off(props.id+"_"+executeQueryKey);
})

/** 查询应用定义列表 */
function getList() {
  //loading.value = true;
  //改变装载状态
  bus.emit(props.id+"_"+loadingKey,true);
  console.log('inject queryParams:'+JSON.stringify(queryParams.value));
  listApplication(queryParams.value).then(response => {
    //通知结果变化
    bus.emit(props.id+"_"+queryListResultKey,response.rows);
    //applicationList.value = response.rows;
    //total.value = response.total;
    bus.emit(props.id+"_"+totalKey,response.total)
    bus.emit(props.id+"_"+loadingKey,false);
  });
}
function  handleQuery() {
  // 处理搜索逻辑
  queryParams.value.pageNum = 1;
  getList();
}


</script>

<style scoped>

</style>
