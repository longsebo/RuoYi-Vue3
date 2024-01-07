<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="业务编码" prop="businessCode">
        <el-input
          v-model="queryParams.businessCode"
          placeholder="请输入业务编码"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="业务名称" prop="businessName">
        <el-input
          v-model="queryParams.businessName"
          placeholder="请输入业务名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="父级编码" prop="parentCode">
        <el-input
          v-model="queryParams.parentCode"
          placeholder="请输入父级编码"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="备注" prop="REMARK">
        <el-input
          v-model="queryParams.REMARK"
          placeholder="请输入备注"
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
          v-hasPermi="['business:function:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['business:function:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['business:function:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['business:function:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="functionList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="ID" />
      <el-table-column label="业务编码" align="center" prop="businessCode" />
      <el-table-column label="业务名称" align="center" prop="businessName" />
      <el-table-column label="父级编码" align="center" prop="parentCode" />
      <el-table-column label="备注" align="center" prop="REMARK" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['business:function:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['business:function:remove']">删除</el-button>
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
        <el-form-item label="备注" prop="REMARK">
          <el-input v-model="form.REMARK" placeholder="请输入备注" />
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

<script setup name="Function">
import { listFunction, getFunction, delFunction, addFunction, updateFunction } from "@/api/business/function";

const { proxy } = getCurrentInstance();

const functionList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    businessCode: null,
    businessName: null,
    parentCode: null,
    REMARK: null
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

const { queryParams, form, rules } = toRefs(data);

/** 查询业务功能列表 */
function getList() {
  loading.value = true;
  listFunction(queryParams.value).then(response => {
    functionList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    ID: null,
    businessCode: null,
    businessName: null,
    parentCode: null,
    REMARK: null
  };
  proxy.resetForm("functionRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.ID);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加业务功能";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _ID = row.ID || ids.value
  getFunction(_ID).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改业务功能";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["functionRef"].validate(valid => {
    if (valid) {
      if (form.value.ID != null) {
        updateFunction(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addFunction(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _IDs = row.ID || ids.value;
  proxy.$modal.confirm('是否确认删除业务功能编号为"' + _IDs + '"的数据项？').then(function() {
    return delFunction(_IDs);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('business/function/export', {
    ...queryParams.value
  }, `function_${new Date().getTime()}.xlsx`)
}

getList();
</script>
