<template>
   <div class="app-container">
      <el-row :gutter="20">
         <!--功能数据-->
         <el-col :span="4" :xs="24">
            <div class="head-container">
               <el-input
                  v-model="businessFunctionName"
                  placeholder="请输入业务功能名称"
                  clearable
                  prefix-icon="Search"
                  style="margin-bottom: 20px"
               />
            </div>
            <div class="head-container">
               <el-tree
                  :data="businessFunctionOptions"
                  :props="{ label: 'businessName', children: 'children' }"
                  :expand-on-click-node="false"
                  :filter-node-method="filterNode"
                  ref="businessFunctionTreeRef"
                  node-key="id"
                  highlight-current
                  default-expand-all
                  @node-click="handleNodeClick"
               />
            </div>
         </el-col>
         <!--接口数据-->
         <el-col :span="20" :xs="24">
           <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
             <el-form-item label="接口名称" prop="interfaceName">
               <el-input
                   v-model="queryParams.interfaceName"
                   placeholder="请输入接口名称"
                   clearable
                   @keyup.enter="handleQuery"
               />
             </el-form-item>
             <el-form-item label="接口编码" prop="interfaceCode">
               <el-input
                   v-model="queryParams.interfaceCode"
                   placeholder="请输入接口编码"
                   clearable
                   @keyup.enter="handleQuery"
               />
             </el-form-item>
             <el-form-item label="接口URL" prop="interfaceUrl">
               <el-input
                   v-model="queryParams.interfaceUrl"
                   placeholder="请输入接口URL"
                   clearable
                   @keyup.enter="handleQuery"
               />
             </el-form-item>
             <el-form-item label="接口METHOD" prop="interfaceMethod">
               <el-input
                   v-model="queryParams.interfaceMethod"
                   placeholder="请输入接口METHOD"
                   clearable
                   @keyup.enter="handleQuery"
               />
             </el-form-item>
             <el-form-item label="接口数据源名称" prop="interfaceDatasourceName">
               <el-input
                   v-model="queryParams.interfaceDatasourceName"
                   placeholder="请输入接口数据源名称"
                   clearable
                   @keyup.enter="handleQuery"
               />
             </el-form-item>
             <el-form-item label="是否选数据源" prop="isSelectDatasource">
               <el-input
                   v-model="queryParams.isSelectDatasource"
                   placeholder="请输入是否选数据源"
                   clearable
                   @keyup.enter="handleQuery"
               />
             </el-form-item>
             <el-form-item label="是否通用URL" prop="isCommonUrl">
               <el-input
                   v-model="queryParams.isCommonUrl"
                   placeholder="请输入是否通用URL"
                   clearable
                   @keyup.enter="handleQuery"
               />
             </el-form-item>
             <el-form-item>
               <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
               <el-button icon="Refresh" @click="resetQuery">重置</el-button>
             </el-form-item>
           </el-form>

           <el-row :gutter="10" class="mb8">
             <el-col :span="1.5">
               <el-button
                   type="primary"
                   plain
                   icon="Plus"
                   @click="handleAdd"
                   v-hasPermi="['business:interface:add']"
               >新增</el-button>
             </el-col>
             <el-col :span="1.5">
               <el-button
                   type="success"
                   plain
                   icon="Edit"
                   :disabled="single"
                   @click="handleUpdate"
                   v-hasPermi="['business:interface:edit']"
               >修改</el-button>
             </el-col>
             <el-col :span="1.5">
               <el-button
                   type="danger"
                   plain
                   icon="Delete"
                   :disabled="multiple"
                   @click="handleDelete"
                   v-hasPermi="['business:interface:remove']"
               >删除</el-button>
             </el-col>
             <el-col :span="1.5">
               <el-button
                   type="warning"
                   plain
                   icon="Download"
                   @click="handleExport"
                   v-hasPermi="['business:interface:export']"
               >导出</el-button>
               <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
             </el-col>
            </el-row>

           <el-table v-loading="loading" :data="interfaceList" @selection-change="handleSelectionChange">
             <el-table-column type="selection" width="55" align="center" />
              <el-table-column label="接口名称" align="center" prop="interfaceName" />
             <el-table-column label="接口编码" align="center" prop="interfaceCode" />
             <el-table-column label="接口URL" align="center" prop="interfaceUrl" />
             <el-table-column label="接口METHOD" align="center" prop="interfaceMethod" />
             <el-table-column label="接口类型" align="center" prop="interfaceType" />
             <el-table-column label="接口数据源名称" align="center" prop="interfaceDatasourceName" />
             <el-table-column label="是否选数据源" align="center" prop="isSelectDatasource" />
             <el-table-column label="是否通用URL" align="center" prop="isCommonUrl" />
             <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
               <template #default="scope">
                 <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['business:interface:edit']">修改</el-button>
                 <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['business:interface:remove']">删除</el-button>
                 <el-button link type="primary" :icon="parameterSetIcon" @click="handleParameterMaintenance(scope.row)" v-hasPermi="['business:interface:parametermaintenance']">接口参数维护</el-button>
                 <el-button link type="primary" :icon="returnValSetIcon" @click="handleReturnMaintenance(scope.row)" v-hasPermi="['business:interface:returnmaintenance']">接口返回值维护</el-button>
               </template>
             </el-table-column>
           </el-table>

           <pagination
               v-show="total>0"
               :total="total"
               v-model:page="queryParams.pageNum"
               v-model:limit="queryParams.pageSize"
               @pagination="getList"
           />
         </el-col>
      </el-row>
     <!-- 添加或修改接口对话框 -->
     <el-dialog :title="title" v-model="open" width="500px" append-to-body>
       <el-form ref="interfaceRef" :model="form" :rules="rules" label-width="80px">
         <el-form-item label="接口名称" prop="interfaceName">
           <el-input v-model="form.interfaceName" placeholder="请输入接口名称" />
         </el-form-item>
         <el-form-item label="接口编码" prop="interfaceCode">
           <el-input v-model="form.interfaceCode" placeholder="请输入接口编码" />
         </el-form-item>
         <el-form-item label="接口URL" prop="interfaceUrl">
           <el-input v-model="form.interfaceUrl" placeholder="请输入接口URL" />
         </el-form-item>
         <el-form-item label="接口METHOD" prop="interfaceMethod">
           <el-input v-model="form.interfaceMethod" placeholder="请输入接口METHOD" />
         </el-form-item>
         <el-form-item label="接口数据源名称" prop="interfaceDatasourceName">
           <el-input v-model="form.interfaceDatasourceName" placeholder="请输入接口数据源名称" />
         </el-form-item>
         <el-form-item label="是否选数据源" prop="isSelectDatasource">
           <el-input v-model="form.isSelectDatasource" placeholder="请输入是否选数据源" />
         </el-form-item>
         <el-form-item label="是否通用URL" prop="isCommonUrl">
           <el-input v-model="form.isCommonUrl" placeholder="请输入是否通用URL" />
         </el-form-item>
       </el-form>
       <template #footer>
         <div class="dialog-footer">
           <el-button type="primary" @click="submitForm">确 定</el-button>
           <el-button @click="cancel">取 消</el-button>
         </div>
       </template>
     </el-dialog>
     <!-- 参数维护--->
     <el-dialog title="参数维护" v-model="parameterOpen" :fullscreen="true"  @close="parameterOpen=false" append-to-body>
       <ParameterMaintenance :interfaceId="interfaceId" />
     </el-dialog>
     <!-- 返回值维护-->
     <el-dialog title="返回值维护" v-model="returnValOpen" :fullscreen="true" @close="returnValOpen=false" append-to-body>
       <ReturnValueMaintenance :intefaceCode="intefaceCode" />
     </el-dialog>
   </div>
