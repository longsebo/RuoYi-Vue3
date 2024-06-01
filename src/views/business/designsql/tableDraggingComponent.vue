<template>
  <div id="app">
    <div class="parent">
      <vue3-draggable-resizable
          v-for="item in tableDefineItems"
          v-model:x="item.x"
          v-model:y="item.y"
          v-model:width="item.w"
          v-model:height="item.h"
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
          @resize-end="resizeEnd1()"
      >
        <TableDefineItem    :tableDefine="item" @updateTableDefine="updateTableDefine"/>
      </vue3-draggable-resizable>
    </div>
  </div>
</template>

<script setup lang="ts">
import TableDefineItem from './tableDefineItem'
import {computed, getCurrentInstance, inject, onMounted, ref, watch} from "vue";
import Vue3DraggableResizable from 'vue3-draggable-resizable'
import 'vue3-draggable-resizable/dist/Vue3DraggableResizable.css'
interface Emits {
  (e: 'updateTableDefine', tableDefineItems: object): void
}

const emit = defineEmits<Emits>()

const props= defineProps({
  tableDefineItems: {
    type: Array,
    default: () => [{
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
    }]
  }
})
const tableDefineItems =ref([])
const active = ref(false);

watch(() => props.tableDefineItems, val => {
  //console.log('tableDefineItems', JSON.stringify(props.tableDefineItems))
 tableDefineItems.value = JSON.parse(JSON.stringify(props.tableDefineItems));
},{deep: true,immediate: true});
onMounted(() =>{
  console.log('tableDefineItems', JSON.stringify(props.tableDefineItems))
  tableDefineItems.value = JSON.parse(JSON.stringify(props.tableDefineItems));
})
function print(test){
  console.log(test)
}
function resizeEnd1(){
  //console.log('tableDefineItems', JSON.stringify(tableDefineItems.value))
}
function updateTableDefine(tableDefineItem){
  debugger;
  // 替换元素
  tableDefineItems.value = tableDefineItems.value.map((element, i) => {
    if(element.datasourceName=== tableDefineItem.datasourceName && element.enName === tableDefineItem.enName ){
      return tableDefineItem;
    }else {
      return element;
    }
  });
  //更新父窗口
  emit('updateTableDefine', tableDefineItems.value)
}
</script>

<style >
.parent {
  position: relative; /* 父div需要设置为相对定位 */
  background-color: #f0f0f0;
}
</style>
