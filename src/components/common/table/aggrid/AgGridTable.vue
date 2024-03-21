<template>
  <ag-grid-vue class="ag-theme-balham"
               v-bind="props"
               :rowData="rowData"
               @rowSelected="handleSelectionChange"
  >
  </ag-grid-vue>

  <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
  />

</template>

<script lang="ts" setup>
import bus from '@/event/bus'
import {onMounted, ref, onUnmounted, watch} from "vue";
import {
  queryListResultKey,executeQueryKey,totalKey,queryParamKey,loadingKey,tableRowSelectChangeKey
} from "@/config/app.keys";
import { AgGridVue } from "ag-grid-vue3";

interface Props {
  checkboxSelection?:boolean //设置数据复选框
  headerCheckboxSelection?:boolean  //表头是否也显示复选框，用于全选反选用
  rowSelection?: string //设置多行选中 ，若是single
  rowHeight?:number//行高
  width?:number//列宽
  columnDefs:object
  style?:string
  dataSourceType?:string//数据源类型：input(手工录入),bindcomponent(绑定组件)
  rowData?:object//行数据
  bindComponent?:string
  rowSelectTriggerComponents?:string[]//行选择触发组件，通知组件进行处理
}

const props = defineProps<Props>()

const rowData = ref([]);
const total = ref(0);
const loading = ref(false)
const ids=ref([])
const single = ref(true);
const multiple = ref(true);
const queryParams = ref({
  pageNum: 1,
  pageSize: 10,
})
const columnDefs =ref([])

watch(()=>props.dataSourceType,(val)=>{
  //手工录入数据
  if(val==='input'){
      rowData.value = props.rowData
  }else {
    //监控数据变化
    let prefix=getBusKeyPrefix();
    bus.on(prefix+queryListResultKey,(data) =>{
      rowData.value = data;
    })
    bus.on(prefix+totalKey,(data) =>{
      total.value = data;
    })
    bus.on(prefix+queryParamKey,(data) =>{
      console.log('queryParamKey:'+JSON.stringify(data.value));
      queryParams.value = data.value;
    })
    bus.on(prefix+loadingKey,(data) =>{
      loading.value = data;
    })
  }
},{immediate:true})

/**
 * 获取bus监控key前缀
 */
function getBusKeyPrefix(){
  return props.bindComponent+"_"
}

onMounted(() =>{
  bus.emit(getBusKeyPrefix()+executeQueryKey,queryParams.value);
})
onUnmounted(() =>{
  //如果绑定了组件，则撤销监控
  if(props.dataSourceType==='bindcomponent') {
    let prefix = getBusKeyPrefix();
    bus.off(prefix + queryListResultKey);
    bus.off(prefix + totalKey);
    bus.off(prefix + queryParamKey);
    bus.off(prefix + loadingKey);
  }
})
function getList() {
  let prefix = getBusKeyPrefix();
  bus.emit(prefix+executeQueryKey);
}

// 多选框选中数据
function handleSelectionChange(event) {
  // ids.value = selection.map(item => item.id);
  // single.value = selection.length != 1;
  // multiple.value = !selection.length;
  if(event.node.selected){
    // 处理选中该行的操作
    //console.log("Row selected: " + event.node.data.id)
    //判断ids是否存在event.node.data.id,不存在加入
    if(!ids.value.includes(event.node.data.id)) {
      ids.value.push(event.node.data.id);
    }
  } else {
    // 处理撤销选中该行的操作
    console.log("Row deselected:" + event.node.data.id)
    //判断ids是否存在event.node.data.id,存在则删除
    if(ids.value.includes(event.node.data.id)) {
      const index = ids.value.indexOf(event.node.data.id);
      if (index > -1) {
        ids.value.splice(index, 1);
      }
    }
  }
  single.value  = (ids.value.length==1)
  multiple.value = (ids.value.length>1)
  for(let item in props.rowSelectTriggerComponents) {
    let prefix = item+"_"
    bus.emit(prefix+tableRowSelectChangeKey, {ids: ids.value, single: single.value, multiple: multiple.value})
  }
}

</script>



<style scoped>

</style>
