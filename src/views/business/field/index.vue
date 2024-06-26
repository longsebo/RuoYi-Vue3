<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="字段名" prop="fieldEnName">
        <el-input
          v-model="queryParams.fieldEnName"
          placeholder="请输入字段名"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="字段中文名" prop="fieldCnName">
        <el-input
          v-model="queryParams.fieldCnName"
          placeholder="请输入字段中文名"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="字段说明" prop="ffieldRemark">
        <el-input
          v-model="queryParams.ffieldRemark"
          placeholder="请输入字段说明"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="字段宽度" prop="fieldWidth">
        <el-input
          v-model="queryParams.fieldWidth"
          placeholder="请输入字段宽度"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="信息范围" prop="scope">
        <el-input
          v-model="queryParams.scope"
          placeholder="请输入信息范围"
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
          v-hasPermi="['business:field:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['business:field:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['business:field:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['business:field:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="fieldList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="字段名" align="center" prop="fieldEnName" />
      <el-table-column label="字段中文名" align="center" prop="fieldCnName" />
      <el-table-column label="字段说明" align="center" prop="ffieldRemark" />
      <el-table-column label="字段宽度" align="center" prop="fieldWidth" />
      <el-table-column label="字段类型" align="center" prop="fieldType" />
      <el-table-column label="字段控件定义" align="center" prop="scheme" />
      <el-table-column label="信息范围" align="center" prop="scope" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['business:field:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['business:field:remove']">删除</el-button>
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

    <!-- 添加或修改模型字段对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="fieldRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="字段名" prop="fieldEnName">
          <el-input v-model="form.fieldEnName" placeholder="请输入字段名" />
        </el-form-item>
        <el-form-item label="字段中文名" prop="fieldCnName">
          <el-input v-model="form.fieldCnName" placeholder="请输入字段中文名" />
        </el-form-item>
        <el-form-item label="字段说明" prop="ffieldRemark">
          <el-input v-model="form.ffieldRemark" placeholder="请输入字段说明" />
        </el-form-item>
        <el-form-item label="字段宽度" prop="fieldWidth">
          <el-input v-model="form.fieldWidth" placeholder="请输入字段宽度" />
        </el-form-item>
        <el-form-item label="信息范围" prop="scope">
          <el-input v-model="form.scope" placeholder="请输入信息范围" />
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

<script setup name="Field">
import { listField, getField, delField, addField, updateField } from "@/api/business/field";

const { proxy } = getCurrentInstance();

const fieldList = ref([]);
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
    fieldEnName: null,
    fieldCnName: null,
    ffieldRemark: null,
    fieldWidth: null,
    fieldType: null,
    scheme: null,
    scope: null,
  },
  rules: {
    fieldEnName: [
      { required: true, message: "字段名不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询模型字段列表 */
function getList() {
  loading.value = true;
  listField(queryParams.value).then(response => {
    fieldList.value = response.rows;
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
    fieldEnName: null,
    fieldCnName: null,
    ffieldRemark: null,
    fieldWidth: null,
    fieldType: null,
    scheme: null,
    scope: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null
  };
  proxy.resetForm("fieldRef");
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
  title.value = "添加模型字段";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getField(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改模型字段";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["fieldRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateField(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addField(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除模型字段编号为"' + _ids + '"的数据项？').then(function() {
    return delField(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('business/field/export', {
    ...queryParams.value
  }, `field_${new Date().getTime()}.xlsx`)
}

getList();
</script>
