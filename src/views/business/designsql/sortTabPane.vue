<template>
  <div class="common-layout">
    <el-container style="height: 100vh;">
      <el-aside width="200px">
        <el-row>
          <el-col :span="10">
            <el-table :data="tableData" style="width: 100%">
              <el-table-column prop="date" label="日期" width="180"></el-table-column>
            </el-table>
          </el-col>
          <el-col :span="2">

          </el-col>
        </el-row>
      </el-aside>
      <el-main style="flex: 1">
        <el-row>
          <el-col :span="10">

          </el-col>
          <el-col :span="2">

          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">

</script>

<style >
.el-container {
  display: flex; /* 启用Flex布局 */
  flex-direction: row; /* 指定主轴方向为行 */
}

.el-main {
  overflow: auto; /* 当内容过多时，可以滚动查看 */
}
</style>
