<template>

  <div  style="background-color: var(--el-bg-color); padding: 10px; height: 100%; box-sizing: border-box;">
    <div style="width: 100%; max-width: 800px; height: calc(100% - 32px - 12px)">
      <el-scrollbar always>
        <el-divider content-position="left">基本信息</el-divider>
        <el-form  :model="formData" :rules="rules" label-width="80px" :label-position="formLabelPosition" ref="formRef"  status-icon>
          <el-form-item label="中文名" prop="cnName">
            <el-input v-model="formData.cnName" placeholder="请输入中文名" />
          </el-form-item>
          <el-form-item label="英文名" prop="enName">
            <el-input v-model="formData.enName" placeholder="请输入英文名" />
          </el-form-item>
          <el-form-item label="数据源名称" prop="datasourceName" label-width="auto">
            <el-select
                v-model="formData.datasourceName"
                placeholder="请选择数据源"
                clearable
                style="width: 240px"
            >
              <el-option
                  v-for="item in dataSourceList"
                  :key="item.datasourceName"
                  :label="item.datasourceName"
                  :value="item.datasourceName"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="表类型" prop="tableType">
            <el-select
                v-model="formData.tableType"
                placeholder="请选择表类型"
                clearable
                style="width: 240px"
            >
              <el-option
                  v-for="item in tableTypeList"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="item.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select
                v-model="formData.status"
                placeholder="请选择状态"
                clearable
                style="width: 240px"
            >
              <el-option
                  v-for="item in activeStateList"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="item.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="formData.remark" placeholder="请输入备注" />
          </el-form-item>
          <el-form-item>
            <el-button  @click="handleUpdate" type="primary" plain>保存</el-button>
          </el-form-item>
        </el-form>
      </el-scrollbar>
    </div>

  </div>


</template>
<script lang="ts" setup>
import {
  ElForm,  FormRules, ElScrollbar,
  ElPopconfirm,
} from "element-plus";
import {getCurrentInstance, inject, ref, watch} from "vue";
import {  updateDef } from "@/api/business/def";
import { formLabelPosition } from "@/store/layout";
import {modelingEntityKey} from "../../modeling/keys";
import { listData } from "@/api/system/dict/data";
import {listAllDatasource} from "@/api/business/datasource"

const entity = inject(modelingEntityKey)!


const activeStateList=ref([])
const tableTypeList = ref([])
const dataSourceList = ref([])
const { proxy } = getCurrentInstance();

const formData = ref<ModelingEntityUpdateParam>({
  id: entity.value.id,
  cnName: entity.value.cnName,
  enName: entity.value.enName,
  businessCode:entity.value.businessCode,
  tableType:entity.value.tableType,
  remark: entity.value.remark,
  status: entity.value.status,
  datasourceName:entity.value.datasourceName
})

const queryTableTypeDictParams=ref({
      pageNum: 1,
      pageSize: 10,
      dictType: 'table_type',
      dictLabel: undefined,
      status: undefined
})
const queryActiveStateDictParams= ref({
  pageNum: 1,
  pageSize: 10,
  dictType: 'active_state',
  dictLabel: undefined,
  status: undefined
})

watch(() => entity.value, val => {
  formData.value={
    id: val.id,
    cnName: val.cnName,
    enName: val.enName,
    businessCode:val.businessCode,
    tableType:val.tableType,
    remark: val.remark,
    status: val.status,
    datasourceName:val.datasourceName
  }
});
function handleUpdate() {
  updateDef(formData.value).then(response => {
    proxy.$modal.msgSuccess("修改成功");
    entity.value.tableType = formData.value.tableType
  });
}
/** 查询字典数据列表 */
function getDictList() {

  listData(queryTableTypeDictParams.value).then(response => {
    tableTypeList.value = response.rows;
  });
  listData(queryActiveStateDictParams.value).then(response => {
    activeStateList.value = response.rows;
  });
}
/**
 * 获取所有数据源列表
 */
async function getAllDataSourceList() {
  let temp = await listAllDatasource();
  dataSourceList.value = temp.data
}

/**
 * 修改表类型
 * @param newTableType
 */
// function changeTableType(newTableType){
//   entity.value.tableType = newTableType;
//   console.log('entity value:'+JSON.stringify(entity))
// }

const rules: FormRules = {
  cnName: [
    { required: true, message: "中文名不能为空", trigger: "blur" }
  ],
  enName: [
    { required: true, trigger: "blur",pattern: /^[a-zA-Z_]+\w?$/,
      message: '必须以字母或下划线开头' }
  ],
  datasourceName: [
    { required: true, message: "数据源名称不能为空", trigger: "blur" }
  ],
  tableType: [
    { required: true, message: "表类型不能为空", trigger: "blur" }
  ],
}


const formRef = ref<InstanceType<typeof ElForm>>()
getDictList()
getAllDataSourceList()
</script>
