<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="应用编码" prop="applicationCode">
        <el-input
          v-model="queryParams.applicationCode"
          placeholder="请输入应用编码"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="MQ名称" prop="mqName">
        <el-input
          v-model="queryParams.mqName"
          placeholder="请输入MQ名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="主题" prop="topic">
        <el-input
          v-model="queryParams.topic"
          placeholder="请输入主题"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="标签" prop="tag">
        <el-input
          v-model="queryParams.tag"
          placeholder="请输入标签"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="监听服务名称" prop="listenServiceName">
        <el-input
          v-model="queryParams.listenServiceName"
          placeholder="请输入监听服务名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="转发主题" prop="forwardTopic">
        <el-input
          v-model="queryParams.forwardTopic"
          placeholder="请输入转发主题"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="转发标签" prop="forwardTag">
        <el-input
          v-model="queryParams.forwardTag"
          placeholder="请输入转发标签"
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
          v-hasPermi="['business:listening:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['business:listening:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['business:listening:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['business:listening:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="listeningList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="应用编码" align="center" prop="applicationCode" />
      <el-table-column label="MQ名称" align="center" prop="mqName" />
      <el-table-column label="主题" align="center" prop="topic" />
      <el-table-column label="标签" align="center" prop="tag" />
      <el-table-column label="监听服务名称" align="center" prop="listenServiceName" />
      <el-table-column label="转发主题" align="center" prop="forwardTopic" />
      <el-table-column label="转发标签" align="center" prop="forwardTag" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['business:listening:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['business:listening:remove']">删除</el-button>
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

    <!-- 添加或修改功能侦听对话框 -->
    <el-dialog :title="title" v-model="open" width="600px" append-to-body>
      <el-form ref="listeningRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="应用编码" prop="applicationCode">
          <el-select
              v-model="form.applicationCode"
              placeholder="应用编码"
              clearable
              style="width: 240px"
          >
            <el-option
                v-for="item in applicationCodeList"
                :key="item.applicationCode"
                :label="item.applicationName"
                :value="item.applicationCode"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="MQ名称" prop="mqName">
          <el-select
              v-model="form.mqName"
              placeholder="MQ名称"
              clearable
              style="width: 240px"
          >
            <el-option
                v-for="item in mqConfigList"
                :key="item.mqName"
                :label="item.mqName"
                :value="item.mqName"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="主题" prop="topic">
          <el-input v-model="form.topic" placeholder="请输入主题" />
        </el-form-item>
        <el-form-item label="标签" prop="tag">
          <el-input v-model="form.tag" placeholder="请输入标签" />
        </el-form-item>
        <el-form-item label="监听服务名称" prop="listenServiceName" label-width="auto">
          <el-input v-model="form.listenServiceName" placeholder="请输入监听服务名称" />
        </el-form-item>
        <el-form-item label="转发主题" prop="forwardTopic">
          <el-input v-model="form.forwardTopic" placeholder="请输入转发主题" />
        </el-form-item>
        <el-form-item label="转发标签" prop="forwardTag">
          <el-input v-model="form.forwardTag" placeholder="请输入转发标签" />
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

<script setup name="Listening">
import { listListening, getListening, delListening, addListening, updateListening } from "@/api/business/listening";
import {listApplication} from "@/api/business/application";
import {listConf} from "@/api/business/conf";
import {reactive, ref} from "vue";

const { proxy } = getCurrentInstance();

const listeningList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const mqConfigList= ref([])
const applicationCodeList = ref([])
const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    applicationCode: null,
    mqName: null,
    topic: null,
    tag: null,
    listenServiceName: null,
    forwardTopic: null,
    forwardTag: null,
  },
  rules: {
    applicationCode: [
      { required: true, message: "应用编码不能为空", trigger: "blur" },
    ],
    mqName:[
      { required: true, message: "mq名称不能为空", trigger: "blur" }
    ],
    topic:[
      { required: true, message: "主题不能为空", trigger: "blur" },
    ],
    listenServiceName:[
      { required: true, message: "监听服务不能为空", trigger: "blur" }
    ]
  }

});

const { queryParams, form, rules } = toRefs(data);

/** 查询功能侦听列表 */
function getList() {
  loading.value = true;
  listListening(queryParams.value).then(response => {
    listeningList.value = response.rows;
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
    applicationCode: null,
    mqName: null,
    topic: null,
    tag: null,
    listenServiceName: null,
    forwardTopic: null,
    forwardTag: null,
    remark: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null
  };
  proxy.resetForm("listeningRef");
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
  title.value = "添加功能侦听";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getListening(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改功能侦听";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["listeningRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateListening(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addListening(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除功能侦听编号为"' + _ids + '"的数据项？').then(function() {
    return delListening(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('business/listening/export', {
    ...queryParams.value
  }, `listening_${new Date().getTime()}.xlsx`)
}

/**
 * 获取应用列表
 */
function getApplicaitonList(){
  let queryParam={pageNum: 1, pageSize: 1000};
  listApplication(queryParam).then(response => {
    applicationCodeList.value = response.rows;
  });
}

/**
 * 获取MQ配置列表
 */
function getMqConfigList() {
  let queryParam={pageNum: 1, pageSize: 1000};
  listConf(queryParam).then(response => {
    mqConfigList.value = response.rows;
  });
}
getList();
getApplicaitonList();
getMqConfigList();
</script>
