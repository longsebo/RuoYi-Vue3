<template>
  <template v-if="cMode === 'design'">
    <el-select v-model="val" disabled="true" v-bind="$attrs" >
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
  </template>
  <template v-else-if="cMode === 'edit'">
    <el-select v-model="val" v-bind="$attrs" @change="handleChange" >
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
  </template>
  <template v-else-if="cMode === 'read' ">
    <span v-text="val"></span>
  </template>
  <template v-else-if="cMode === 'hidden' ">
    <span v-show="false" v-text="val"></span>
  </template>
</template>

<script lang="ts" setup>
import {computed, inject, nextTick, ref, watch} from "vue";
import { formModeKey } from "@/components/form/state.key";
import {getDicts} from "@/api/system/dict/data"

interface Props {
  mode?: FormFieldMode
  value?:  string
  defaultValue?: string
  multiple?:boolean
  optionsSource?:string //有效选择来源：input,dict
  options?:[]
  dictType?:string
}

interface Emits {
  (e: 'update:value', v: string): void
}

const props = defineProps<Props>()

const emits = defineEmits<Emits>()



// const val = computed<string>({
//   get: () => {
//     if (props.value) {
//       return props.value
//     }
//     if (props.defaultValue) {
//       nextTick(() => emits('update:value', props.defaultValue))
//       return props.defaultValue
//     }
//     return ''
//   },
//   set: v => emits('update:value', v)
// })
const val = ref('')
const formMode = inject(formModeKey)
const cMode = computed<FormFieldMode>(() => {
  if (props.mode) {
    return props.mode
  }
  if (formMode?.value) {
    return formMode.value
  }
  console.log("cMode:edit")
  return "edit"
})
const options=ref([])
watch(props,async () => {
  //获取选项列表
  if (props.optionsSource == "input") {
    options.value = props.options
  } else {
    if (!props.dictType||props.dictType==""||props.dictType==null) {
      options.value = []
    }else {
      let tmp = await getDicts(props.dictType)
      let i = 0;
      let options1 = [];
      for (i = 0; i < tmp.data.length; i++) {
        options1.push({label: tmp.data[i].dictLabel, value: tmp.data[i].dictValue})
      }
      options.value = options1;
    }
  }
  //获取模型值
  if (props.value) {
     val.value = props.value
    }
},{deep:true,immediate:true})
function handleChange(newValue){
  emits('update:value', newValue)
}
</script>

<style scoped>

</style>
