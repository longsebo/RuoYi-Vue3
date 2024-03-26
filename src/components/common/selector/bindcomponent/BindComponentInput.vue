<template>
  <div>
  <div class="user-selector-input">
    <el-tooltip
        　　　　placement="top"
        　　　　:open-delay="500"
        　　　  content="请双击选择组件"
        　　　　:disabled="isShowTooltip"
        　　　　>
      <el-input v-model="bindComponent" readonly style="width:240px;" @dblclick="onClick"  />
    </el-tooltip>
  </div>
  <el-dialog title="选择组件" v-model="open" width="70%" height="95vh" append-to-body>
    <ComponentSelect  @change="changeComponent" @cancel="open = false" :multiple="props.multiple"/>
  </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch} from 'vue'
import ComponentSelect from './BindComponentSelect.vue'
  interface Props {
    bindComponent: string,
    multiple?:boolean
  }
  interface Emits {
    (e: 'change',bindComponent:string): void
  }
  const props = defineProps<Props>()
  const open = ref(false)
  const emits = defineEmits<Emits>()
  const bindComponent = ref('')
  const isShowTooltip =ref(false)
  watch(() => props.bindComponent,() => {
      bindComponent.value = props.bindComponent.toString()
    console.log('BindComponentInput.vue watch bindComponent:'+props.bindComponent)
  }, { immediate: true })
  function onClick() {
    open.value = true;
  }
  function changeComponent(variable) {
    console.log('enter BindComponentInput.vue changeComponent')
    open.value = false;
    if(props.multiple) {
      emits('change', variable.toString())
    }else{
      emits('change', variable)
    }
  }
</script>

<style scoped>

</style>
