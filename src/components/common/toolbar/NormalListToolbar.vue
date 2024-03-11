<template>
  <el-row :gutter="10" class="mb8">
    <el-col :span="1.5">
     <AddButton title="新增"/>
    </el-col>
    <el-col :span="1.5">
      <UpdateButton title="修改"/>
    </el-col>
    <el-col :span="1.5">
      <DeleteButton title="删除"/>
    </el-col>
    <!--<el-col :span="1.5">
      <el-button
          type="warning"
          plain
          icon="Download"
          v-hasPermi="['business:application:export']"
      >导出</el-button>
    </el-col> -->
    <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
  </el-row>
</template>

<script lang="ts" setup>
import AddButton from '@/components/common/button/AddButton.vue'
import UpdateButton from '@/components/common/button/UpdateButton.vue'
import DeleteButton from '@/components/common/button/DeleteButton.vue'
import {
  executeQueryKey,showSearchKey
} from "@/config/app.keys";
import {onMounted, ref, watch} from "vue";
import bus from '@/event/bus'

const showSearch = ref(true)
watch(showSearch, (newValue, oldValue) =>{
  bus.emit(showSearchKey,newValue)
},{immediate: true})
function getList() {
  bus.emit(executeQueryKey)
}
</script>

<style scoped>

</style>
