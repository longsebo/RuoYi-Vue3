<template>
  <ag-grid-vue style="height: 300px; width: 100%"
               class="ag-theme-balham"
               :columnDefs="columnDefs" :rowData="applicationList"
               @rowSelected="handleSelectionChange"
               rowSelection="multiple"
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
import ElPlusTableDeleteButton from "@/components/common/button/ElPlusTableDeleteButton.vue";
import ElPlusTableUpdateButton  from "@/components/common/button/ElPlusTableUpdateButton.vue";
import { AgGridVue } from "ag-grid-vue3";

interface Props {
  columnDefs:object
}
const props = defineProps<Props>()
const applicationList = ref([]);
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
const ButtonRenderer = {
  template: `<div class="button-container">
  <ElPlusTableUpdateButton title="修改" :row="scope.row"/>
  <ElPlusTableDeleteButton title="删除" :row="scope.row" />
  </div>`,
  props: ['scope'],
  setup(props, { attrs }) {
    const { data, node } = attrs;
  }
}
watch(()=>props.columnDefs,(val)=>{
  //columnDefs.value = props.columnDefs;
  console.log('props.columnDefs:'+JSON.stringify(props.columnDefs))
  //循环列，如果是id,则前面添加checkbox
  for(let i=0;i<props.columnDefs.length;i++){
    let item = props.columnDefs[i]
    if(props.columnDefs[i].field.toLowerCase() === 'id'){
      item.checkboxSelection = true;
    }
    columnDefs.value.push(item)
  }
  //后面添加两个按钮
  columnDefs.value.push({
    headerName: '操作',
    field: 'operation',
    width: 150,
    cellRendererFramework: ButtonRenderer,
  })
},{immediate:true})

onMounted(() => {
  bus.on(queryListResultKey,(data) =>{
    applicationList.value = data;
  })
  bus.on(totalKey,(data) =>{
    total.value = data;
  })
  bus.on(queryParamKey,(data) =>{
    console.log('queryParamKey:'+JSON.stringify(data.value));
    queryParams.value = data.value;
  })
  bus.on(loadingKey,(data) =>{
      loading.value = data;
  })
})
onUnmounted(() =>{
  bus.off(queryListResultKey);
  bus.off(totalKey);
  bus.off(queryParamKey);
  bus.off(loadingKey);
})
function getList() {
  bus.emit(executeQueryKey);
}
function handleUpdate(row: any) {
  console.log(row);
}
function handleDelete(row: any) {
  console.log(row);
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

  bus.emit(tableRowSelectChangeKey,{ids:ids.value,single:single.value,multiple:multiple.value})
}

</script>



<style scoped>

</style>
