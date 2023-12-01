<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="模型标识" prop="modelId">
        <el-input
          v-model="queryParams.modelId"
          placeholder="请输入模型标识"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="模型名称" prop="modelName">
        <el-input
          v-model="queryParams.modelName"
          placeholder="请输入模型名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="流程分类" prop="category">
        <el-select
            v-model="queryParams.category"
            placeholder="流程分类"
            clearable
            style="width: 240px"
        >
          <el-option
              v-for="item in flowCategory"
              :key="item.code"
              :label="item.name"
              :value="item.code"
          />
        </el-select>

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
          v-hasPermi="['flow:flow_model:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['flow:flow_model:update']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['flow:flow_model:delete']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['flow:flow_model:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="modelList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="模型名称" align="center" prop="modelName" />
      <el-table-column label="流程分类" align="center" prop="category" />
      <el-table-column label="版本" align="center" prop="version" />
      <el-table-column label="模型描述" align="center" prop="description" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit"  @click="handleUpdate(scope.row)" v-hasPermi="['flow:flow_model:update']">修改</el-button>
          <el-button link type="primary" icon="Brush" @click="handleDesign(scope.row)" v-hasPermi="['flow:flow_model:design']">设计</el-button>
          <el-dropdown>
          <span class="el-dropdown-link">
            更多...
          </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                    icon="videoPlay"
                    @click.native="handleDeploy(scope.row)"
                    v-hasPermi="['flow:flow_model:deploy']"
                >部署</el-dropdown-item>
                <el-dropdown-item
                    icon="View"
                    @click.native="handleProcessView(scope.row)"
                    v-hasPermi="['flow:flow_model:query']"
                >流程图</el-dropdown-item>
                <el-dropdown-item
                    icon="PriceTag"
                    @click.native="handleHistory(scope.row)"
                    v-hasPermi="['flow:flow_model:list']"
                >历史</el-dropdown-item>
                <el-dropdown-item
                    icon="Delete"
                    @click.native="handleDelete(scope.row)"
                    v-hasPermi="['flow:flow_model:delete']"
                >删除</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
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
    <!-- 流程图 -->
     <el-dialog :title="processView.title" :visible.sync="processView.open" width="70%" append-to-body>
        <WorkflowProgressDiagram :key="diagramKey" ref="diagramRef" :activity-list="detailInfo?.activity_list || []" :xml="detailInfo?.xml || ''" />
    </el-dialog>
    <!-- 流程设计界面-->
    <el-dialog :title="designView.title" :visible.sync="designView.open" width="70%" append-to-body>
      <WorkflowVerDesigner :id="designView!.modelId" :bpmnXml="designView!.bpmnXml"  />
    </el-dialog>
    <!-- 添加或修改流程模型对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="modelRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="模型名称" prop="modelName">
          <el-input v-model="form.modelName" placeholder="请输入模型名称" />
        </el-form-item>
        <el-form-item label="流程分类" prop="category">
          <el-select
              v-model="form.category"
              placeholder="流程分类"
              clearable
              style="width: 240px"
          >
            <el-option
                v-for="item in flowCategory"
                :key="item.code"
                :label="item.name"
                :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="模型描述" prop="description">
          <el-input  type="textarea" v-model="form.description" placeholder="请输入模型描述" />
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

<script setup name="Model" lang="ts">
import { listModel, getModel, delModel, addModel, updateModel,getModelXml,depolyModel } from "@/api/flowable/model";
import {listCategory} from "@/api/flowable/category";
import WorkflowProgressDiagram from '@/components/Flowable/instance/WorkflowProgressDiagram'
import WorkflowVerDesigner from "@/components/Flowable/bpmn/designer.vue";
import {ElMessage} from "element-plus";
import {getCurrentInstance, ref, toRefs} from "vue";

const { proxy } = getCurrentInstance();
const modelList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const flowCategory = ref([]);
const insertFlag=ref(true);
const diagramKey = ref(1)
const detailInfo = ref<WorkflowInstanceDetailsResult>();
const diagramRef = ref<InstanceType<typeof WorkflowProgressDiagram>>();

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    modelId: null,
    modelName: null,
    modelKey: null,
    category: null,
    version: null,
    formType: null,
    formId: null,
    description: null,
    createTime: null,
    bpmnXml: null,
    content: null
  },
  rules: {
  },
  processView: {
    title: '',
    open: false,
    index: undefined,
    xmlData:"",
  },
  queryHistoryParams: {
    pageNum: 1,
    pageSize: 10,
    modelKey: null
  },
  designView:{
    title: '',
    open:false,
    modelId:undefined,
    bpmnXml:''
  }
});

const { queryParams, form, rules,processView,queryHistoryParams,designView } = toRefs(data);

/** 查询流程模型列表 */
function getList() {
  loading.value = true;
  listModel(queryParams.value).then(response => {
    modelList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

function getFlowCategory(){
  listCategory().then(res=>{
    console.log(res)
    flowCategory.value = res.rows;
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
    modelId: null,
    modelName: null,
    modelKey: null,
    category: null,
    version: null,
    formType: null,
    formId: null,
    description: null,
    createTime: null,
    bpmnXml: null,
    content: null
  };
  proxy.resetForm("modelRef");
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
  ids.value = selection.map(item => item.modelId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  //初始化模型标识
  let timestamp = (new Date()).valueOf();
  form.value = {
    modelId: 'flowable_'+timestamp,
    modelName: 'business_' + timestamp
  }
  insertFlag.value = true;
  open.value = true;
  title.value = "添加流程模型";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _modelId = row.modelId || ids.value
  getModel(_modelId).then(response => {
    insertFlag.value = false;
    form.value = response.data;
    open.value = true;
    title.value = "修改流程模型";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["modelRef"].validate(valid => {
    if (valid) {
      if (!insertFlag.value) {
        updateModel(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addModel(form.value).then(response => {
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
  const _modelIds = row.modelId || ids.value;
  proxy.$modal.confirm('是否确认删除流程模型编号为"' + _modelIds + '"的数据项？').then(function() {
    return delModel(_modelIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('flowable/model/export', {
    ...queryParams.value
  }, `model_${new Date().getTime()}.xlsx`)
}

/** 设计按钮操作 */
function handleDesign(row) {
  const _modelId = row.modelId
  getModelXml(_modelId).then(response => {
    designView.value={
      modelId:_modelId,
      open:true,
      title:'流程图设计',
      bpmnXml:response.data
    }
  });
}
/** 部署按钮操作 */
function handleDeploy(row) {
  depolyModel({
    modelId: row.modelId
  }).then(response => {
    if(response.data.code==200){
      ElMessage.message("部署成功!");
    }else{
      ElMessage.error('部署失败!');
    }
  });
}
/** 流程图查看按钮操作 */
function handleProcessView(row) {
  const _modelId = row.modelId
  diagramRef.value.init();
  getModelXml(_modelId).then(response => {
    processView.value={
      title:"流程图",
      index: _modelId,
      xmlData: response.data,
      open : true
    }
  });
}
/** 查看历史按钮操作 */
function handleHistory(row) {
  reset();
  const _modelId = row.modelId
  getModel(_modelId).then(response => {
    insertFlag.value = false;
    form.value = response.data;
    open.value = true;
    title.value = "修改流程模型";
  });
}
getList();
getFlowCategory();
</script>
