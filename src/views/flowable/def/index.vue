<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="数据库字段/表单字段" prop="field">
        <el-input
          v-model="queryParams.field"
          placeholder="请输入数据库字段/表单字段"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="字段名/表单字段名" prop="label">
        <el-input
          v-model="queryParams.label"
          placeholder="请输入字段名/表单字段名"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="字段宽度" prop="width">
        <el-input
          v-model="queryParams.width"
          placeholder="请输入字段宽度"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="字段范围" prop="scope">
        <el-input
          v-model="queryParams.scope"
          placeholder="请输入字段范围"
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
          v-hasPermi="['flowable:def:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['flowable:def:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['flowable:def:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['flowable:def:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="defList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键ID" align="center" prop="id" />
      <el-table-column label="数据库字段/表单字段" align="center" prop="field" />
      <el-table-column label="字段名/表单字段名" align="center" prop="label" />
      <el-table-column label="字段说明" align="center" prop="remark" />
      <el-table-column label="字段宽度" align="center" prop="width" />
      <el-table-column label="字段组件类型" align="center" prop="type" />
      <el-table-column label="字段定义" align="center" prop="scheme" />
      <el-table-column label="字段范围" align="center" prop="scope" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['flowable:def:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['flowable:def:remove']">删除</el-button>
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

    <!-- 添加或修改流程字段定义对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="defRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="数据库字段/表单字段" prop="field">
          <el-input v-model="form.field" placeholder="请输入数据库字段/表单字段" />
        </el-form-item>
        <el-form-item label="字段名/表单字段名" prop="label">
          <el-input v-model="form.label" placeholder="请输入字段名/表单字段名" />
        </el-form-item>
        <el-form-item label="字段说明" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入字段说明" />
        </el-form-item>
        <el-form-item label="字段宽度" prop="width">
          <el-input v-model="form.width" placeholder="请输入字段宽度" />
        </el-form-item>
        <el-form-item label="字段范围" prop="scope">
          <el-input v-model="form.scope" placeholder="请输入字段范围" />
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

<script setup name="Def">
import { listDef, getDef, delDef, addDef, updateDef } from "@/api/flowable/def";

const { proxy } = getCurrentInstance();

const defList = ref([]);
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
    field: null,
    label: null,
    width: null,
    type: null,
    scheme: null,
    scope: null,
  },
  rules: {
    field: [
      { required: true, message: "数据库字段/表单字段不能为空", trigger: "blur" }
    ],
    label: [
      { required: true, message: "字段名/表单字段名不能为空", trigger: "blur" }
    ],
    width: [
      { required: true, message: "字段宽度不能为空", trigger: "blur" }
    ],
    type: [
      { required: true, message: "字段组件类型不能为空", trigger: "change" }
    ],
    scheme: [
      { required: true, message: "字段定义不能为空", trigger: "blur" }
    ],
    createBy: [
      { required: true, message: "创建人不能为空", trigger: "blur" }
    ],
    createTime: [
      { required: true, message: "创建时间不能为空", trigger: "blur" }
    ]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询流程字段定义列表 */
function getList() {
  loading.value = true;
  listDef(queryParams.value).then(response => {
    defList.value = response.rows;
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
    id: null,
    field: null,
    label: null,
    remark: null,
    width: null,
    type: null,
    scheme: null,
    scope: null,
    updateBy: null,
    updateTime: null,
    createBy: null,
    createTime: null
  };
  proxy.resetForm("defRef");
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
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加流程字段定义";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getDef(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改流程字段定义";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["defRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateDef(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
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
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _ids = row.id || ids.value;
  proxy.$modal.confirm('是否确认删除流程字段定义编号为"' + _ids + '"的数据项？').then(function() {
    return delDef(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('flowable/def/export', {
    ...queryParams.value
  }, `def_${new Date().getTime()}.xlsx`)
}

getList();
</script>
