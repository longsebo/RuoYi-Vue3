<template>
  <template v-if="cMode === 'design'">
    <div>
    <el-select v-if="props.multiple===false" v-model="singleValue" disabled="true" v-bind="props">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
    <el-select v-if="props.multiple===true" v-model="multipleValue" disabled="true" v-bind="props">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
    </div>
  </template>
  <template v-else-if="cMode === 'edit'">
    <div>
    <el-select v-if="props.multiple===false" v-model="singleValue" v-bind="props" @change="handleChange" >
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
    <el-select v-if="props.multiple===true" v-model="multipleValue" v-bind="props" @change="handleChange" >
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
    </div>
  </template>
  <template v-else-if="cMode === 'read' ">
    <span v-if="props.multiple===false" v-text="singleValue"></span>
    <span v-if="props.multiple===true" v-text="multipleValue"></span>
  </template>
  <template v-else-if="cMode === 'hidden' ">
    <span v-show="false" ></span>
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
  collapseTags?:boolean
  collapseTagsTooltip?:boolean
  maxCollapseTags?:number
}

interface Emits {
  (e: 'update:value', v: string): void
}

const props = defineProps<Props>()

const emits = defineEmits<Emits>()
const multipleValue = ref([])
const singleValue = ref('')
//console.log('$attrs:'+JSON.stringify(attrs))


// const val = ref(object)
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

function setInitValue(){
  if(props.multiple) {
    if (Array.isArray(props.value)) {
      multipleValue.value = props.value
    }else {
      //console.log('props.value:'+props.value+",is not array!"+props.value?.split(',') )
      let temp =[]
      if(props.value) {
        let temp1 = props.value?.split(',') ;
        for(let i=0;i<temp1.length;i++){
          temp.push(temp1[i])
        }
      }
      if (Array.isArray(temp)){
        console.log('temp is array')
      }else{
        console.log('temp is not array:'+temp.toString())
      }
      multipleValue.value = temp
    }
  }else{
    singleValue.value = props.value
  }
}

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
  setInitValue()
},{deep:true,immediate:true})
function handleChange(newValue){
  console.log('newValue',newValue)
  if(props.multiple) {
    emits('update:value', newValue.toString())
  }else{
    emits('update:value', newValue)
  }
}
</script>

<style scoped>

</style>