</template>

<script setup name="ModelEntity" lang="ts">

import { listDef, getDef, delDef, addDef, updateDef } from "@/api/business/def";
import { functionTreeSelect,isLastLevel } from "@/api/business/function";
import {useRouter} from "vue-router";
import {getCurrentInstance, provide, reactive, ref, toRefs} from "vue";
import {modelingEntityKey} from "../../modeling/keys";
import { listData } from "@/api/system/dict/data";
import {listAllDatasource} from "@/api/business/datasource"
import { useIcon } from "@/components/common/util";
import ParameterMaintenance from "@/views/business/parameter/index.vue"
import ReturnValueMaintenance from  "@/views/business/value/index.vue"
const router = useRouter();
const { proxy } = getCurrentInstance();
const { active_state } = proxy.useDict("active_state");
console.log('active_state value:'+JSON.stringify(active_state.value))
const defList = ref([]);
const updatePanelVisible = ref(false);
const loading = ref(false);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const open = ref(false);

const businessFunctionName = ref("");
const businessFunctionOptions = ref(undefined);
const tableTypeList = ref([])
const srcRow = ref({})
const parameterSetIcon = useIcon('ali_parameter')
const returnValSetIcon = useIcon('ali_returnval')
const intefaceCode=ref(0)
const parameterOpen = ref(false)
const returnValOpen =ref(false)

provide(modelingEntityKey, srcRow)
// 列显隐信息
const columns = ref([
  { key: 0, label: `模型表编号`, visible: true },
  { key: 1, label: `模型表名称`, visible: true },
  { key: 2, label: `模型表昵称`, visible: true },
  { key: 3, label: `部门`, visible: true },
  { key: 4, label: `手机号码`, visible: true },
  { key: 5, label: `状态`, visible: true },
  { key: 6, label: `创建时间`, visible: true }
])
const dataSourceList = ref([])

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    interfaceName: null,
    interfaceCode: null,
    interfaceUrl: null,
    interfaceMethod: null,
    interfaceType: null,
    interfaceDatasourceName: null,
    isSelectDatasource: null,
    isCommonUrl: null,
    businessCode:null
  },
  queryDictParams: {
    pageNum: 1,
    pageSize: 10,
    dictType: 'table_type',
    dictLabel: undefined,
    status: undefined
  },
  rules: {
    interfaceName: [
      { required: true, message: "接口名称不能为空", trigger: "blur" }
    ],
    interfaceCode: [
      { required: true, trigger: "blur",
        message: '接口编码不能为空' }
    ],
    interfaceUrl: [
      { required: true, message: "接口url不能为空", trigger: "blur" }
    ],
    interfaceMethod: [
      { required: true, message: "接口方法不能为空", trigger: "blur" }
    ],
    interfaceType: [
      { required: true, message: "接口类型不能为空", trigger: "blur" }
    ],
  }
})

