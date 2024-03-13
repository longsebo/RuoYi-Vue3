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
             <!--<el-form-item label="模块" prop="module">
               <el-select v-model="queryParams.module"   placeholder="请选择模块" >
                 <el-option v-for="item in system_module_type" :key="item.url" :value="item.url" :label="item.name"/>
               </el-select>
             </el-form-item> -->
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
             <!-- <el-table-column label="模块" align="center" prop="module" :formatter="formatSystemModule" /> -->
             <el-table-column label="页面编码" align="center" prop="pageCode" />
             <el-table-column label="页面名称" align="center" prop="pageName" />
             <el-table-column label="页面类型" align="center" prop="pageTypeCode" :formatter="formatPageType" />
             <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
               <template #default="scope">
                 <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['business:page:edit']">修改</el-button>
                 <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['business:page:remove']">删除</el-button>
                 <el-button link type="primary" :icon="pageDesignIcon" @click="handlePageDesign(scope.row)" v-hasPermi="['business:page:design']">页面设计</el-button>
                 <el-button link type="primary" :icon="interfaceIcon" @click="handleInterfaceRela(scope.row)" v-hasPermi="['business:page:interface']">页面接口</el-button>
                 <el-button link type="primary" :icon="parameterIcon" @click="handlePageParameter(scope.row)" v-hasPermi="['business:page:parameter']">页面参数</el-button>
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
         <!--<el-form-item label="模块" prop="module">
           <el-select v-model="form.module"   placeholder="请选择模块" >
             <el-option v-for="item in system_module_type" :key="item.url" :value="item.url" :label="item.name"/>
           </el-select>
         </el-form-item> -->
         <el-form-item label="页面编码" prop="pageCode">
           <el-input v-model="form.pageCode" placeholder="请输入页面编码" />
         </el-form-item>
         <el-form-item label="页面名称" prop="pageName">
           <el-input v-model="form.pageName" placeholder="请输入页面名称" />
         </el-form-item>
         <el-form-item label="页面类型" prop="pageTypeCode">
           <el-select v-model="form.pageTypeCode"   placeholder="请选择页面类型" >
             <el-option v-for="item in page_type" :key="item.value" :value="item.value" :label="item.label"/>
           </el-select>
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
     <el-dialog title="页面设计维护" v-model="pageDesignOpen" :fullscreen="true"  @close="pageDesignOpen=false" append-to-body>
       <FormDesigner name="UPDATE" :pageInfo="pageInfo" />
     </el-dialog>
     <!-- 引用接口维护-->
     <el-dialog title="引用接口维护" v-model="pageInterfaceOpen" width="80%" height="95vh" @close="pageInterfaceOpen=false" append-to-body>
      <PageInterfaceRela :pageCode="pageCode" />
     </el-dialog>
     <!-- 页面参数维护--->
     <el-dialog title="参数维护" v-model="parameterOpen" width="80%" height="80%"  @close="parameterOpen=false" append-to-body>
      <PageParameter :pageCode="pageCode" />
     </el-dialog>
   </div>
</template>

<script setup lang="ts">



import {listPage,  delPage, addPage, updatePage} from "@/api/business/page";
import { functionTreeSelect,isLastLevel } from "@/api/business/function";
import {useRouter} from "vue-router";
import {getCurrentInstance,  reactive, ref, toRefs} from "vue";
import { useIcon } from "@/components/common/util";
import PageInterfaceRela from "@/views/business/pageInterfacerela/index.vue";
import PageParameter from "@/views/business/pageparameter/index.vue";
import FormDesigner from '@/views/modeling/form/designer.vue'
const router = useRouter();
const { proxy } = getCurrentInstance();
const { system_module_type,page_type } = proxy.useDict("system_module_type","page_type");
const pageList = ref([]);

const loading = ref(false);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const open = ref(false);
const pageCode =ref("")
const interfaceIcon = useIcon("ali_connect")
const pageDesignIcon = useIcon("ali_pagedesign")
const parameterIcon = useIcon('ali_parameter')

const businessFunctionName = ref("");
const businessFunctionOptions = ref(undefined);
const pageInfo=ref({})


const pageDesignOpen = ref(false)
const parameterOpen = ref(false)
const pageInterfaceOpen =ref(false)




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
    businessCode:null,
    module:'business_module'
  },
  queryDictParams: {
    pageNum: 1,
    pageSize: 10,
    dictType: 'table_type',
    dictLabel: undefined,
    status: undefined
  },
  rules: {
    module: [
      { required: true, message: "模块类型不能为空", trigger: "blur" }
    ],
    pageCode: [
      { required: true, message: "页面编码不能为空", trigger: "blur" }
    ],
    pageName: [
      { required: true, message: "页面名称不能为空", trigger: "blur" }
    ],
    pageTypeCode: [
      { required: true, message: "页面类型不能为空", trigger: "blur" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

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
  listPage(queryParams.value).then(response => {
    pageList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

/** 节点单击事件 */
function handleNodeClick(data) {
  queryParams.value.businessCode = data.businessCode;
  queryParams.value.module ='business_module'
  form.value.businessCode = data.businessCode;

  handleQuery();
}
/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  queryParams.value.module ='business_module'
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
    proxy.$modal.confirm('是否确认删除页面：' + row.pageName + '？').then(function () {
      return delPage(_ids,queryParams.value.businessCode);
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

/** 页面设计 **/
function handlePageDesign(row) {
  if(row.id){
    pageCode.value = row.pageCode
    pageInfo.value = {pageId:row.id}
    console.log('pageInfo:'+JSON.stringify(pageInfo.value))
    pageDesignOpen.value = true
  }
}
/**页面参数维护 **/
function handlePageParameter(row) {
  if(row.id){
    pageCode.value = row.pageCode
    parameterOpen.value = true
  }
}
/**页面接口引用维护 **/
function handleInterfaceRela(row) {
  if(row.id){
    pageCode.value = row.pageCode
    pageInterfaceOpen.value = true
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
    module:'business_module',
  };
  proxy.resetForm("pageRef");
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
  let businessCode = form.value.businessCode
  form.value = row;
  form.value.businessCode = businessCode
  open.value = true;

}

/** 提交按钮 */
function submitForm() {

   // 表单验证
   proxy.$refs["pageRef"].validate(valid => {
     // 如果验证成功
     if (valid) {
       // 如果界面url存在id，则更新接口信息
       if (form.value.id != undefined) {
         // 调用更新接口的函数
         updatePage(form.value).then(response => {
           // 提示修改成功
           proxy.$modal.msgSuccess("修改成功");
           // 关闭窗口
           open.value = false;
           // 获取列表
           getList();
         });
       } else {
         // 如果不存在id，则添加接口信息
         addPage(form.value).then(response => {
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
/**
 * 翻译页面类型
 * @param row
 * @param column
 * @returns {*|string}
 */
function  formatPageType(row, column){
  return page_type.value.find(k => k.value === row.pageTypeCode)?.label ?? '';
}

loading.value = true;
getFunctionTree();
loading.value = false;
</script>
