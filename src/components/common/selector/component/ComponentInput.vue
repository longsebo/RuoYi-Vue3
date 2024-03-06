<template>
  <div class="user-selector-input">
    <el-tooltip
        　　　　placement="top"
        　　　　:open-delay="500"
        　　　  content="请双击选择组件"
        　　　　:disabled="isShowTooltip"
        　　　　>
      <el-input v-model="selectVariable" style="width:240px;" @dblclick="onClick" />
    </el-tooltip>
  </div>
  <el-dialog title="选择组件" v-model="open" width="70%" height="95vh" append-to-body>
    <ComponentSelect  @change="changeVariable" @cancel="open = false"/>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, watch} from 'vue'
import { Link } from "@element-plus/icons-vue";
import ComponentSelect from './ComponentSelect.vue'
  interface Props {
    selectVariable: string,
  }
  interface Emits {
    (e: 'change',selectVariable:string): void
  }
  const props = defineProps<Props>()
  const open = ref(false)
  const emits = defineEmits<Emits>()
  const selectVariable = ref('')
  const isShowTooltip =ref(false)
  watch(() => props.selectVariable,() => {
    selectVariable.value = props.selectVariable
    console.log('ComponentInput.vue watch selectVariable:'+props.selectVariable)
  }, { immediate: true })
  function onClick() {
    open.value = true;
  }
  function changeVariable(variable: string) {
    open.value = false;
    emits('change', "${"+variable+"}")
  }
</script>

<style scoped>

</style>
