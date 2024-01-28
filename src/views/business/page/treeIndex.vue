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
         <!--页面数据-->
         <el-col :span="20" :xs="24">
           <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
             <el-form-item label="模块" prop="module">
               <el-input
                   v-model="queryParams.module"
                   placeholder="请输入模块"
                   clearable
                   @keyup.enter="handleQuery"
               />
             </el-form-item>
             <el-form-item label="页面编码" prop="pageCode">
               <el-input
                   v-model="queryParams.pageCode"
                   placeholder="请输入页面编码"
                   clearable
                   @keyup.enter="handleQuery"
               />
             </el-form-item>
             <el-form-item label="页面名称" prop="pageName">
               <el-input
                   v-model="queryParams.pageName"
                   placeholder="请输入页面名称"
                   clearable
                   @keyup.enter="handleQuery"
               />
             </el-form-item>
             <el-form-item label="页面类型编码" prop="pageTypeCode">
               <el-input
                   v-model="queryParams.pageTypeCode"
                   placeholder="请输入页面类型编码"
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
                   v-hasPermi="['business:page:add']"
               >新增</el-button>
             </el-col>
             <el-col :span="1.5">
               <el-button
                   type="success"
                   plain
                   icon="Edit"
                   :disabled="single"
                   @click="handleUpdate"
                   v-hasPermi="['business:page:edit']"
               >修改</el-button>
             </el-col>
             <el-col :span="1.5">
               <el-button
                   type="danger"
                   plain
                   icon="Delete"
                   :disabled="multiple"
                   @click="handleDelete"
                   v-hasPermi="['business:page:remove']"
               >删除</el-button>
             </el-col>
             <el-col :span="1.5">
               <el-button
                   type="warning"
                   plain
                   icon="Download"
                   @click="handleExport"
                   v-hasPermi="['business:page:export']"
               >导出</el-button>
             </el-col>
             <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
           </el-row>

           <el-table v-loading="loading" :data="pageList" @selection-change="handleSelectionChange">
             <el-table-column type="selection" width="55" align="center" />
             <el-table-column label="模块" align="center" prop="module" />
             <el-table-column label="页面编码" align="center" prop="pageCode" />
             <el-table-column label="页面名称" align="center" prop="pageName" />
             <el-table-column label="页面类型编码" align="center" prop="pageTypeCode" />
             <el-table-column label="页面参数" align="center" prop="pageParameter" />
             <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
               <template #default="scope">
                 <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['business:page:edit']">修改</el-button>
                 <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['business:page:remove']">删除</el-button>
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
     <!-- 添加或修改页面定义对话框 -->
     <el-dialog :title="title" v-model="open" width="500px" append-to-body>
       <el-form ref="pageRef" :model="form" :rules="rules" label-width="80px">
         <el-form-item label="模块" prop="module">
           <el-input v-model="form.module" placeholder="请输入模块" />
         </el-form-item>
         <el-form-item label="页面编码" prop="pageCode">
           <el-input v-model="form.pageCode" placeholder="请输入页面编码" />
         </el-form-item>
         <el-form-item label="页面名称" prop="pageName">
           <el-input v-model="form.pageName" placeholder="请输入页面名称" />
         </el-form-item>
         <el-form-item label="页面类型编码" prop="pageTypeCode">
           <el-input v-model="form.pageTypeCode" placeholder="请输入页面类型编码" />
         </el-form-item>
       </el-form>
       <template #footer>
         <div class="dialog-footer">
           <el-button type="primary" @click="submitForm">确 定</el-button>
           <el-button @click="cancel">取 消</el-button>
         </div>
       </template>
     </el-dialog>

     <!-- 页面设计维护--->
     <el-dialog title="参数维护" v-model="parameterOpen" :fullscreen="true"  @close="parameterOpen=false" append-to-body>

     </el-dialog>
     <!-- 引用接口维护-->
     <el-dialog title="返回值维护" v-model="returnValOpen" :fullscreen="true" @close="returnValOpen=false" append-to-body>

     </el-dialog>
     <!-- 页面参数维护--->
     <el-dialog title="参数维护" v-model="parameterOpen" :fullscreen="true"  @close="parameterOpen=false" append-to-body>

     </el-dialog>
   </div>
</template>

<script setup lang="ts">


import { listInterface, getInterface, delInterface, addInterface, updateInterface } from "@/api/business/interface";
import { functionTreeSelect,isLastLevel } from "@/api/business/function";
import {useRouter} from "vue-router";
import {getCurrentInstance, provide, reactive, ref, toRefs} from "vue";
import {modelingEntityKey} from "../../modeling/keys";
import {listAllDatasource} from "@/api/business/datasource"
import { useIcon } from "@/components/common/util";
import ParameterMaintenance from "@/views/business/parameter/index.vue"
import ReturnValueMaintenance from  "@/views/business/value/index.vue"
import {listAllUrl} from "@/api/business/url"

const router = useRouter();
const { proxy } = getCurrentInstance();
const { system_module_type,page_type } = proxy.useDict("system_module_type","page_type");
//console.log('interface_method value:'+JSON.stringify(interface_method.value))
const interfaceList = ref([]);

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


//const returnValSetIcon = useIcon('ali_returnval')
const interfaceCode=ref('')
const parameterOpen = ref(false)
const returnValOpen =ref(false)
const commonUrlList = ref([])




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
  listInterface(queryParams.value).then(response => {
    interfaceList.value = response.rows;
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
      return delInterface(_ids);
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
    interfaceCode.value = row.interfaceCode
    returnValOpen.value = true
  }
}
/**参数维护 **/
function handleParameterMaintenance(row) {
  if(row.id){
    interfaceCode.value = row.interfaceCode
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
    updateTime: null
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
  let businessCode = form.value.businessCode
  reset();
  form.value.businessCode = businessCode
  open.value = true;
}
/** 修改按钮操作 */
function handleUpdate(row) {
  form.value = row;

  open.value = true;

}
function handleCloseUpdatePanel() {
  open.value = false
  console.log('handleCloseUpdatePanel enter')
  getList();
}
/** 提交按钮 */
function submitForm() {

 // 根据界面url判断是否为数据源选择
 form.value.isSelectDatasource = form.value.isCommonUrl;
   // 表单验证
   proxy.$refs["interfaceRef"].validate(valid => {
     // 如果验证成功
     if (valid) {
       // 如果界面url存在id，则更新接口信息
       if (form.value.id != undefined) {
         // 调用更新接口的函数
         updateInterface(form.value).then(response => {
           // 提示修改成功
           proxy.$modal.msgSuccess("修改成功");
           // 关闭窗口
           open.value = false;
           // 获取列表
           getList();
         });
       } else {
         // 如果界面url不存在id，则添加接口信息
         addInterface(form.value).then(response => {
           // 提示新增成功
           proxy.$modal.msgSuccess("新增成功");
           // 关闭窗口
           open.value = false;
           // 获取列表
           getList();
         });
       }
     }
   });

};




loading.value = true;
getFunctionTree();
loading.value = false;
</script>
