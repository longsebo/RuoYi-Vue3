<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="接口编码" prop="interfaceCode">
        <el-input
          v-model="queryParams.interfaceCode"
          placeholder="请输入接口编码"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="业务编码" prop="businessCode">
        <el-input
          v-model="queryParams.businessCode"
          placeholder="请输入业务编码"
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
          v-hasPermi="['business:rela:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['business:rela:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['business:rela:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['business:rela:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="relaList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="ID" />
      <el-table-column label="接口编码" align="center" prop="interfaceCode" />
      <el-table-column label="业务编码" align="center" prop="businessCode" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['business:rela:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['business:rela:remove']">删除</el-button>
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

    <!-- 添加或修改业务功能接口关系对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="relaRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="接口编码" prop="interfaceCode">
          <el-input v-model="form.interfaceCode" placeholder="请输入接口编码" />
        </el-form-item>
        <el-form-item label="业务编码" prop="businessCode">
          <el-input v-model="form.businessCode" placeholder="请输入业务编码" />
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

<script setup name="Rela">
import { listRela, getRela, delRela, addRela, updateRela } from "@/api/business/rela";

const { proxy } = getCurrentInstance();

const relaList = ref([]);
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
    interfaceCode: null,
    businessCode: null
  },
  rules: {
    businessCode: [
      { required: true, message: "业务编码不能为空", trigger: "blur" }
    ]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询业务功能接口关系列表 */
function getList() {
  loading.value = true;
  listRela(queryParams.value).then(response => {
    relaList.value = response.rows;
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
    interfaceCode: null,
    businessCode: null
  };
  proxy.resetForm("relaRef");
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
  title.value = "添加业务功能接口关系";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _ID = row.ID || ids.value
  getRela(_ID).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改业务功能接口关系";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["relaRef"].validate(valid => {
    if (valid) {
      if (form.value.ID != null) {
        updateRela(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addRela(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除业务功能接口关系编号为"' + _IDs + '"的数据项？').then(function() {
    return delRela(_IDs);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('business/rela/export', {
    ...queryParams.value
  }, `rela_${new Date().getTime()}.xlsx`)
}

getList();
</script>
