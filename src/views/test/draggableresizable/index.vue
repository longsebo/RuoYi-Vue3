<template>
  <div class="container">
    <div class="top" :style="{ height: topHeight + 'px' }">
      顶部内容
    </div>
    <div class="splitter" @mousedown="startResize" @touchstart="startResize"></div>
    <div class="bottom" :style="{ height: bottomHeight + 'px' }">
      底部内容
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const topHeight = ref(100);
const bottomHeight = ref(300);
let startY = 0;
let startTopHeight = 0;

const startResize = (event) => {
  event.preventDefault();
  startY = event.clientY;
  startTopHeight = topHeight.value;
  document.addEventListener('mousemove', doResize);
  document.addEventListener('touchmove', doResize);
  document.addEventListener('mouseup', stopResize);
  document.addEventListener('touchend', stopResize);
};

const doResize = (event) => {
  event.preventDefault();
  const diff = event.clientY - startY;
  topHeight.value = startTopHeight + diff;
  bottomHeight.value = 500 - topHeight.value; // 假设容器高度是500px
};

const stopResize = () => {
  document.removeEventListener('mousemove', doResize);
  document.removeEventListener('touchmove', doResize);
  document.removeEventListener('mouseup', stopResize);
  document.removeEventListener('touchend', stopResize);
};
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  height: 500px;
}
.top, .bottom {
  resize: vertical;
  overflow: auto;
}
.splitter {
  margin-top: 10px;
  margin-bottom: 10px;
  height: 10px;
  cursor: ns-resize;
  background-color: #ccc;
}
</style>
