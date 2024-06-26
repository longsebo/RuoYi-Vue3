<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="数据源名称" prop="datasourceName" label-width="auto">
        <el-input
          v-model="queryParams.datasourceName"
          placeholder="请输入数据源名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="驱动类" prop="driverClass">
        <el-input
          v-model="queryParams.driverClass"
          placeholder="请输入驱动类"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="URL" prop="url">
        <el-input
          v-model="queryParams.url"
          placeholder="请输入URL"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户名" prop="userName">
        <el-input
          v-model="queryParams.userName"
          placeholder="请输入用户名"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          v-model="queryParams.password"
          placeholder="请输入密码"
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
          v-hasPermi="['business:datasource:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['business:datasource:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['business:datasource:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['business:datasource:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="datasourceList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="数据源名称" align="center" prop="datasourceName" />
      <el-table-column label="驱动类" align="center" prop="driverClass" />
      <el-table-column label="URL" align="center" prop="url" />
      <el-table-column label="用户名" align="center" prop="userName" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="数据库类型" align="center" prop="dbType" :formatter="formatDbType"  />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['business:datasource:edit']">修改</el-button>
          <el-button link type="primary" :icon="dbConectIcon" @click="handleCheckConnect(scope.row.id)" v-hasPermi="['business:datasource:checkconnect']">测试连接</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['business:datasource:remove']">删除</el-button>
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

    <!-- 添加或修改数据源定义对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="datasourceRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="数据源名称" prop="datasourceName" label-width="auto">
          <el-input v-model="form.datasourceName" placeholder="请输入数据源名称" />
        </el-form-item>
        <el-form-item label="数据库类型" prop="dbType" label-width="auto">
          <el-select v-model="form.dbType"   placeholder="请选择页面类型" >
            <el-option v-for="item in db_type" :key="item.value" :value="item.value" :label="item.label"/>
          </el-select>
        </el-form-item>

        <el-form-item label="驱动类" prop="driverClass">
          <el-input v-model="form.driverClass" placeholder="请输入驱动类" />
        </el-form-item>
        <el-form-item label="URL" prop="url">
          <el-input v-model="form.url" placeholder="请输入URL" />
        </el-form-item>
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="form.userName" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" placeholder="请输入密码" type="password"/>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button type="primary"  v-show="canCheckConnect" @click="handleCheckConnectByForm(form.id)">测试连接</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Datasource" lang="ts">
import { listDatasource, getDatasource, delDatasource, addDatasource, updateDatasource } from "@/api/business/datasource";
import {useIcon} from "../../../components/common/util";
import {checkConnect} from "../../../api/business/datasource";
import {getCurrentInstance, reactive, ref, toRefs} from "vue";

const { proxy } = getCurrentInstance();
const { db_type } = proxy.useDict("db_type");
const datasourceList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const dbConectIcon = useIcon('ali_connect')
const canCheckConnect = ref(false)
const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    datasourceName: null,
    driverClass: null,
    url: null,
    userName: null,
    password: null,
    dbType: null
  },
  rules: {
    datasourceName: [
      { required: true, message: "数据源名称不能为空", trigger: "blur" }
    ],
    driverClass: [
      { required: true, message: "驱动类不能为空", trigger: "blur" }
    ],
    url: [
      { required: true, message: "URL不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询数据源定义列表 */
function getList() {
  loading.value = true;
  listDatasource(queryParams.value).then(response => {
    datasourceList.value = response.rows;
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
    datasourceName: null,
    driverClass: null,
    url: null,
    userName: null,
    password: null,
    remark: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    dbType: null
  };
  proxy.resetForm("datasourceRef");
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
  canCheckConnect.value = false;
  title.value = "添加数据源定义";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value

  getDatasource(_id).then(response => {
    form.value = response.data;
    open.value = true;
    canCheckConnect.value = true;
    title.value = "修改数据源定义";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["datasourceRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateDatasource(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addDatasource(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}
/** 测试连接 */
function handleCheckConnectByForm(id) {
  updateDatasource(form.value).then(response => {
    handleCheckConnect(id)
  })
}
/** 测试连接 */
function handleCheckConnect(id){
    checkConnect(id).then(response => {
      if (response.code == 200) {
        proxy.$modal.msgSuccess("连接成功");
      } else {
        proxy.$modal.msgError(response.msg);
      }
    })
}
/** 删除按钮操作 */
function handleDelete(row) {
  const _ids = row.id || ids.value;
  proxy.$modal.confirm('是否确认删除数据源定义编号为"' + _ids + '"的数据项？').then(function() {
    return delDatasource(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('business/datasource/export', {
    ...queryParams.value
  }, `datasource_${new Date().getTime()}.xlsx`)
}
/**
 * 翻译数据库类型
 * @param row
 * @param column
 * @returns {*|string}
 */
function  formatDbType(row, column){
  debugger;
  console.log('db_type:'+JSON.stringify(db_type.value))
  return db_type.value.find(k => k.value === row.dbType)?.label ?? '';
}
getList();
</script>
