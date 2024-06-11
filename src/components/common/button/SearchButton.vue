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
import {ElButton, ElMessage} from 'element-plus'
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
const queryParams = ref({
  pageNum: 1,
  pageSize: 10,
})
onMounted(() => {
  bus.on(props.id+"_"+queryParamKey,(data) =>{
    console.log('queryParamKey:'+JSON.stringify(data.value));
    queryParams.value = data.value;
  })
  bus.on(props.id+"_"+executeQueryKey,() => {
    handleClick();
  })
})
onUnmounted(() =>{
  bus.off(props.id+"_"+queryParamKey);
  bus.off(props.id+"_"+executeQueryKey);
})



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
    //改变装载状态
    bus.emit(props.id+"_"+loadingKey,true);
    //根据接口编码查询接口信息
    let interfaceParam = {"interfaceCode": props.operationdata.interfaceCode};
    let interfaceInfo = await listInterfaceAll(interfaceParam);
    if (interfaceInfo.code === 200) {
      //调用接口
      let searchParameter =convert2ApiJson(jsonParameters)
      let apiParameter ={};
      apiParameter["interfaceCode"]=props.operationdata.interfaceCode
      //判断是否为翻页
      if(interfaceInfo.data[0].isPage=='Y'){
        apiParameter["pageNum"]=queryParams.value.pageNum;
        apiParameter["pageSize"]=queryParams.value.pageSize;
      }
      apiParameter["searchCondition"] = searchParameter;
      let res = await doRequest(interfaceInfo.data[0], apiParameter);

      if (res.code === 200) {
        //通知结果变化
        bus.emit(props.id+"_"+queryListResultKey,res.rows);
        //applicationList.value = response.rows;
        //total.value = response.total;
        bus.emit(props.id+"_"+totalKey,res.total)
        bus.emit(props.id+"_"+loadingKey,false);
        ElMessage.success(res.msg)
      }else{
        ElMessage.error(res.msg || '操作失败！')
      }
    }

}


console.log('searchbutton $attrs:'+JSON.stringify(props));

</script>

<style scoped>

</style>
