<template>
   <div>
      <el-select v-if="!config.multiple" v-model="singleValue" v-bind="config" @change="handleChange" >
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-select v-if="config.multiple" v-model="multipleValue" v-bind="config" @change="handleChange" >
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </div>
</template>

<script lang="ts" setup>
import {ref, watch} from "vue";


interface Props {
  params?:object;
}
const props = defineProps<Props>()
const config=ref({
  val:'',
  multiple: false,
  collapseTags: false,
  collapseTagsTooltip: false,
  maxCollapseTags: 1
})
interface Emits {
  (e: 'update:value', v: string): void
}


const emits = defineEmits<Emits>()
const multipleValue = ref([])
const singleValue = ref('')

function setInitValue(){
  if(config.value.multiple) {
    if (Array.isArray(config.value.val)) {
      multipleValue.value = props.params.data[props.params.field]
    }else {
      //console.log('config.value.val:'+config.value.val+",is not array!"+config.value.val?.split(',') )
      let temp =[]
      if(props.params.data[props.params.field]) {
        let temp1 = props.params.data[props.params.field]?.split(',') ;
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
    singleValue.value = props.params.data[props.params.field]
  }
}

const options=ref([])
watch(props,async () => {
  //获取选项列表
  options.value = props.params.options
  //config.value.val = props.params.data[props.params.field]
  if(props.params.hasOwnProperty('multiple')) {
    config.value.multiple = props.params.multiple
  }
  if(props.params.hasOwnProperty('collapseTags')){
    config.value.collapseTags = props.params.collapseTags
  }
  if(props.params.hasOwnProperty('collapseTagsTooltip')){
    config.value.collapseTagsTooltip = props.params.collapseTagsTooltip
  }
  if(props.params.hasOwnProperty('maxCollapseTags')){
    config.value.maxCollapseTags = props.params.maxCollapseTags
  }
  //console.log('config',JSON.stringify(config.value))
  //获取模型值
  setInitValue()
},{deep:true,immediate:true})
function handleChange(newValue){

  if(props.params.multiple) {
    //emits('update:value', newValue.toString())
    console.log('update field:'+props.params.field+',value:'+newValue.toString())
    props.params.data[props.params.field]= newValue.toString()
  }else{
    //emits('update:value', newValue)
    console.log('update field:'+props.params.field+',value:'+newValue)
    props.params.data[props.params.field] = newValue
  }
  console.log('data:'+JSON.stringify(props.params.data))
}
</script>

<style scoped>

</style>
