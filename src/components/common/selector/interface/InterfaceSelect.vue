<template>
  <el-form ref="interfaceRef" :model="form"  label-width="80px">
    <el-form-item label="选择接口" prop="interfaceCode">
      <el-tree-select
          v-model="interfaceCode"
          :data="treeInterface"
          :render-after-expand="false"
          style="width: 240px"
          @change="handleSelectChange"
      />
    </el-form-item>
    <el-form-item label="" >
      <el-button type="primary" @click="open=true">参数设置</el-button>
    </el-form-item>
  </el-form>
  <!-- 添加或修改业务功能对话框 -->
  <el-dialog title="参数设置" v-model="open" width="70%" height="95vh" append-to-body>
    <InterfaceParameter
        ref="interfaceParameterRef"  :parameterList="parameterList" @ok="changeParameters" @cancel="cancelChange" />
  </el-dialog>

</template>

<script setup lang="ts">
import {getCurrentInstance, reactive, ref, toRefs, watch} from "vue";
import { tree } from "@/api/business/interface";
import { parameterTreeSelect } from "@/api/business/parameter";
import InterfaceParameter from "./InterfaceParameter.vue";
interface Props {
  interfaceCode: string,
  interfaceType: string,
  parameterList: object
}
interface Emits {
  (e: 'change',interfaceCode:string,parameterList: object): void
}
const open = ref(false)
const emits = defineEmits<Emits>()
const { proxy } = getCurrentInstance();

const props = defineProps<Props>()
const loading = ref(false)
const parameterList = ref([]);
const interfaceCode = ref(props.interfaceCode);
const data = reactive({
  form: {},
  queryParams:{
      interfaceCode:'',
      pageSize:1000,
      pageNum:1
  }
});
const treeInterface=ref([])
const { form,queryParams } = toRefs(data);
watch(() => [props.parameterList], () => {
  //console.log('InterfaceSelect.vue watch props parameterList:'+ JSON.stringify(props.parameterList))
  if(props.parameterList.value) {
    parameterList.value = props.parameterList.value;
  }else{
    parameterList.value = props.parameterList;
  }
  console.log('InterfaceSelect.vue watch parameterList.value:'+ JSON.stringify(parameterList.value))
}, { immediate: true })

// watch(() => [props.interfaceCode], () =>{
//     handleSelectChange(props.interfaceCode.value)
// })
async function handleSelectChange(value) {
  // 查询接口参数树列表
  try {
    loading.value = true;
    console.log('props.interfaceCode:' + value)
    queryParams.value.interfaceCode = value;
    let response = await parameterTreeSelect(queryParams.value)
    parameterList.value = response.rows;
    console.log('InterfaceSelect.vue parameterList.value:'+ JSON.stringify(parameterList.value))
    emits("change",value,parameterList.value);
    //total.value = response.total;
    loading.value = false;
  } catch (err) {
    console.log(err)
  } finally {
    loading.value = false;
  }
}

/** 获取接口树列表 */
function getTreeInterface(){
  debugger;
  let tmp={};
  if(props.interfaceType){
    tmp={"interfaceType":props.interfaceType}
  }
  tree(tmp).then(response => {
    treeInterface.value = response.data;
  });
}

/**
 * 改变参数列表
 */
function changeParameters(value){
  parameterList.value = value;
  emits("change",interfaceCode.value,parameterList.value);
  open.value = false;
}

/**
 * 取消改变参数列表
 */
function cancelChange(){
  open.value = false;
}
getTreeInterface();
</script>
