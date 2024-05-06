<template>
  <el-table :data="treeData" row-key="id" :tree-props="{children: 'children'}">
    <el-table-column  label="层次">
      <template #default="scope">
        <el-button>{{scope.id}}</el-button>
      </template>
    </el-table-column>
    <el-table-column  label="条件">
      <template #default="scope">
        <el-select
            v-model="value"
            placeholder="Select"
            size="large"
            style="width: 240px"
            v-show="scope.row.type===1"
        >
          <el-option
              v-for="item in conditionTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
        <el-row v-show="scope.row.type===2">
          <el-col>
             <el-input v-model="scrope.row.left"
          </el-col>
          <el-col>
          </el-col>
          <el-col>
          </el-col>
        </el-row>
      </template>
    </el-table-column>
    <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
      <template #default="scope">
        <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['business:application:edit']">修改</el-button>
        <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['business:application:remove']">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import { onMounted,Directive, watch,ref } from 'vue';
const conditionTypes=ref[{label:'分支内所有条件必须匹配',value:'All'},
    {label:'分支内所有条件任意一个匹配',value:'Any'},
    {label:'分支中的任何条件都不能匹配',value:'None'},
    {label:'分支中没有一个条件必须匹配',value:'NotAll'}]

</script>

<style scoped>

</style>
