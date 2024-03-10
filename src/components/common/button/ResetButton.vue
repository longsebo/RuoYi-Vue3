<template>
  <el-button icon="Refresh" @click="resetQuery">{{props.title }}</el-button>
</template>

<script setup lang="ts">
import bus from '@/event/bus'

import {
  executeQueryKey,resetQueryFormKey
} from "@/config/app.keys";

interface Props {
  title?: string
}
const props = withDefaults(defineProps<Props>(), {
  title: '重置',
})
const resetQuery = () => {
  bus.emit(resetQueryFormKey)
  bus.emit(executeQueryKey)
}

</script>

<style scoped>

</style>
