<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="名称" prop="mqName">
        <el-input
          v-model="queryParams.mqName"
          placeholder="请输入名称"
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
          v-hasPermi="['business:conf:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['business:conf:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['business:conf:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['business:conf:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="confList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="名称" align="center" prop="mqName" />
      <el-table-column label="MQ类型" align="center" prop="mqType" />
      <el-table-column label="MQ配置" align="center" prop="mqConfig" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['business:conf:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['business:conf:remove']">删除</el-button>
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

    <!-- 添加或修改MQ配置定义对话框 -->
    <el-dialog :title="title" v-model="open" width="80%" height="80%" append-to-body>
      <el-form ref="confRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="名称" prop="mqName">
          <el-input v-model="form.mqName" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="MQ类型" prop="mqType">
          <el-select
              v-model="form.mqType"
              placeholder="请选择MQ类型"
              clearable
              style="width: 240px"
              @change="mqTypeSelectChange"
          >
            <el-option
                v-for="item in mqTypeList"
                :key="item.dictLabel"
                :label="item.dictLabel"
                :value="item.dictLabel"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="MQ配置" prop="mqConfig" >
          <Vue3JsonEditor
              v-model="json"
              mode='tree'
              :show-btns="true"
              :on-node-name="onNodeName"
              @json-change="onJsonChange"
          />
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

<script setup name="Conf" lang="ts">
import { listConf, getConf, delConf, addConf, updateConf } from "@/api/business/conf";
import { listData } from "@/api/system/dict/data";
import {Vue3JsonEditor} from "@/components/json-editor";
import {getCurrentInstance, reactive, ref, toRefs} from "vue";
const { proxy } = getCurrentInstance();

const confList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const mqTypeList = ref([]);
const json =ref({
})
const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    mqName: null,
    mqType: null,
    mqConfig: null,
  },
  rules: {
    mqName: [
      { required: true, message: "名称不能为空", trigger: "blur" }
    ],
    mqType: [
      { required: true, message: "MQ类型不能为空", trigger: "change" }
    ],
    mqConfig: [
      { required: true, message: "MQ配置不能为空", trigger: "blur" }
    ],
  },
  queryDictParams: {
    pageNum: 1,
    pageSize: 10,
    dictType: 'mq_type',
    dictLabel: undefined,
    status: undefined
  }
});

const { queryParams, form, rules,queryDictParams } = toRefs(data);

/**
 * json编辑发生变化
 * @param value
 */
function onJsonChange(value){
  console.log('jsonValue1:'+JSON.stringify(value))
  form.value.mqConfig = JSON.stringify(value)
}
// eslint-disable-next-line consistent-return
const onNodeName = (node: {
  value: any; type: any
}) => {
  if (node.type === 'object' && node.value.identity) {
    return node.value.identity;
  }
  return undefined;
}
/** 查询MQ配置定义列表 */
function getList() {
  loading.value = true;
  listConf(queryParams.value).then(response => {
    confList.value = response.rows;
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
    mqName: null,
    mqType: null,
    mqConfig: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null
  };
  proxy.resetForm("confRef");
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
  title.value = "添加MQ配置定义";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getConf(_id).then(response => {
    form.value = response.data;
    json.value = JSON.parse(form.value.mqConfig)
    open.value = true;
    title.value = "修改MQ配置定义";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["confRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateConf(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addConf(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除MQ配置定义编号为"' + _ids + '"的数据项？').then(function() {
    return delConf(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('business/conf/export', {
    ...queryParams.value
  }, `conf_${new Date().getTime()}.xlsx`)
}
/** 查询mqType字典数据列表 */
function getMqTypeList() {

  listData(queryDictParams.value).then(response => {
    mqTypeList.value = response.rows;
  });
}

/**
 * mq类型选择变化
 */
function mqTypeSelectChange(mqName){
 //回填mq配置
 let mqConfig='';
 debugger;
 //循环查找字典
  for(let i=0;i<mqTypeList.value.length;i++){
    let item = mqTypeList.value[i];
    if(item.dictLabel==mqName){
      mqConfig = item.dictValue;
      break;
    }
  }
 form.value.mqConfig =mqConfig;
 json.value = JSON.parse(form.value.mqConfig)
}
getList();
getMqTypeList();
</script>
