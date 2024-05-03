<template>
  <el-container>
    <el-header>
      <el-checkbox  v-model="distinct">是否排重</el-checkbox>
    </el-header>
    <el-main>
      <el-row :gutter="15">
        <el-col :span="1.5"><el-button link type="primary" :icon="upArrowIcon" @click="moveUp"/></el-col>
        <el-col :span="1.5"><el-button link type="primary" :icon="downArrowIcon" @click="moveDown"/></el-col>
        <el-col :span="1.5"><el-button link type="primary" icon="Plus" @click="addColumn"/></el-col>
        <el-col :span="1.5"><el-button link type="primary" icon="Delete" @click="deleteColumn"/></el-col>
      </el-row>
      <el-table :data="selectColumnTabModel" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="列表达式" align="center" prop="columAndExp" />
        <el-table-column label="别名" align="center" prop="alias" />
        <el-table-column label="聚合" align="center" prop="aggregation" />
      </el-table>

    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { onMounted, watch,ref } from 'vue';
import { useIcon } from "@/components/common/util";

const upArrowIcon = useIcon("ali_up_arrow")
const downArrowIcon = useIcon("ali_down_arrow")
const distinct = ref(false)
const selectColumnTabModel =ref([])

</script>

<style scoped>

</style>
