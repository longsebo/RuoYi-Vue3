<template>
  <div class="user-selector-input">
    <el-input v-model="selectVariable" style="width: 240px" placeholder="请双击选择组件" :readonly="true" @dblclick="onDblClick" />
  </div>
  <el-dialog title="选择组件" v-model="open" width="70%" height="95vh" append-to-body>
    <ComponentSelect  @change="changeVariable" @cancel="open = false"/>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, watch} from 'vue'
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
  watch(() => props.selectVariable,() => {
    selectVariable.value = props.selectVariable
  })
  function onDblClick() {
    open.value = true;
  }
  function changeVariable(variable: string) {
    open.value = false;
    emits('change', "${"+variable+"}")
  }
</script>

<style scoped>

</style>
