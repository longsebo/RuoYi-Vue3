<template>
  <template v-if="cMode === 'design'">
     <el-select v-model="val" disabled v-bind="$attrs" >
       <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
     </el-select>
  </template>
  <template v-else-if="cMode === 'edit'">
     <el-select v-model="val" v-bind="$attrs" >
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
import { computed, inject, nextTick } from "vue";
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



const val = computed<string>({
  get: () => {
    if (props.value) {
      return props.value
    }
    if (props.defaultValue) {
      nextTick(() => emits('update:value', props.defaultValue))
      return props.defaultValue
    }
    return ''
  },
  set: v => emits('update:value', v)
})

const formMode = inject(formModeKey)
const cMode = computed<FormFieldMode>(() => {
  if (props.mode) {
    return props.mode
  }
  if (formMode?.value) {
    return formMode.value
  }
  return "edit"
})

const options=computed(async () => {
  if (props.optionsSource == "input") {
    return props.options
  } else {
      let tmp = await getDicts(props.dictType)
      let i=0;
      let options1=[];
      for(i=0;i<tmp.length;i++){
         options1.push({label:tmp[i].dictLabel,value:tmp[i].dictValue})
      }
      return options1;
  }
})
</script>

<style scoped>

</style>
