<template>
  <el-tabs type="border-card">
    <el-tab-pane label="私有字段">
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
              type="primary"
              plain
              icon="Plus"
              @click="handleAdd"
              v-hasPermi="['flowable:def:add']"
          >新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
              type="success"
              plain
              icon="Edit"
              :disabled="single"
              @click="handleUpdate"
              v-hasPermi="['flowable:def:edit']"
          >修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
              type="danger"
              plain
              icon="Delete"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['flowable:def:remove']"
          >删除</el-button>
        </el-col>
      </el-row>

      <el-table v-loading="loading" :data="privateFieldList" @selection-change="handleSelectionPrivateChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="数据库字段/表单字段" align="center" prop="field" />
        <el-table-column label="字段名/表单字段名" align="center" prop="label" />
        <el-table-column label="字段说明" align="center" prop="remark" />
        <el-table-column label="字段组件类型" align="center" prop="type" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-button link type="primary" icon="Edit" @click="handlePrivateUpdate(scope.row)" v-hasPermi="['flowable:def:edit']">修改</el-button>
            <el-button link type="primary" icon="Delete" @click="handlePrivateDelete(scope.row)" v-hasPermi="['flowable:def:remove']">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
    <el-tab-pane label="公共字段">
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
              type="primary"
              plain
              icon="Plus"
              @click="handleAdd"
              v-hasPermi="['flowable:def:add']"
          >引用</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
              type="danger"
              plain
              icon="Delete"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['flowable:def:remove']"
          >删除</el-button>
        </el-col>
      </el-row>

      <el-table v-loading="loading" :data="publicFieldList" @selection-change="handleSelectionPublicChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="数据库字段/表单字段" align="center" prop="field" />
        <el-table-column label="字段名/表单字段名" align="center" prop="label" />
        <el-table-column label="字段说明" align="center" prop="remark" />
        <el-table-column label="字段组件类型" align="center" prop="type" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-button link type="primary" icon="Delete" @click="handlePublicDelete(scope.row)" v-hasPermi="['flowable:def:remove']">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
    <el-tab-pane label="缺省字段">
      <el-table v-loading="loading" :data="defaultFieldList" >
        <el-table-column label="数据库字段/表单字段" align="center" prop="field" />
        <el-table-column label="字段名/表单字段名" align="center" prop="label" />
        <el-table-column label="字段说明" align="center" prop="remark" />
        <el-table-column label="字段组件类型" align="center" prop="type" />
      </el-table>
    </el-tab-pane>
  </el-tabs>
  <el-dialog :title="field.title" v-model="field.open" width="70%" >
    <el-scrollbar always>
      <el-form ref="formRef" :model="formData" label-width="100px" label-position="right" status-icon style="width: 100%">
        <el-divider content-position="left">基本信息</el-divider>
        <el-form-item prop="field" label="字段" required :rules="{ pattern: /^[a-zA-Z_][a-zA-Z0-9_]*$/, message: '必须以字母或下划线开头' }">
          <el-input v-model="formData.field" />
        </el-form-item>
        <el-form-item prop="label" label="标签" required>
          <el-input v-model="formData.label" />
        </el-form-item>
        <el-form-item prop="remark" label="说明">
          <el-input v-model="formData.remark" />
        </el-form-item>
        <el-form-item prop="width" label="宽度" required>
          <el-input-number v-model="formData.width" :min="1" :controls="false" style="width: 100%" />
        </el-form-item>
        <el-form-item prop="type" label="类型" required>
          <el-select v-model="formData.type" @change="v => formData.scheme.type = v" style="width: 100%">
            <el-option label="数字" value="number" />
            <el-option label="文本" value="text" />
            <el-option label="选项" value="option" />
            <el-option label="用户" value="user" />
            <el-option label="部门" value="dept" />
            <el-option label="时间" value="date" />
            <el-option label="时间范围" value="daterange" />
          </el-select>
        </el-form-item>
        <el-divider content-position="left">组件配置</el-divider>
        <component :form-data="formData" :is="schemeConfigComponentMap[formData.type]"/>

      </el-form>
    </el-scrollbar>
  </el-dialog>
