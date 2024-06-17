<template>
  <template v-if="cMode === 'design'">
    <add-button   v-bind="props" >{{$attrs.label}}</add-button>
  </template>
  <template v-else-if="cMode === 'edit'">
    <add-button  v-bind="props" >{{$attrs.label}}</add-button>
  </template>
  <template v-else-if="cMode === 'read'">
    <add-button  v-bind="props" >{{$attrs.label}}</add-button>
  </template>
 <template v-else-if="cMode === 'hidden' ">
   <add-button  v-show="false" v-bind="props" >{{$attrs.label}}</add-button>
  </template>
</template>

<script lang="ts" setup>
import {computed, inject, nextTick, useAttrs, watch} from "vue";
import { formModeKey } from "@/components/form/state.key";
import { vFormSchemeKey } from '@/components/form/state.key';

import AddButton from '@/components/common/button/AddButton.vue'
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
  id?:string,
  bindDialog:string,//绑定对话框
}

interface Emits {
  (e: 'update:value', v: string): void
}

const props = defineProps<Props>()

const emits = defineEmits<Emits>()


const attrs = useAttrs()
const formMode = inject(formModeKey)
const cMode = computed<FormFieldMode>(() => {
  debugger;
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
console.log('adddesignbutton $attrs:'+JSON.stringify(props));

</script>

<style scoped>

</style>
