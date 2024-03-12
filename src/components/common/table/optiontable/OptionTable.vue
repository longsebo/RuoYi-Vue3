<template>
  <el-row :gutter="10" class="mb8">
    <el-col :span="1.5">
      <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
      >新增</el-button>
    </el-col>
    <el-col :span="1.5">
      <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
      >删除</el-button>
    </el-col>
    <el-col :span="1.5">
      <el-button
          type="primary"
          plain
          icon="SuccessFilled"
          @click="handleConfirm"
      >确定</el-button>
    </el-col>
  </el-row>
  <el-table    :data="list"  @selection-change="handleSelectionChange">
    <el-table-column type="selection" width="55" align="center" />
    <el-table-column label="标签" align="center" prop="label" >
      <template #default="scope" >
        <el-input v-model="scope.row.label" placeholder="请输入标签"   @change="checkLabel(scope.$index,scope.row)"/>
      </template>
    </el-table-column>
    <el-table-column label="值" align="center" prop="value" >
      <template #default="scope" >
        <el-input v-model="scope.row.value" placeholder="请输入值" @change="checkValue(scope.$index,scope.row)" />
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts" setup>
import {ref, watch} from "vue";
import {getCurrentInstance} from 'vue';
import { genId } from "@/components/form/designer/util/common";
const {proxy} = getCurrentInstance();
const list = ref([])
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
interface Props {
  options:any
}

const props = withDefaults(defineProps<Props>())
watch(()=>props.options,(newVal)=>{
  list.value = props.options;
  list.value.forEach((item,index)=>{
    item.id = genId();
  })
},{immediate:true})
interface Emits {
  (e: 'changeOptions', val: object): void
}
const emits = defineEmits<Emits>()

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}


/**
 * 检查标签是否重复
 * @param row
 */
function checkLabel(index1,row){
  //检查标签是否重复
  let flag = false;
  list.value.forEach((item,index)=>{
    if(index!=index1 && item.label === row.label){
      flag = true;
    }
  })
  if(flag){
    proxy.$message.error('标签已存在，请重新输入');
    row.label = '';
  }
}
/**
 * 检查值是否重复
 * @param row
 */
function checkValue(index1,row){
  //检查值是否重复
  let flag = false;
  list.value.forEach((item,index)=>{
    if(index!=index1 && item.value === row.value){
      flag = true;
    }
  })
  if(flag){
    proxy.$message.error('值已存在，请重新输入');
    row.value = '';
  }
}
//新增
function handleAdd(){
  list.value.push({label:'',value:'',id:genId()})
}
//删除
function handleDelete(){
  ids.value.forEach((id)=>{
    //删除List中id相等的
    list.value = list.value.filter(item1=>item1.id!==id);
  })
}
//确认
function handleConfirm() {
  //检查List的lable，value是否为空
  let flag = false;
  list.value.forEach((item)=>{
    if(item.label==='' || item.value===''){
      flag = true;
    }
  })
  if(flag){
    proxy.$message.error('标签和值不能为空');
    return;
  }
  //更新父组件值
  proxy.$emit('changeOptions', list.value);

}
</script>

<style scoped>

</style>
