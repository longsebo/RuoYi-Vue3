<template>
   <div class="app-container">
      <el-row :gutter="20">
         <!--业务功能数据-->
         <el-col :span="4" :xs="24">
            <div class="head-container">
               <el-tree
                  :data="businessFunctionOptions"
                  :props="{ label: 'businessName', children: 'children' }"
                  :expand-on-click-node="false"
                  ref="businessFunctionTreeRef"
                  node-key="id"
                  highlight-current
                  default-expand-all
                  @node-click="handleNodeClick"
               />
            </div>
         </el-col>
         <!--业务功能数据-->
         <el-col :span="20" :xs="24">
              <el-row :gutter="10" class="mb8">
               <el-col :span="1.5">
                  <el-button
                     type="primary"
                     plain
                     icon="Plus"
                     @click="handleAddRoot"
                     v-hasPermi="['business:function:add']"
                  >新增根功能</el-button>
               </el-col>
            </el-row>
           <el-form ref="currentFunctionRef" :model="currentForm" :rules="rules" label-width="80px">
             <el-form-item label="业务编码" prop="businessCode">
               <el-input v-model="currentForm.businessCode" placeholder="请输入业务编码" />
             </el-form-item>
             <el-form-item label="业务名称" prop="businessName">
               <el-input v-model="currentForm.businessName" placeholder="请输入业务名称" />
             </el-form-item>
             <el-form-item label="父级编码" prop="parentCode">
               <el-input v-model="currentForm.parentCode" placeholder="请输入父级编码" />
             </el-form-item>
             <el-form-item label="备注" prop="remark">
               <el-input v-model="currentForm.remark" placeholder="请输入备注" />
             </el-form-item>
             <el-form-item>
               <el-button
                   type="success"
                   plain
                   icon="Edit"
                   @click="handleUpdate"
                   v-hasPermi="['business:function:edit']"
               >保存</el-button>
               <el-button
                   type="primary"
                   plain
                   icon="Plus"
                   @click="handleAddChild"
                   v-hasPermi="['business:function:add']"
               >新增下级</el-button>
               <el-button
                   type="danger"
                   plain
                   icon="Delete"
                   @click="handleDelete"
                   v-hasPermi="['business:function:remove']"
               >删除</el-button>
             </el-form-item>
           </el-form>
         </el-col>
      </el-row>

     <!-- 添加或修改业务功能对话框 -->
     <el-dialog :title="title" v-model="open" width="500px" append-to-body>
       <el-form ref="functionRef" :model="form" :rules="rules" label-width="80px">
         <el-form-item label="业务编码" prop="businessCode">
           <el-input v-model="form.businessCode" placeholder="请输入业务编码" />
         </el-form-item>
         <el-form-item label="业务名称" prop="businessName">
           <el-input v-model="form.businessName" placeholder="请输入业务名称" />
         </el-form-item>
         <el-form-item label="父级编码" prop="parentCode">
           <el-input v-model="form.parentCode" placeholder="请输入父级编码" />
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

   </div>
</template>

<script setup name="businessFunction">
import { listFunction, getFunction, delFunction, addFunction, updateFunction,functionTreeSelect } from "@/api/business/function";

const router = useRouter();
const { proxy } = getCurrentInstance();
const { sys_normal_disable, sys_user_sex } = proxy.useDict("sys_normal_disable", "sys_user_sex");

const functionList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const dateRange = ref([]);
const businessName = ref("");
const businessFunctionOptions = ref(undefined);



const data = reactive({
  form: {},
  currentForm:{},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    businessCode: null,
    businessName: null,
    parentCode: null,
  },
  rules: {
    businessCode: [
      { required: true, message: "业务编码不能为空", trigger: "blur" }
    ],
    businessName: [
      { required: true, message: "业务名称不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules,currentForm } = toRefs(data);

/** 查询部门下拉树结构 */
function getFunctionTree() {
  functionTreeSelect(queryParams).then(response => {
    businessFunctionOptions.value = response.data;
  });
};

/** 节点单击事件 */
function handleNodeClick(data) {
  currentForm.value = data;
};

/** 删除按钮操作 */
function handleDelete() {
  const id = currentForm.value.id
  //debugger;
  if(id) {
    proxy.$modal.confirm('是否确认删除' + currentForm.value.businessName + '的功能？').then(function () {
      return delFunction(id)
    }).then(() => {
      getFunctionTree()
      currentFormReset()
      proxy.$modal.msgSuccess("删除成功");
    }).catch(() => {
    });
  }else{
    proxy.$modal.alertWarning("请选择功能树节点！")
  }
};

/** 重置操作表单 */
function currentFormReset() {
  currentForm.value = {
    id: null,
    businessCode: null,
    businessName: null,
    parentCode: null,
    remark: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null
  };
  proxy.resetForm("currentFunctionRef");
};


/** 重置操作表单 */
function reset() {
  form.value = {
    id: null,
    businessCode: null,
    businessName: null,
    parentCode: null,
    remark: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null
  };
  proxy.resetForm("functionRef");
};
/** 取消按钮 */
function cancel() {
  open.value = false;
  reset();
};
/** 新增根功能按钮操作 */
function handleAddRoot() {
  reset();
  open.value = true;
  title.value = "添加根业务功能";
};
/** 新增子功能按钮操作 */
function handleAddChild() {
  reset();
  const businessCode = currentForm.value.businessCode
  //debugger;
  if(businessCode) {
    form.value.parentCode = businessCode
    open.value = true;
    title.value = "添加子业务功能";
  }else{
    proxy.$modal.alertWarning("请选择树节点!");
  }
};

/** 修改按钮操作 */
function handleUpdate() {
  proxy.$refs["currentFunctionRef"].validate(valid => {
    if (valid) {
      if (currentForm.value.id != null) {
        updateFunction(currentForm.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          getFunctionTree();
        });
      } else {
        addFunction(currentForm.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          getFunctionTree();
        });
      }
    }
  });
};
/** 提交按钮 */
function submitForm() {
  proxy.$refs["functionRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateFunction(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getFunctionTree();
        });
      } else {
        addFunction(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getFunctionTree();
        });
      }
    }
  });
};

getFunctionTree();
</script>
