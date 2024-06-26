<template>
  <div>
  <ag-grid-vue class="ag-theme-balham"
               v-bind="props"
			   :columnDefs="columnDefs"
               :rowData="rowData"
               :style="style"
               @rowSelected="handleSelectionChange"
               :defaultColDef="defaultColDef"
  >
  </ag-grid-vue>

  <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
  />
  </div>
</template>

<script lang="ts" setup>
import bus from '@/event/bus'
import {onMounted, ref, onUnmounted, watch, computed, inject} from "vue";
import {
  queryListResultKey,executeQueryKey,totalKey,queryParamKey,loadingKey,tableRowSelectChangeKey
} from "@/config/app.keys";
import { AgGridVue } from "ag-grid-vue3";
import { formModeKey,vFormSchemeKey } from "@/components/form/state.key";
interface Props {
  checkboxSelection?:boolean //设置数据复选框
  headerCheckboxSelection?:boolean  //表头是否也显示复选框，用于全选反选用
  rowSelection?: string //设置多行选中 ，若是single
  rowHeight?:string//行高
  width?:string//列宽
  columnDefs:object
  style?:any
  dataSourceType?:string//数据源类型：input(手工录入),bindcomponent(绑定组件)
  rowData?:object//行数据
  bindComponent?:string
  rowSelectTriggerComponents?:string//行选择触发组件，通知组件进行处理
  tableHeight?:string
  tableWidth?:string
}

const props = defineProps<Props>()

interface Emits {
  // (e: 'changeColumnDefs', v: object): void
  (e: 'changeRowData', v: object): void
}


const emits = defineEmits<Emits>()
const defaultColDef = ref({
  // suppressEnterToBatchSort: true,
  singleClickEdit:true
});
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
const formMode = inject(formModeKey)
const cMode = computed<FormFieldMode>(() => {
  if (props.mode) {
    return props.mode
  }
  if (formMode?.value) {
    return formMode.value
  }
  return "edit"
})
watch(()=>props,(val)=>{
  columnDefs.value = makeColumnDefs(props.columnDefs)
  console.log('AgGrid Table convert to columnDefs:'+JSON.stringify(columnDefs.value));
  //手工录入数据
  if(props.dataSourceType==='input'){
      rowData.value = props.rowData
      emits('changeRowData', rowData.value)
  }else {
       //监控数据变化,来自其他组件数据不需保存
      let prefix = getBusKeyPrefix();
      bus.on(prefix + queryListResultKey, (data) => {
        rowData.value = data;
      })
      bus.on(prefix + totalKey, (data) => {
        total.value = data;
      })
      bus.on(prefix + queryParamKey, (data) => {
        console.log('queryParamKey:' + JSON.stringify(data.value));
        queryParams.value = data.value;
      })
      bus.on(prefix + loadingKey, (data) => {
        loading.value = data;
      })

  }
},{immediate:true,deep:true})

//构造列定义
function makeColumnDefs(columnDefs){
  let newColumnDefs=[];
  for(let i=0;i<columnDefs.length;i++){
     //判断自定义渲染器是否为
	 newColumnDefs.push(Object.assign({}, columnDefs[i]));
	 if(newColumnDefs[i].cellRenderer==='WrapColumnDesignNestedDragItem'){
	    newColumnDefs[i].cellRenderer='WrapNestedDragItem'
	 }
  }
  return newColumnDefs;
}
const style = computed(
    () => {
      let tableHeight='300px';
      if(props.tableHeight){
        tableHeight = props.tableHeight;
      }
      let tableWidth='400px';
      if(props.tableWidth){
        tableWidth = props.tableWidth;
      }
      return 'height:'+tableHeight+';width:'+tableWidth+';';
    }
);
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
  if(cMode.value!=='design') {
    if (props.dataSourceType === 'bindcomponent') {
      let prefix = getBusKeyPrefix();
      bus.off(prefix + queryListResultKey);
      bus.off(prefix + totalKey);
      bus.off(prefix + queryParamKey);
      bus.off(prefix + loadingKey);
    }
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
  // 触发行选中事件
  let items = props.rowSelectTriggerComponents.split(",")
  for(let item in items) {
    let prefix = item+"_"
    bus.emit(prefix+tableRowSelectChangeKey, {ids: ids.value, single: single.value, multiple: multiple.value})
  }
}

/**
 * 判断是否含有自定义渲染列
 * @param columnDefs
 */
function isHaveCustomRenderColumn(columnDefs1){
  console.log('isHaveCustomRenderColumn,columnDefs1:'+JSON.stringify(columnDefs1))
  for(let i=0;i<columnDefs1.length;i++){
    if(columnDefs1[i].cellRenderer){
      return true;
    }
  }
  return false;
}
</script>



<style scoped>

</style>
