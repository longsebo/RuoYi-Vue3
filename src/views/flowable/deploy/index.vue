<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="流程定义ID" prop="definitionId">
        <el-input
          v-model="queryParams.definitionId"
          placeholder="请输入流程定义ID"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="流程名称" prop="processName">
        <el-input
          v-model="queryParams.processName"
          placeholder="请输入流程名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="流程Key" prop="processKey">
        <el-input
          v-model="queryParams.processKey"
          placeholder="请输入流程Key"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="分类编码" prop="category">
        <el-input
          v-model="queryParams.category"
          placeholder="请输入分类编码"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="版本" prop="version">
        <el-input
          v-model="queryParams.version"
          placeholder="请输入版本"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="部署ID" prop="deploymentId">
        <el-input
          v-model="queryParams.deploymentId"
          placeholder="请输入部署ID"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="流程定义状态" prop="suspended">
        <el-input
          v-model="queryParams.suspended"
          placeholder="请输入流程定义状态"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="部署时间" prop="deploymentTime">
        <el-date-picker clearable
          v-model="queryParams.deploymentTime"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择部署时间">
        </el-date-picker>
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
          v-hasPermi="['flowable:deploy:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['flowable:deploy:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['flowable:deploy:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['flowable:deploy:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="deployList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="流程定义ID" align="center" prop="definitionId" />
      <el-table-column label="流程名称" align="center" prop="processName" />
      <el-table-column label="流程Key" align="center" prop="processKey" />
      <el-table-column label="分类编码" align="center" prop="category" />
      <el-table-column label="版本" align="center" prop="version" />
      <el-table-column label="部署ID" align="center" prop="deploymentId" />
      <el-table-column label="流程定义状态" align="center" prop="suspended" />
      <el-table-column label="部署时间" align="center" prop="deploymentTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.deploymentTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['flowable:deploy:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['flowable:deploy:remove']">删除</el-button>
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

    <!-- 添加或修改流程部署对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="deployRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="流程定义ID" prop="definitionId">
          <el-input v-model="form.definitionId" placeholder="请输入流程定义ID" />
        </el-form-item>
        <el-form-item label="流程名称" prop="processName">
          <el-input v-model="form.processName" placeholder="请输入流程名称" />
        </el-form-item>
        <el-form-item label="流程Key" prop="processKey">
          <el-input v-model="form.processKey" placeholder="请输入流程Key" />
        </el-form-item>
        <el-form-item label="分类编码" prop="category">
          <el-input v-model="form.category" placeholder="请输入分类编码" />
        </el-form-item>
        <el-form-item label="版本" prop="version">
          <el-input v-model="form.version" placeholder="请输入版本" />
        </el-form-item>
        <el-form-item label="部署ID" prop="deploymentId">
          <el-input v-model="form.deploymentId" placeholder="请输入部署ID" />
        </el-form-item>
        <el-form-item label="流程定义状态" prop="suspended">
          <el-input v-model="form.suspended" placeholder="请输入流程定义状态" />
        </el-form-item>
        <el-form-item label="部署时间" prop="deploymentTime">
          <el-date-picker clearable
            v-model="form.deploymentTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择部署时间">
          </el-date-picker>
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

<script setup name="Deploy">
import { listDeploy, getDeploy, delDeploy, addDeploy, updateDeploy } from "@/api/flowable/deploy";

const { proxy } = getCurrentInstance();

const deployList = ref([]);
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
    definitionId: null,
    processName: null,
    processKey: null,
    category: null,
    version: null,
    deploymentId: null,
    suspended: null,
    deploymentTime: null
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询流程部署列表 */
function getList() {
  loading.value = true;
  listDeploy(queryParams.value).then(response => {
    deployList.value = response.rows;
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
    definitionId: null,
    processName: null,
    processKey: null,
    category: null,
    version: null,
    deploymentId: null,
    suspended: null,
    deploymentTime: null
  };
  proxy.resetForm("deployRef");
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
  ids.value = selection.map(item => item.definitionId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加流程部署";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _definitionId = row.definitionId || ids.value
  getDeploy(_definitionId).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改流程部署";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["deployRef"].validate(valid => {
    if (valid) {
      if (form.value.definitionId != null) {
        updateDeploy(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addDeploy(form.value).then(response => {
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
  const _definitionIds = row.definitionId || ids.value;
  proxy.$modal.confirm('是否确认删除流程部署编号为"' + _definitionIds + '"的数据项？').then(function() {
    return delDeploy(_definitionIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('flowable/deploy/export', {
    ...queryParams.value
  }, `deploy_${new Date().getTime()}.xlsx`)
}

getList();
</script>
