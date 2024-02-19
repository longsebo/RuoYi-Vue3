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
      <el-form-item label="接口别名" prop="interfaceAlias">
        <el-input
          v-model="queryParams.interfaceAlias"
          placeholder="请输入接口别名"
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
          v-hasPermi="['business:pageInterface:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['business:pageInterface:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['business:pageInterface:remove']"
        >删除</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="pageInterfaceRefList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="接口名称" align="center" prop="interfaceCode" :formatter="formatInterfaceCode" />
      <el-table-column label="接口别名" align="center" prop="interfaceAlias" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['business:pageInterface:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['business:pageInterface:remove']">删除</el-button>
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

    <!-- 添加或修改页面接口关系对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="interfaceRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="接口编码" prop="interfaceCode">
          <el-tree-select
              v-model="form.interfaceCode"
              :data="treeInterface"
              :render-after-expand="false"
              style="width: 240px"
          />
        </el-form-item>
        <el-form-item label="接口别名" prop="interfaceAlias">
          <el-input v-model="form.interfaceAlias" placeholder="请输入接口别名" />
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

<script setup name="Interface" lang="ts">
import { tree,listInterfaceAll } from "@/api/business/interface";
import {listInterface as listPageInterfaceRela,addInterface as addPageInterfaceRela,
    getInterface as getPageInterfaceRela,
  delInterface as delPageInterfaceRela,updateInterface as updatePageInterfaceRela} from "@/api/business/pageInterfacerela";

import {getCurrentInstance, reactive, ref} from "vue";

const { proxy } = getCurrentInstance();

const pageInterfaceRefList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const interfaceList = ref([])
const treeInterface = ref([])
interface Props {
  pageCode: string
}
const props = defineProps<Props>()
const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    pageCode: null,
    interfaceCode: null,
    interfaceAlias: null,
  },
  rules: {
    pageCode: [
      { required: true, message: "页面编码不能为空", trigger: "blur" }
    ],
    interfaceCode: [
      { required: true, message: "接口编码不能为空", trigger: "blur" }
    ],
    interfaceAlias: [
      { required: true, message: "接口别名不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询页面接口关系列表 */
function getList() {
  loading.value = true;
  queryParams.value.pageCode = props.pageCode;
  listPageInterfaceRela(queryParams.value).then(response => {
    pageInterfaceRefList.value = response.rows;
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
    pageCode: null,
    interfaceCode: null,
    interfaceAlias: null,
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
  title.value = "添加页面接口关系";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getPageInterfaceRela(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改页面接口关系";
  });
}

/** 提交按钮 */
function submitForm() {
  form.value.pageCode = props.pageCode
  proxy.$refs["interfaceRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updatePageInterfaceRela(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addPageInterfaceRela(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除页面接口关系编号为"' + _ids + '"的数据项？').then(function() {
    return delPageInterfaceRela(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}
/** 翻译接口编码为接口名称 */
function formatInterfaceCode(row,column){
  return interfaceList.value.find(k => k.interfaceCode === row.interfaceCode)?.interfaceName ?? '';
}
/** 获取接口列表 */
function getInterfaceList(){
  let tmp={};
  listInterfaceAll(tmp).then(response => {
    interfaceList.value = response.data;
  });
}
/** 获取接口树列表 */
function getTreeInterface(){
  let tmp={};
  tree(tmp).then(response => {
    treeInterface.value = response.data;
  });
}

getList();
getInterfaceList();
getTreeInterface();
</script>
