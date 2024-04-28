<template>
  <div id="app">
    <div class="parent">
      <Vue3DraggableResizable
          :initW="110"
          :initH="120"
          v-model:x="x"
          v-model:y="y"
          v-model:w="w"
          v-model:h="h"
          v-model:active="active"
          :draggable="true"
          :resizable="true"
          @activated="print('activated')"
          @deactivated="print('deactivated')"
          @drag-start="print('drag-start')"
          @resize-start="print('resize-start')"
          @dragging="print('dragging')"
          @resizing="print('resizing')"
          @drag-end="print('drag-end')"
          @resize-end="print('resize-end')"
      >
        <el-row>
          <el-col>
            <el-text class="mx-1" type="primary">人员信息</el-text>
          </el-col>
          <el-col>
            <el-input v-model="input" style="width: 100%" placeholder="请输入别名" />
          </el-col>
          <el-col>
            <el-table
                ref="multipleTableRef"
                :data="tableData"
                style="width: 100%"
                border
            >
              <el-table-column type="selection" width="55" />
              <el-table-column label="字段名" width="120">
                <template #default="scope">{{ scope.row.fieldName }}</template>
              </el-table-column>

            </el-table>
          </el-col>
        </el-row>
      </Vue3DraggableResizable>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import Vue3DraggableResizable from 'vue3-draggable-resizable'
//default styles
import 'vue3-draggable-resizable/dist/Vue3DraggableResizable.css'
export default defineComponent({
  components: { Vue3DraggableResizable },
  data() {
    return {
      x: 100,
      y: 100,
      h: 100,
      w: 100,
      active: false,
      input:'',
      tableData: [
      {
        fieldName: 'name',
      },
      {
        fieldName: 'age',
      },
      {
        fieldName: 'sex',
      }
    ]
    }
  },
  methods: {
    print(val) {
      console.log(val)
    }
  }
})
</script>
<style>
.parent {
  width: 200px;
  height: 200px;
  position: absolute;
  top: 100px;
  left: 100px;
  border: 1px solid #000;
  user-select: none;
}
</style>
