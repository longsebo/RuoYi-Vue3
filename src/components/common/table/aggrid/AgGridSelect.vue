<template>
  <template >
    <div>
      <el-select v-if="props.multiple===false" v-model="singleValue" v-bind="props" @change="handleChange" >
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-select v-if="props.multiple===true" v-model="multipleValue" v-bind="props" @change="handleChange" >
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </div>
  </template>
</template>

<script lang="ts" setup>
import {ref, watch} from "vue";


interface Props {
  params?:object;
  value?:string;
  multiple?:boolean;
  options?:[];
  collapseTags?:boolean;
  collapseTagsTooltip?:boolean;
  maxCollapseTags?:number;
}

interface Emits {
  (e: 'update:value', v: string): void
}


const emits = defineEmits<Emits>()
const multipleValue = ref([])
const singleValue = ref('')

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
  options.value = props.options
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
