<template>
  <el-button type="primary" icon="Search" @click="handleQuery">{{props.title}}</el-button>
</template>

<script lang="ts" setup>
import bus from '@/event/bus'
import {onMounted, ref} from "vue";
import { listApplication  } from "@/api/business/application";
import {
  queryParamKey,queryListResultKey,executeQueryKey,totalKey,loadingKey
} from "@/config/app.keys";
interface Props {
  title?: string
}
const props = withDefaults(defineProps<Props>(), {
  title: '搜索',
})
const queryParams = ref({})
onMounted(() => {
  bus.on(queryParamKey,(data) =>{
    console.log('queryParamKey:'+JSON.stringify(data.value));
    queryParams.value = data.value;
  })
  bus.on(executeQueryKey,() => {
    getList();
  })
})
/** 查询应用定义列表 */
function getList() {
  //loading.value = true;
  //改变装载状态
  bus.emit(loadingKey,true);
  console.log('inject queryParams:'+JSON.stringify(queryParams.value));
  listApplication(queryParams.value).then(response => {
    //通知结果变化
    bus.emit(queryListResultKey,response.rows);
    //applicationList.value = response.rows;
    //total.value = response.total;
    bus.emit(totalKey,response.total)
    bus.emit(loadingKey,false);
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
