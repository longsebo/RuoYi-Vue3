<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="参数名称" prop="parameterName">
        <el-input
          v-model="queryParams.parameterName"
          placeholder="请输入参数名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="参数描述" prop="parameterDesc">
        <el-input
          v-model="queryParams.parameterDesc"
          placeholder="请输入参数描述"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="前端是否可见" prop="isFrontpageVisible" label-width="auto">
        <el-checkbox v-model="queryParams.isFrontpageVisible" label="前端是否可见" size="small" true-label="Y" false-label="N" />
      </el-form-item>
      <el-form-item label="参数格式" prop="parameterFormat">
        <el-input
          v-model="queryParams.parameterFormat"
          placeholder="请输入参数格式"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="参数类型" prop="parameterType">
        <el-select >
          <el-option v-for="item in parameter_type" :key="item.value" :value="item.value" :label="item.label"/>
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
          v-hasPermi="['business:parameter:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['business:parameter:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['business:parameter:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['business:parameter:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="parameterList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="参数名称" align="center" prop="parameterName" />
      <el-table-column label="参数描述" align="center" prop="parameterDesc" />
      <el-table-column label="前端是否可见" align="center" prop="isFrontpageVisible" :formatter="formatFrontPageVisible" />
      <el-table-column label="参数类型" align="center" prop="parameterType" :formatter="formatParameterType" />
      <el-table-column label="参数格式" align="center" prop="parameterFormat" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['business:parameter:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['business:parameter:remove']">删除</el-button>
          <el-button link type="primary" icon="Plus" @click="handleAddChild(scope.row)" v-hasPermi="['business:parameter:add']">添加下级参数</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      :total="total"
      :page-count="queryParams.pageNum"
      :page-size="queryParams.pageSize"
      @change ="getList"
    />

    <!-- 添加或修改接口参数对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="parameterRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="参数名称" prop="parameterName">
          <el-input v-model="form.parameterName" placeholder="请输入参数名称" />
        </el-form-item>
        <el-form-item label="参数描述" prop="parameterDesc">
          <el-input v-model="form.parameterDesc" placeholder="请输入参数描述" />
        </el-form-item>
        <el-form-item label="前端是否可见" prop="isFrontpageVisible" label-width="auto">
          <el-checkbox v-model="queryParams.isFrontpageVisible" label="前端是否可见" size="small" true-label="Y" false-label="N"/>
        </el-form-item>
        <el-form-item label="参数类型" prop="parameterType">
          <el-select v-model="form.parameterType" >
            <el-option v-for="item in parameter_type" :key="item.value" :value="item.value" :label="item.label"/>
          </el-select>
        </el-form-item>
        <el-form-item label="参数格式" prop="parameterFormat">
          <el-input v-model="form.parameterFormat" placeholder="请输入参数格式" />
        </el-form-item>
        <el-form-item label="父参数" prop="parentName">
          <el-input v-model="form.parentName" readonly="true" />
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

<script setup name="Parameter" lang="ts">
import { parameterTreeSelect, getParameter, delParameter, addParameter, updateParameter } from "@/api/business/parameter";
import {watch, onBeforeMount} from "vue";

const { proxy } = getCurrentInstance();
interface Props {
  interfaceCode: string
}
const parameterList = ref([]);
const open = ref(false);
const loading = ref(false);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const props = defineProps<Props>()
const { parameter_type } = proxy.useDict("parameter_type");
const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    parameterName: null,
    parameterDesc: null,
    isFrontpageVisible: '',
    parameterType: null,
    parameterFormat: null,
    parentId: null,
    interfaceCode:null
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询接口参数列表 */
async function getList() {
  if(loading.value){
    return;
  }
 try{
  loading.value = true;
  debugger;
  console.log('props.interfaceCode:'+props.interfaceCode)
  queryParams.value.interfaceCode = props.interfaceCode;
  let response = await parameterTreeSelect(queryParams.value)
  parameterList.value = response.rows;
  total.value = response.total;
  loading.value = false;
  }
  catch(err) {
    console.log(err)
  }finally {
   loading.value = false;
  }
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
    parameterName: null,
    parameterDesc: null,
    isFrontpageVisible: 'Y',
    parameterType: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    parameterFormat: null,
    parentId: null,
    parentName:null
  };
  proxy.resetForm("parameterRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  debugger;
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
  title.value = "添加接口参数";
}
/**添加下级参数 */
function handleAddChild(row){
  reset();
  form.value.parentId = row.id
  form.value.parentName = row.parameterName
  open.value = true;
  title.value = "添加接口下级参数";
}
/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getParameter(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改接口参数";
  });
}

/** 提交按钮 */
function submitForm() {
  form.value.interfaceCode = props.interfaceCode
  proxy.$refs["parameterRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateParameter(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addParameter(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除接口参数编号为"' + _ids + '"的数据项？').then(function() {
    return delParameter(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('business/parameter/export', {
    ...queryParams.value
  }, `parameter_${new Date().getTime()}.xlsx`)
}
watch(() => props.interfaceCode, () => {
  getList()
})
/**
 * 翻译前端是否可见
 * @param row
 * @param column
 * @returns {*|string}
 */
function  formatFrontPageVisible(row, column){
  if(row.isFrontpageVisible=='Y'){
    return '是'
  }else{
    return '否';
  }
}
/**
 * 翻译参数类型
 * @param row
 * @param column
 * @returns {*|string}
 */
function  formatParameterType(row, column){
  return parameter_type.value.find(k => k.value === row.parameterType)?.label ?? '';
}
getList();
</script>
