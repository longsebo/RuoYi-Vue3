<template>
  <template v-if="cMode === 'design'">
    <el-button  disabled v-bind="props" >{{$attrs.label}}</el-button>
  </template>
  <template v-else-if="cMode === 'edit'">
    <el-button  v-bind="props" >{{$attrs.label}}</el-button>
  </template>
  <template v-else-if="cMode === 'read'">
    <el-button  v-bind="props" >{{$attrs.label}}</el-button>
  </template>
 <template v-else-if="cMode === 'hidden' ">
   <el-button  v-show="false" v-bind="props" >{{$attrs.label}}</el-button>
  </template>
</template>

<script lang="ts" setup>
import { ElButton } from 'element-plus'
import {computed, inject, nextTick, useAttrs} from "vue";
import { formModeKey } from "@/components/form/state.key";

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
console.log('$attrs:'+JSON.stringify(props));

</script>

<style scoped>

</style>
