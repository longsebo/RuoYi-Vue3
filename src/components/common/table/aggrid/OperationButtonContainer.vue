<template>
  <el-row :gutter="10">
    <el-col :span="12">
      <ElPlusTableUpdateButton title="修改" :row="props.params.data"/>
    </el-col>
    <el-col :span="12">
      <ElPlusTableDeleteButton title="删除" :row="props.params.data" />
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import {onMounted, ref, watch} from "vue";
import {getCurrentInstance} from 'vue';
import ElPlusTableDeleteButton from "@/components/common/button/ElPlusTableDeleteButton.vue";
import ElPlusTableUpdateButton  from "@/components/common/button/ElPlusTableUpdateButton.vue";

interface Props {
  params:object
}
const props = defineProps<Props>()
const {proxy} = getCurrentInstance();

watch(()=>props.params,()=>{
  debugger;
  console.log('props row:'+JSON.stringify(props.params.data))
},{deep:true,immediate:true})



</script>

<style scoped>

</style>
