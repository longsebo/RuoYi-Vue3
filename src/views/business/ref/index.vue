<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="信息范围" prop="SCOPE">
        <el-input
          v-model="queryParams.SCOPE"
          placeholder="请输入信息范围"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="模型表英文名" prop="enName">
        <el-input
          v-model="queryParams.enName"
          placeholder="请输入模型表英文名"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="字段定义表ID" prop="extModelFieldId">
        <el-input
          v-model="queryParams.extModelFieldId"
          placeholder="请输入字段定义表ID"
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
          v-hasPermi="['business:ref:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['business:ref:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['business:ref:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['business:ref:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="refList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="ID" />
      <el-table-column label="信息范围" align="center" prop="SCOPE" />
      <el-table-column label="模型表英文名" align="center" prop="enName" />
      <el-table-column label="字段定义表ID" align="center" prop="extModelFieldId" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['business:ref:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['business:ref:remove']">删除</el-button>
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

    <!-- 添加或修改模型字段引用对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="refRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="信息范围" prop="SCOPE">
          <el-input v-model="form.SCOPE" placeholder="请输入信息范围" />
        </el-form-item>
        <el-form-item label="模型表英文名" prop="enName">
          <el-input v-model="form.enName" placeholder="请输入模型表英文名" />
        </el-form-item>
        <el-form-item label="字段定义表ID" prop="extModelFieldId">
          <el-input v-model="form.extModelFieldId" placeholder="请输入字段定义表ID" />
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

<script setup name="Ref">
import { listRef, getRef, delRef, addRef, updateRef } from "@/api/business/ref";

const { proxy } = getCurrentInstance();

const refList = ref([]);
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
    SCOPE: null,
    enName: null,
    extModelFieldId: null
  },
  rules: {
    SCOPE: [
      { required: true, message: "信息范围不能为空", trigger: "blur" }
    ],
    enName: [
      { required: true, message: "模型表英文名不能为空", trigger: "blur" }
    ],
    extModelFieldId: [
      { required: true, message: "字段定义表ID不能为空", trigger: "blur" }
    ]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询模型字段引用列表 */
function getList() {
  loading.value = true;
  listRef(queryParams.value).then(response => {
    refList.value = response.rows;
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
    SCOPE: null,
    enName: null,
    extModelFieldId: null
  };
  proxy.resetForm("refRef");
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
  title.value = "添加模型字段引用";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _ID = row.ID || ids.value
  getRef(_ID).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改模型字段引用";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["refRef"].validate(valid => {
    if (valid) {
      if (form.value.ID != null) {
        updateRef(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addRef(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除模型字段引用编号为"' + _IDs + '"的数据项？').then(function() {
    return delRef(_IDs);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('business/ref/export', {
    ...queryParams.value
  }, `ref_${new Date().getTime()}.xlsx`)
}

getList();
</script>
