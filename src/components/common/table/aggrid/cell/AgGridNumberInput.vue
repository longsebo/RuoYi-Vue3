<template>
  <el-input-number v-model="val" :controls="false" style="width: 100%" @change="updateValue1" />
</template>
<script lang="ts" setup>
import { ElInputNumber } from 'element-plus'
import { ICellRendererParams } from 'ag-grid-community'
import {computed, ref, watch} from "vue";

interface Props {
  params: ICellRendererParams
}


const props = defineProps<Props>()
const val =ref(0)
watch(()=>props.params.data,(newVal)=>{
    // console.log('props.params data:'+JSON.stringify(props.params.data))
    if(props.params.data[props.params.field]){
      val.value= props.params.data[props.params.field];
    }else{
      val.value= 1;
    }
},{immediate:true,deep:true})
function updateValue1(newValue){
    props.params.data[props.params.field] = newValue
    // console.log('newValue:'+newValue+","+JSON.stringify(props.params.data))
}
// const value = computed({
//   get: () => {
//     console.log('props.params data:'+JSON.stringify(props.params.data))
//     if(props.params.data[props.params.field]){
//       return props.params.data[props.params.field];
//     }else{
//      return 1;
//     }
//   },
//   set: newValue => {
//     props.params.data[props.params.field] = newValue
//     console.log('newValue:'+newValue+","+JSON.stringify(props.params.data))
//   }
// })

</script>
