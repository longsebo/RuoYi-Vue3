<template>
  <div class="app-container">
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
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="模块" align="center" prop="module" />
      <el-table-column label="页面编码" align="center" prop="pageCode" />
      <el-table-column label="页面名称" align="center" prop="pageName" />
      <el-table-column label="页面内容" align="center" prop="pageScheme" />
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
  </div>
</template>

<script setup name="Page">
import { listPage, getPage, delPage, addPage, updatePage } from "@/api/business/page";

const { proxy } = getCurrentInstance();

const pageList = ref([]);
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
    module: null,
    pageCode: null,
    pageName: null,
    pageScheme: null,
    pageTypeCode: null,
    pageParameter: null,
  },
  rules: {
    pageCode: [
      { required: true, message: "页面编码不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询页面定义列表 */
function getList() {
  loading.value = true;
  listPage(queryParams.value).then(response => {
    pageList.value = response.rows;
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
    module: null,
    pageCode: null,
    pageName: null,
    pageScheme: null,
    pageTypeCode: null,
    pageParameter: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null
  };
  proxy.resetForm("pageRef");
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
  title.value = "添加页面定义";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getPage(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改页面定义";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["pageRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updatePage(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addPage(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除页面定义编号为"' + _ids + '"的数据项？').then(function() {
    return delPage(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('business/page/export', {
    ...queryParams.value
  }, `page_${new Date().getTime()}.xlsx`)
}

getList();
</script>
