<template>
  <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
    <el-form-item label="应用编码" prop="applicationCode">
      <el-input
          v-model="queryParams.applicationCode"
          placeholder="请输入应用编码"
          clearable
      />
    </el-form-item>
    <el-form-item label="应用名称" prop="applicationName">
      <el-input
          v-model="queryParams.applicationName"
          placeholder="请输入应用名称"
          clearable
      />
    </el-form-item>
    <el-form-item>
      <SearchButton title="搜索"/>
      <ResetButton title="重置"/>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import {
  queryParamKey,resetQueryFormKey
} from "@/config/app.keys";
import bus from '@/event/bus'
import {onMounted, ref, watch} from "vue";
import SearchButton from '@/components/common/button/SearchButton.vue'
import ResetButton from '@/components/common/button/ResetButton.vue'
const { proxy } = getCurrentInstance();
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

onMounted(() => {
  bus.on(resetQueryFormKey,() => {
    proxy.resetForm("queryRef");
  })
})
</script>

<style scoped>

</style>
