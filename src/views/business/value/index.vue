<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="返回值名称" prop="returnName" label-width="auto">
        <el-input
          v-model="queryParams.returnName"
          placeholder="请输入返回值名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="返回值描述" prop="returnDesc" label-width="auto">
        <el-input
          v-model="queryParams.returnDesc"
          placeholder="请输入返回值描述"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="前端是否可见" prop="isFrontpageVisible" label-width="auto">
        <el-checkbox v-model="queryParams.isFrontpageVisible" true-label="Y" false-label="N" />
      </el-form-item>
      <el-form-item label="返回值格式" prop="returnFormat" label-width="auto">
        <el-input
          v-model="queryParams.returnFormat"
          placeholder="请输入返回值格式"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="返回值类型" prop="returnType">
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
          v-hasPermi="['business:value:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['business:value:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['business:value:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['business:value:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="valueList" @selection-change="handleSelectionChange" row-key="id">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="返回值名称" align="center" prop="returnName" />
      <el-table-column label="返回值描述" align="center" prop="returnDesc" />
      <el-table-column label="前端是否可见" align="center" prop="isFrontpageVisible" :formatter="formatFrontPageVisible" />
      <el-table-column label="返回值类型" align="center" prop="returnType" :formatter="formatParameterType" />
      <el-table-column label="返回值格式" align="center" prop="returnFormat" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['business:value:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['business:value:remove']">删除</el-button>
          <el-button link type="primary" icon="Plus" @click="handleAddChild(scope.row)" v-hasPermi="['business:value:add']">下级参数</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page-count="queryParams.pageNum"
      :page-size="queryParams.pageSize"
      @change="getList"
    />

    <!-- 添加或修改接口返回值对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="valueRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="返回值名称" prop="returnName" label-width="auto">
          <el-input v-model="form.returnName" placeholder="请输入返回值名称" />
        </el-form-item>
        <el-form-item label="返回值描述" prop="returnDesc" label-width="auto">
          <el-input v-model="form.returnDesc" placeholder="请输入返回值描述" />
        </el-form-item>
        <el-form-item label="前端是否可见" prop="isFrontpageVisible" label-width="auto">
          <el-checkbox v-model="form.isFrontpageVisible"  size="small" true-label="Y" false-label="N"/>
        </el-form-item>
        <el-form-item label="返回值类型" prop="returnType" label-width="auto">
          <el-select v-model="form.returnType" >
            <el-option v-for="item in parameter_type" :key="item.value" :value="item.value" :label="item.label"/>
          </el-select>
        </el-form-item>
        <el-form-item label="返回值格式" prop="returnFormat" label-width="auto">
          <el-input v-model="form.returnFormat" placeholder="请输入返回值格式" />
        </el-form-item>
        <el-form-item label="父参数" prop="parentName">
          <el-input v-model="form.parentName" :readonly="true" />
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

<script setup name="Value" lang="ts">
import { returnValTreeSelect, getValue, delValue, addValue, updateValue } from "@/api/business/value";
import {toRefs, watch} from "vue";
interface Props {
  interfaceCode: string
}
const { proxy } = getCurrentInstance();

const valueList = ref([]);
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
    returnName: null,
    returnDesc: null,
    isFrontpageVisible: null,
    returnType: null,
    returnFormat: null,
    parentId: null,
    interfaceCode:null
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询接口返回值列表 */
async function getList() {
  loading.value = true;
  queryParams.value.interfaceCode = props.interfaceCode;
  let response = await returnValTreeSelect(queryParams.value)
  valueList.value = response.rows;
  total.value = response.total;
  loading.value = false;
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
    returnName: null,
    returnDesc: null,
    isFrontpageVisible: null,
    returnType: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    returnFormat: null,
    parentId: null
  };
  proxy.resetForm("valueRef");
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
  title.value = "添加接口返回值";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getValue(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改接口返回值";
  });
}

/** 提交按钮 */
function submitForm() {
  form.value.interfaceCode = props.interfaceCode
  proxy.$refs["valueRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateValue(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addValue(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除接口返回值编号为"' + _ids + '"的数据项？').then(function() {
    return delValue(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('business/value/export', {
    ...queryParams.value
  }, `value_${new Date().getTime()}.xlsx`)
}
/**添加下级参数 */
function handleAddChild(row){
  reset();
  form.value.parentId = row.id
  form.value.parentName = row.returnName
  open.value = true;
  title.value = "添加接口下级参数";
}
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
 * 翻译返回值类型
 * @param row
 * @param column
 * @returns {*|string}
 */
function  formatParameterType(row, column){
  return parameter_type.value.find(k => k.value === row.returnType)?.label ?? '';
}
watch(() => props.interfaceCode, () => {
  getList()
})
getList();

</script>
