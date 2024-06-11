<template>
  <div>
    <el-table
        :data="componentTreeData"
        style="width: 100%; margin-bottom: 20px"
        row-key="id"
        border
        default-expand-all
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column prop="label1" label="字段名称(组件名称)"  />
      <el-table-column prop="component" label="组件类型"  />
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { ref} from "vue";




const componentTreeData=ref([
  {
    "id": 1,
    "label1": "layout",
    "component": "el-row",
    "children": [
      {
        "id": 2,
        "label1": "layout",
        "component": "el-col",
        "children": [
          {
            "id": 3,
            "label1": "产品名称",
            "component": "text-input",
          }
        ]
      }
    ]
  }
]);



</script>

<style scoped>

</style>
