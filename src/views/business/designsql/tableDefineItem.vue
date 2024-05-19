<template>
  <el-row>
    <el-col >
      <el-text class="mx-1" type="primary">{{tableDefine.cnName}}</el-text>
    </el-col>
    <el-col>
      <el-input v-model="tableDefine.alias" style="width: 100%" placeholder="请输入别名" />
    </el-col>
    <el-col>
      <el-table
          ref="multipleTableRef"
          :data="tableDefine.columns"
          style="width: 100%"
          height="150px"
          border
          @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column label="字段中文名" width="120">
          <template #default="scope">{{ scope.row.fieldCnName }}</template>
        </el-table-column>
        <el-table-column label="字段英文名" width="120">
          <template #default="scope">{{ scope.row.fieldEnName }}</template>
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import {getCurrentInstance, inject, ref, watch} from "vue";
import bus from '@/event/bus'
import {
  tabDesignColumnSelectChangeKey
} from "@/config/app.keys";
interface Emits {
  (e: 'updateTableDefine', tableDefineItem: object): void
}

const emit = defineEmits<Emits>()

const props= defineProps({
  tableDefine: {
      alias:  String,
      cnName: String,
      enName: String,
      datasourceName:String,
      x: Number,
      y: Number,
      h: Number,
      w: Number,
      active: Boolean,
      columns: Array
  }
})
const tableDefine =ref([])
watch(() => props.tableDefine, val => {
  console.log('tableDefine:'+JSON.stringify(props.tableDefine));
  tableDefine.value = JSON.parse(JSON.stringify(props.tableDefine));
},{immediate:true,deep:true});
watch(()=>tableDefine.alias,val=>{
  //更新父窗口
  emit('updateTableDefine', tableDefine.value)
});
function handleSelectionChange(selection) {
  let newSelection = JSON.parse(JSON.stringify(selection))
  //通知bus，选择发生变化
  bus.emit(tabDesignColumnSelectChangeKey,newSelection,tableDefine.value)
}
</script>

<style >
.mx-1 {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 20px; /* 根据需要设置容器的高度 */
}
</style>
