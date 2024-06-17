<template>
  <template v-if="cMode === 'design'">
    <delete-button   v-bind="props" >{{$attrs.label}}</delete-button>
  </template>
  <template v-else-if="cMode === 'edit'">
    <delete-button  v-bind="props" >{{$attrs.label}}</delete-button>
  </template>
  <template v-else-if="cMode === 'read'">
    <delete-button  v-bind="props" >{{$attrs.label}}</delete-button>
  </template>
 <template v-else-if="cMode === 'hidden' ">
   <delete-button  v-show="false" v-bind="props" >{{$attrs.label}}</delete-button>
  </template>
</template>

<script lang="ts" setup>
import {ElButton, ElMessage} from 'element-plus'
import {computed, inject, nextTick, useAttrs, watch} from "vue";
import { formModeKey } from "@/components/form/state.key";
import { vFormSchemeKey } from '@/components/form/state.key';

import DeleteButton from '@/components/common/button/DeleteButton.vue'
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
console.log('searchdesignbutton $attrs:'+JSON.stringify(props));

</script>

<style scoped>

</style>