const { queryParams, form, rules,queryDictParams } = toRefs(data)

/** 通过条件过滤节点  */
const filterNode = (value, data) => {
  if (!value) return true;
  return data.label.indexOf(value) !== -1;
}


/** 查询功能下拉树结构 */
function getFunctionTree() {
  functionTreeSelect(queryParams).then(response => {
    businessFunctionOptions.value = response.data;
  });
}
/** 查询模型表列表 */
function getList() {
  loading.value = true;
  listDef(queryParams.value).then(response => {
    defList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}
/** 节点单击事件 */
function handleNodeClick(data) {
  queryParams.value.businessCode = data.businessCode;
  form.value.businessCode = data.businessCode;
  handleQuery();
}
/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}
/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  queryParams.value.businessCode = undefined;
  proxy.$refs.businessFunctionTreeRef.setCurrentKey(null);
  handleQuery();
}
/** 删除按钮操作 */
function handleDelete(row) {
  const _ids = row.id || ids.value;
  if(_ids) {
    proxy.$modal.confirm('是否确认删除模型定义编号为"' + _ids + '"的数据项？').then(function () {
      return delDef(_ids);
    }).then(() => {
      getList();
      proxy.$modal.msgSuccess("删除成功");
    }).catch(() => {
    });
  }else{
    proxy.$modal.alertWarning("请选择行！")
  }
}
/** 导出按钮操作 */
function handleExport() {
  proxy.download('business/def/export', {
    ...queryParams.value
  }, `def_${new Date().getTime()}.xlsx`)
}


/** 选择条数  */
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 返回值维护 **/
function handleReturnMaintenance(row) {
  if(row.id){
    intefaceCode.value = row.id
    returnValOpen.value = true
  }
}
/**参数维护 **/
function handleParameterMaintenance(row) {
  if(row.id){
    intefaceCode.value = row.id
    parameterOpen.value = true
  }
}
/** 重置操作表单 */
function reset() {
  form.value = {
    id: null,
    interfaceName: null,
    interfaceCode: null,
    interfaceUrl: null,
    interfaceMethod: null,
    interfaceType: null,
    interfaceDatasourceName: null,
    isSelectDatasource: null,
    isCommonUrl: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    businessCode:null
  };
  proxy.resetForm("interfaceRef");
}
/** 取消按钮 */
function cancel() {
  open.value = false;
  reset();
}
/** 新增按钮操作 */
async function handleAdd() {
  //判断是否选择功能节点
  if (!form.value.businessCode) {
    proxy.$modal.alertWarning("请选择功能树节点！")
    return;
  } else {
    //判断是否为末级节点
    let parameter = {
      businessCode: form.value.businessCode
    }
    let resp = await isLastLevel(parameter);
    if(resp.code==200){
       if(resp.data==false){
         proxy.$modal.alertWarning("请选择末级功能树节点！")
         return;
       }
    }
  }
  open.value = true;
}
/** 修改按钮操作 */
function handleUpdate(row) {
  srcRow.value = row;
  console.log('srcRow:'+JSON.stringify(srcRow.value))
  updatePanelVisible.value = true;

}
function handleCloseUpdatePanel() {
  updatePanelVisible.value = false
  console.log('handleCloseUpdatePanel enter')
  getList();
}
/** 提交按钮 */
function submitForm() {
  proxy.$refs["defRef"].validate(valid => {
    if (valid) {
      if (form.value.id != undefined) {
        updateDef(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          updatePanelVisible.value = false;
          getList();
        });
      } else {
        addDef(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
};
/** 查询TableType字典数据列表 */
function getTableTypeList() {

  listData(queryDictParams.value).then(response => {
    tableTypeList.value = response.rows;
  });
}
/**
 * 翻译表类型编码
 * @param row
 * @param column
 * @returns {*|string}
 */
function  formatTableType(row, column){
  return tableTypeList.value.find(k => k.dictValue === row.tableType)?.dictLabel ?? '';
}

/**
 * 翻译激活状态
 * @param row
 * @param column
 */
function formatActiveState(row,column){
  return active_state.value.find(k=>k.value == row.status)?.label??'';
}
/**
 * 获取所有数据源列表
 */
async function getAllDataSourceList() {
  let temp = await listAllDatasource();
  dataSourceList.value = temp.data
}
loading.value = true;
getFunctionTree();
//getList();
getTableTypeList();
getAllDataSourceList()
loading.value = false;
</script>
