<template>
  <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
    <el-form-item label="应用编码" prop="applicationCode">
      <el-input
          v-model="queryParams.applicationCode"
          placeholder="请输入应用编码"
          clearable
          @keyup.enter="handleQuery"
      />
    </el-form-item>
    <el-form-item label="应用名称" prop="applicationName">
      <el-input
          v-model="queryParams.applicationName"
          placeholder="请输入应用名称"
          clearable
          @keyup.enter="handleQuery"
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
      <el-button icon="Refresh" @click="resetQuery">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import {
  queryParamKey
} from "@/config/app.keys";
import bus from '@/event/bus'
import {ref, watch} from "vue";

const queryParams = ref({
      pageNum: 1,
      pageSize: 10,
      applicationCode: null,
      applicationName: null,
})

watch(() => queryParams, () => {
  console.log('bus.emit：'+JSON.stringify(queryParams))
  bus.emit(queryParamKey, queryParams)
},{immediate: true,deep: true})


const showSearch = ref(true)

const handleQuery = () => {
  bus.emit(queryParamKey, queryParams)
}

const resetQuery = () => {
  queryParams.applicationCode = null
  queryParams.applicationName = null
  handleQuery()
}

</script>

<style scoped>

</style>