</template>

<script lang="ts" setup>
import {markRaw, ref, watch} from "vue";
import * as refApi from "@/api/flowable/ref"
import {listAll} from "@/api/flowable/def"
import NumberSchemeConfig from "@/views/business/field/form/NumberSchemeConfig.vue";
import TextSchemeConfig from "@/views/business/field/form/TextSchemeConfig.vue";
import OptionSchemeConfig from "@/views/business/field/form/OptionSchemeConfig.vue";
import UserSchemeConfig from "@/views/business/field/form/UserSchemeConfig.vue";
import DeptSchemeConfig from "@/views/business/field/form/DeptSchemeConfig.vue";
import DateSchemeConfig from "@/views/business/field/form/DateSchemeConfig.vue";
import DateRangeSchemeConfig from "@/views/business/field/form/DateRangeSchemeConfig.vue";
interface Props {
  mkey: string,
  version: string
}

const props = defineProps<Props>()
const loading = ref(false)
const  privateFieldList = ref([])//私有字段列表
const  publicFieldList=ref([])//公共字段列表
const  defaultFieldList=ref([])//缺省字段列表
const privateIds = ref([]);
const privateSingle = ref(true);
const privateMultiple = ref(true);
const publicIds = ref([]);
const publicSingle = ref(true);
const publicMultiple = ref(true);
const schemeConfigComponentMap = ref({
  number: markRaw(NumberSchemeConfig),
  text: markRaw(TextSchemeConfig),
  option: markRaw(OptionSchemeConfig),
  user: markRaw(UserSchemeConfig),
  dept: markRaw(DeptSchemeConfig),
  date: markRaw(DateSchemeConfig),
  daterange: markRaw(DateRangeSchemeConfig),
})
const formData = ref({
  mkey: '',
  field: '',
  label: '',
  remark: '',
  width: 16,
  type: 'number',
  scope: '',
  scheme: {
    type: 'number'
  }
})
const field = ref({
  title:'',
  open:false
})
watch(
    () => [props.mkey, props.version],
    (newVal) => {
       loading.value = true
      //缺省字段列表为空,才查
      if(defaultFieldList.value.length==0){
        let queryParams1={module:'WORKFLOW',scope:'WORKFLOW_DEFAULT'}
        listAll(queryParams1).then(response=>{
          defaultFieldList.value = response.data;
        });
      }
      if(newVal!='' && typeof(newVal)!="undefined") {
        //查询私有的字段
        let queryParams={module:'WORKFLOW',mkey:newVal[1],version:newVal[2],scope:'WORKFLOW_PRIVATE'}
        refApi.listCombination(queryParams)
            .then(
                response => {
                  privateFieldList.value = response.data;
                  //loading.value = false;
                }
            )
        //查询公共字段
        queryParams={module:'WORKFLOW',mkey:newVal[1],version:newVal[2],scope:'GLOBAL'}
        refApi.listCombination(queryParams)
            .then(
                response => {
                  publicFieldList.value = response.data;
                  loading.value = false;
                }
            )
            .finally(() => loading.value = false)
      }else {
        loading.value = false
      }
    },
    {
      immediate: true,
    }
)
// 多选框选中数据
function handleSelectionPrivateChange(selection) {
  privateIds.value = selection.map(item => item.id);
  privateSingle.value = selection.length != 1;
  privateMultiple.value = !selection.length;
}

/** 新增按钮操作 */
function handlePrivateAdd() {
  reset();
  open.value = true;
  title.value = "添加流程字段定义";
}

/** 修改按钮操作 */
function handlePrivateUpdate(row) {
  reset();
  const _id = row.id || privateIds.value
  getDef(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改流程字段定义";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["defRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateDef(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addDef(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除流程字段定义编号为"' + _ids + '"的数据项？').then(function() {
    return delDef(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}
</script>

<style scoped>

</style>
