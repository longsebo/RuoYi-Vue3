<template>
  <div>
    <el-table v-if="!props.multiple"
        :data="componentTreeData"
        style="width: 100%; margin-bottom: 20px"
        row-key="id"
        border
        highlight-current-row
        default-expand-all
        @current-change  ="handleRowClick"
      >
      <el-table-column prop="label" label="字段名称(组件名称)"  />
      <el-table-column prop="component" label="组件类型"  :formatter="formatComponentType" />
    </el-table>
    <el-table v-if="props.multiple"
              :data="componentTreeData"
              style="width: 100%; margin-bottom: 20px"
              row-key="id"
              border
              default-expand-all
              @selection-change  ="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column prop="label" label="字段名称(组件名称)"  />
      <el-table-column prop="component" label="组件类型"  :formatter="formatComponentType" />
    </el-table>
    <el-button type="primary" @click="handleConfirm">确定</el-button>
    <el-button type="success" @click="handleCancel">取消</el-button>
  </div>
</template>

<script lang="ts" setup>
import {watch, ref, inject} from "vue";
import { vFormSchemeKey } from '@/components/form/state.key';
import {InputComponents,ButtonComponents} from "../../../form/designer/data";

const formScheme = inject(vFormSchemeKey)!

interface Emits {
  (e: 'change',selectVariable:string): void
  (e: 'cancel'): void
}

interface Props {
  multiple?:boolean
}

const props = defineProps<Props>()

const emits = defineEmits<Emits>()
const ids=ref([])
const componentTreeData=ref([]);
const selectedId=ref('');
watch(() => formScheme, (val) => {
  console.log('bindcomponetnselect formScheme change');
  componentTreeData.value=buildTree(formScheme.value,'');
},{immediate: true,deep:true})

/**
 * 构造表格树结构,暂时只实现一层下级
 * @param schema
 * @param parentName
 */
function buildTree(schema:Object, parentName:string):any[] {
  //搜索所有下级：非布局，展示，按钮,表格组件
  let i=0;
  let returnData=[];
  //遍历所有子节点
  for(i=0;i<schema.children.length;i++){
    if(schema.children[i].category !=='layout' && schema.children[i].category!=='display'
        &&  schema.children[i].category!=='table' &&schema.children[i].category !=='button'){
      returnData.push({
        id: schema.children[i].id,
        label: schema.children[i].formItemAttrs.label,
        component: schema.children[i].component,
        hasChildren: false
      })
    }else if(schema.children[i].category ==='button'){
      returnData.push({
        id: schema.children[i].id,
        label: schema.children[i].attrs.label,
        component: schema.children[i].component,
        hasChildren: false
      })
    }
  }
  return returnData;
}

/**
 * 单击某行
 * @param row
 */
function handleRowClick(row:any){
  selectedId.value = row.id;
  console.log('handleRowClick:'+selectedId.value)
}
// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id);
}
/**
 *  单击确认按钮
 */
function handleConfirm() {
  console.log('handleConfirm:'+ selectedId.value)
  if(!props.multiple) {
    emits('change', selectedId.value)
  }else{
    emits('change', ids.value.toString())
  }
}

/**
 *  单击取消按钮
 */
function handleCancel() {
  emits('cancel')
}
/**
 * 翻译组件类型
 * @param row
 * @param column
 * @returns {*|string}
 */
function formatComponentType(row, column){
  let i=0;
  // console.log('row.component:'+row.component)
  // console.log('InputComponents:'+JSON.stringify(InputComponents))
  for(i=0;i<InputComponents.length;i++){
    if(row.component===InputComponents[i].component){
      return InputComponents[i].title;
    }
  }
  for(i=0;i<ButtonComponents.length;i++){
    if(row.component===ButtonComponents[i].component) {
      return ButtonComponents[i].title;
    }
  }

  return '';
}
</script>

<style scoped>

</style>
