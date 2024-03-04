<template>
  <el-form ref="interfaceRef" :model="form"  label-width="80px">
    <el-form-item label="选择页面" prop="pageCode">
      <el-tree-select
          v-model="pageCode"
          :data="treePage"
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
    <PageParameter
        ref="PageParameterRef" :pageCode="pageCode" :parameterList="parameterList" @ok="changeParameters" @cancel="cancelChange" />
  </el-dialog>

</template>

<script setup lang="ts">
import {getCurrentInstance, reactive, ref, toRefs} from "vue";
import { tree } from "@/api/business/page";
import { parameterTreeSelect } from "@/api/business/parameter";
import PageParameter from "./PageParameter.vue";
interface Props {
  pageCode: string,
  parameterList: object
}
interface Emits {
  (e: 'change',pageCode:string,parameterList: object): void
}
const open =ref(false)
const emits = defineEmits<Emits>()
const { proxy } = getCurrentInstance();

const props = defineProps<Props>()
const loading = ref(false)
const parameterList = props.parameterList;
const pageCode = ref(props.pageCode);
const data = reactive({
  form: {},
  queryParams:{
    pageCode:'',
    pageSize:1000,
    pageNum:1
  }
});
const treePage=ref([])
const { form,queryParams } = toRefs(data);
async function handleSelectChange(value) {
  // 查询接口参数树列表
  try {
    loading.value = true;
    debugger;
    console.log('props.pageCode:' + props.pageCode)
    queryParams.value.pageCode = props.pageCode;
    let response = await parameterTreeSelect(queryParams.value)
    parameterList.value = response.rows;
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
  let tmp={};
  tree(tmp).then(response => {
    treePage.value = response.data;
  });
}


/**
 * 改变参数列表
 */
function changeParameters(value){
  parameterList.value = value;
  emits("change",pageCode.value,parameterList.value);
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
