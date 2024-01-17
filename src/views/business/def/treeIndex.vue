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
         <!--实体数据-->
         <el-col :span="20" :xs="24">
            <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
              <el-form-item label="中文名" prop="cnName">
                <el-input
                    v-model="queryParams.cnName"
                    placeholder="请输入中文名"
                    clearable
                    @keyup.enter="handleQuery"
                />
              </el-form-item>
              <el-form-item label="英文名" prop="enName">
                <el-input
                    v-model="queryParams.enName"
                    placeholder="请输入英文名"
                    clearable
                    @keyup.enter="handleQuery"
                />
              </el-form-item>
              <el-form-item label="数据源名称" prop="datasourceName">
                <el-input
                    v-model="queryParams.datasourceName"
                    placeholder="请输入数据源名称"
                    clearable
                    @keyup.enter="handleQuery"
                />
              </el-form-item>
              <el-form-item label="表类型" prop="tableType">
                <el-select
                    v-model="form.tableType"
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
                     v-hasPermi="['business:def:add']"
                  >新增</el-button>
               </el-col>
               <el-col :span="1.5">
                  <el-button
                     type="success"
                     plain
                     icon="Edit"
                     :disabled="single"
                     @click="handleUpdate"
                     v-hasPermi="['business:def:edit']"
                  >修改</el-button>
               </el-col>
               <el-col :span="1.5">
                  <el-button
                     type="danger"
                     plain
                     icon="Delete"
                     :disabled="multiple"
                     @click="handleDelete"
                     v-hasPermi="['business:def:remove']"
                  >删除</el-button>
               </el-col>
               <el-col :span="1.5">
                  <el-button
                     type="warning"
                     plain
                     icon="Download"
                     @click="handleExport"
                     v-hasPermi="['business:def:export']"
                  >导出</el-button>
               </el-col>
               <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
            </el-row>

           <el-table v-loading="loading" :data="defList" @selection-change="handleSelectionChange">
             <el-table-column type="selection" width="55" align="center" />
             <el-table-column label="中文名" align="center" prop="cnName" />
             <el-table-column label="英文名" align="center" prop="enName" />
             <el-table-column label="数据源名称" align="center" prop="datasourceName" />
             <el-table-column label="表类型" align="center" prop="tableType" :formatter="formatTableType" />
             <el-table-column label="状态" align="center" prop="status" />
             <el-table-column label="备注" align="center" prop="remark" />
             <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
               <template #default="scope">
                 <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['business:def:edit']">修改</el-button>
                 <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['business:def:remove']">删除</el-button>
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
     <!-- 添加模型实体对话框 -->
      <el-dialog title="新增模型实体" v-model="addPanelVisible" width="500px" append-to-body>
        <el-form ref="defRef" :model="form" :rules="rules" label-width="80px">
          <el-form-item label="中文名" prop="cnName">
            <el-input v-model="form.cnName" placeholder="请输入中文名" />
          </el-form-item>
          <el-form-item label="英文名" prop="enName">
            <el-input v-model="form.enName" placeholder="请输入英文名" />
          </el-form-item>
          <el-form-item label="数据源名称" prop="datasourceName" label-width="auto">
            <el-select
                v-model="form.datasourceName"
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
                v-model="form.tableType"
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
          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark" placeholder="请输入备注" />
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button type="primary" @click="submitForm">确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
          </div>
        </template>
      </el-dialog>
      <!-- 修改模型实体对话框 -->
     <el-dialog title="修改模型实体" v-model="updatePanelVisible" :fullscreen="true" append-to-body>
       <ModelingConfigTabs @close="handleCloseUpdatePanel"  />
     </el-dialog>

   </div>
</template>

<script setup name="ModelEntity" lang="ts">

import { listDef, getDef, delDef, addDef, updateDef } from "@/api/business/def";
import { functionTreeSelect,isLastLevel } from "@/api/business/function";
import {useRouter} from "vue-router";
import {getCurrentInstance, provide, reactive, ref, toRefs} from "vue";
import ModelingConfigTabs from "./ModelingConfigTabs.vue";
import {modelingEntityKey} from "../../modeling/keys";
import { listData } from "@/api/system/dict/data";
import {listAllDatasource} from "@/api/business/datasource"
const router = useRouter();
const { proxy } = getCurrentInstance();


const defList = ref([]);
const updatePanelVisible = ref(false);
const loading = ref(false);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const addPanelVisible = ref(false);

const businessFunctionName = ref("");
const businessFunctionOptions = ref(undefined);
const tableTypeList = ref([])
const srcRow = ref({})
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
    cnName: null,
    enName: null,
    datasourceName: null,
    status: null,
    businessCode:'',
  },
  queryDictParams: {
    pageNum: 1,
    pageSize: 10,
    dictType: 'table_type',
    dictLabel: undefined,
    status: undefined
  },
  rules: {
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


/** 重置操作表单 */
function reset() {
  form.value = {
    id: null,
    cnName: null,
    enName: null,
    datasourceName: null,
    status: null,
    remark: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    businessCode:null
  };
  proxy.resetForm("defRef");
}
/** 取消按钮 */
function cancel() {
  addPanelVisible.value = false;
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
  addPanelVisible.value = true;
}
/** 修改按钮操作 */
function handleUpdate(row) {
  srcRow.value = row;
  console.log('srcRow:'+JSON.stringify(srcRow.value))
  updatePanelVisible.value = true;
}
function handleCloseUpdatePanel() {
  updatePanelVisible.value = false
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
          addPanelVisible.value = false;
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
  return tableTypeList.value.find(k => k.dictValue === row.tableType)?.dictLablel ?? '';
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
