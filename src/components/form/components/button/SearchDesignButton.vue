<template>
  <template v-if="cMode === 'design'">
    <search-button   v-bind="props" >{{$attrs.label}}</search-button>
  </template>
  <template v-else-if="cMode === 'edit'">
    <search-button  v-bind="props" >{{$attrs.label}}</search-button>
  </template>
  <template v-else-if="cMode === 'read'">
    <search-button  v-bind="props" >{{$attrs.label}}</search-button>
  </template>
 <template v-else-if="cMode === 'hidden' ">
   <search-button  v-show="false" v-bind="props" >{{$attrs.label}}</search-button>
  </template>
</template>

<script lang="ts" setup>
import {ElButton, ElMessage} from 'element-plus'
import {computed, inject, nextTick, useAttrs, watch} from "vue";
import { formModeKey } from "@/components/form/state.key";
import { vFormSchemeKey } from '@/components/form/state.key';
import {replaceDynamicVar} from '@/api/tool/replacevar'
import {listInterfaceAll} from '@/api/business/interface'
import SearchButton from '@/components/common/button/SearchButton.vue'
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
  operationdata:object,
  id?:string
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
watch(() => props, (newVal) =>{
  //if cMode is design ,then disable
  /*if(cMode.value ==='design'){
    props.disabled = true
  }*/
},{immediate: true,deep: true})
//console.log('$attrs:'+JSON.stringify(props));


/**
 * 将后台传过来的参数转换为API需要的参数
 * @param jsonParameters
 * @param parentName 父级名称
 */
function convert2ApiJson(jsonParameters) {
  let apiJsonObj ={};
  console.log('convert2ApiJson jsonParameters:'+JSON.stringify(jsonParameters));
  for(let i=0;i<jsonParameters.length;i++){
    if(!hasSubLevels(jsonParameters[i].children)) {
      apiJsonObj[jsonParameters[i].parameterName] = jsonParameters[i].parameterValue || '';
    }else{
      apiJsonObj[jsonParameters[i].parameterName] = convert2ApiJson(jsonParameters[i].children)
    }
  }
  return apiJsonObj;
}

/**
 * 判断json是否还有下级
 * @param node
 */
function hasSubLevels(node) {
  return typeof node === 'object' && node !== null && Object.keys(node).length > 0;
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
