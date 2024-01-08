<template>
  <div class="app-container">
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
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="interfaceList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
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
  </div>
</template>

<script setup name="Interface">
import { listInterface, getInterface, delInterface, addInterface, updateInterface } from "@/api/business/interface";

const { proxy } = getCurrentInstance();

const interfaceList = ref([]);
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
    interfaceName: null,
    interfaceCode: null,
    interfaceUrl: null,
    interfaceMethod: null,
    interfaceType: null,
    interfaceDatasourceName: null,
    isSelectDatasource: null,
    isCommonUrl: null,
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询接口列表 */
function getList() {
  loading.value = true;
  listInterface(queryParams.value).then(response => {
    interfaceList.value = response.rows;
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
  title.value = "添加接口";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getInterface(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改接口";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["interfaceRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateInterface(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addInterface(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除接口编号为"' + _ids + '"的数据项？').then(function() {
    return delInterface(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('business/interface/export', {
    ...queryParams.value
  }, `interface_${new Date().getTime()}.xlsx`)
}

getList();
</script>
