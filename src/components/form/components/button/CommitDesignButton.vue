<template>
  <template v-if="cMode === 'design'">
    <commit-button   v-bind="props" >{{$attrs.label}}</commit-button>
  </template>
  <template v-else-if="cMode === 'edit'">
    <commit-button  v-bind="props" >{{$attrs.label}}</commit-button>
  </template>
  <template v-else-if="cMode === 'read'">
    <commit-button  v-bind="props" >{{$attrs.label}}</commit-button>
  </template>
 <template v-else-if="cMode === 'hidden' ">
   <commit-button  v-show="false" v-bind="props" >{{$attrs.label}}</commit-button>
  </template>
</template>

<script lang="ts" setup>
import {ElButton, ElMessage} from 'element-plus'
import {computed, inject, nextTick, useAttrs, watch} from "vue";
import { formModeKey } from "@/components/form/state.key";
import { vFormSchemeKey } from '@/components/form/state.key';

import CommitButton from '@/components/common/button/ConfirmButton.vue'
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
  addoperationdata:object,
  updateoperationdata:object,
  id?:string,
  label?: string
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
