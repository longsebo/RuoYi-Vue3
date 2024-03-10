<template>
  <div class="app-container">
    <SearchForm/>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['business:application:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['business:application:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['business:application:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['business:application:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <ElPlusTable/>

    <!-- 添加或修改应用定义对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="applicationRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="应用编码" prop="applicationCode">
          <el-input v-model="form.applicationCode" placeholder="请输入应用编码" />
        </el-form-item>
        <el-form-item label="应用名称" prop="applicationName">
          <el-input v-model="form.applicationName" placeholder="请输入应用名称" />
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

<script setup name="Application">
import { listApplication, getApplication, delApplication, addApplication, updateApplication } from "@/api/business/application";
import SearchForm from '@/components/common/form/searchform/SearchForm.vue';
import ElPlusTable from '@/components/common/table/ElPlusTable.vue';
const { proxy } = getCurrentInstance();

const applicationList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
import {
  queryParamKey
} from "@/config/app.keys";
import {onMounted, ref} from "vue";
import bus from '@/event/bus'
const data = reactive({
  form: {},

  rules: {
  }
});

const { form, rules } = toRefs(data);
const queryParams = ref({})
onMounted(() => {
   bus.on(queryParamKey,(data) =>{
     console.log('queryParamKey:'+JSON.stringify(data.value));
     queryParams.value = data.value;
   })
})

/** 查询应用定义列表 */
function getList() {
  loading.value = true;
  //queryParams.value = readStorage(queryParamKey)
  console.log('inject queryParams:'+JSON.stringify(queryParams.value));
  listApplication(queryParams.value).then(response => {
    applicationList.value = response.rows;
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
    applicationName: null,
    remark: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null
  };
  proxy.resetForm("applicationRef");
}



/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加应用定义";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getApplication(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改应用定义";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["applicationRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateApplication(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addApplication(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除应用定义编号为"' + _ids + '"的数据项？').then(function() {
    return delApplication(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('business/application/export', {
    ...queryParams.value
  }, `application_${new Date().getTime()}.xlsx`)
}

getList();
</script>
