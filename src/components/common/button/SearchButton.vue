<template>
  <el-button v-bind="props" :icon="Search" @click="handleClick">{{props.label}}</el-button>
</template>

<script lang="ts" setup>
import bus from '@/event/bus'
import {onMounted, ref, onUnmounted, defineProps} from "vue";
import { Search } from '@element-plus/icons-vue';
import {replaceDynamicVar} from '@/api/tool/replacevar'
import {listInterfaceAll,convert2ApiJson,doRequest} from '@/api/business/interface'
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
  id?:string,
  label:string
}

const props = withDefaults(defineProps<Props>(), {
  label: '搜索'
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

async function handleClick() {
  debugger;
  //替换变量值
  let opertionParameter = JSON.stringify(props.operationdata.parameterList);
  let contextMap = new Map();
  console.log('props.formData:' + JSON.stringify(props.formData))
  let replaceParameters = replaceDynamicVar(props.formData, contextMap, opertionParameter)

  //将replaceParameters转换为json对象
  let jsonParameters = JSON.parse(replaceParameters);
  //调用API
  //根据事件类型，判断是调用API还是打开网页
  if (props.operationtype === 'api') {
    //改变装载状态
    bus.emit(props.id+"_"+loadingKey,true);
    //根据接口编码查询接口信息
    let interfaceParam = {"interfaceCode": props.operationdata.interfaceCode};
    let interfaceInfo = await listInterfaceAll(interfaceParam);
    if (interfaceInfo.code === 200) {
      //调用接口
      let apiParameter =convert2ApiJson(jsonParameters)
      apiParameter["interfaceCode"]=props.operationdata.interfaceCode
      let res = await doRequest(interfaceInfo.data[0], apiParameter);

      if (res.code === 200) {
        //通知结果变化
        bus.emit(props.id+"_"+queryListResultKey,response.rows);
        //applicationList.value = response.rows;
        //total.value = response.total;
        bus.emit(props.id+"_"+totalKey,response.total)
        bus.emit(props.id+"_"+loadingKey,false);
        ElMessage.success(res.msg)
      }else{
        ElMessage.error(res.msg || '操作失败！')
      }
    }
  } else {
    //TODO
    //打开网页
  }
}

function  handleQuery() {
  // 处理搜索逻辑
  queryParams.value.pageNum = 1;
  getList();
}
console.log('searchbutton $attrs:'+JSON.stringify(props));

</script>

<style scoped>

</style>
