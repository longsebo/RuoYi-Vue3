<template>
  <el-button v-bind="props" icon="Refresh" @click="resetQuery">{{props.label}}</el-button>
</template>

<script setup lang="ts">
import bus from '@/event/bus'

import {
  executeQueryKey,resetQueryFormKey
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
  id?:string,
  label:string
}
const props = withDefaults(defineProps<Props>(), {
  label: '重置',
})
const resetQuery = () => {
  bus.emit(resetQueryFormKey)
  bus.emit(executeQueryKey)
}

</script>

<style scoped>

</style>
