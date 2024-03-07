<template>
  <template v-if="cMode === 'design'">
    <el-button  disabled v-bind="props" >{{$attrs.label}}</el-button>
  </template>
  <template v-else-if="cMode === 'edit'">
    <el-button  v-bind="props" @click="handleClick">{{$attrs.label}}</el-button>
  </template>
  <template v-else-if="cMode === 'read'">
    <el-button  v-bind="props" >{{$attrs.label}}</el-button>
  </template>
 <template v-else-if="cMode === 'hidden' ">
   <el-button  v-show="false" v-bind="props" >{{$attrs.label}}</el-button>
  </template>
</template>

<script lang="ts" setup>
import {ElButton, ElMessage} from 'element-plus'
import {computed, inject, nextTick, useAttrs} from "vue";
import { formModeKey } from "@/components/form/state.key";
import { vFormSchemeKey } from '@/components/form/state.key';
import {replaceDynamicVar} from '@/api/tool/replaceDynamicVar'
import {listInterfaceAll} from '@/api/business/interface'
import request from '@/utils/request'
const formScheme = inject(vFormSchemeKey)!

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
  operationdata:object
}

interface Emits {
  (e: 'update:value', v: string): void
}

const props = defineProps<Props>()

const emits = defineEmits<Emits>()


const attrs = useAttrs()
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
//console.log('$attrs:'+JSON.stringify(props));
async function handleClick() {
  //替换变量值
  let opertionParameter = JSON.stringify(props.operationdata.parameterList);
  let contextMap = {}
  let replaceParameters = replaceDynamicVar(props.formData, contextMap, opertionParameter)
  console.log('replaceParameters:' + replaceParameters)
  //将replaceParameters转换为json对象
  let jsonParameters = JSON.parse(replaceParameters);
  //调用API
  //根据事件类型，判断是调用API还是打开网页
  if (props.operationtype === 'api') {
    //根据接口编码查询接口信息
    let interfaceParam = {"interfaceCode": props.operationdata.interfaceCode};
    let interfaceInfo = await listInterfaceAll(interfaceParam);
    if (interfaceInfo.code === 200) {
      //调用接口
      let res = await doRequest(interfaceInfo.data, jsonParameters);
      if (res.code === 200) {
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
function doRequest(interfaceInfo,parameters) {
  if(interfaceInfo.interfaceMethod.toLowerCase === 'get') {
    return request({
      url: interfaceInfo.interfaceUrl,
      method: 'get',
      params: parameters
    })
  }else{
    return request({
      url: interfaceInfo.interfaceUrl,
      method: interfaceInfo.interfaceMethod,
      data: parameters
    })
  }
}
</script>

<style scoped>

</style>
