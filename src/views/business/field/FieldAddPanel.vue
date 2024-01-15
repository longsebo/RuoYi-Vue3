<template>
  <div v-loading="loading" style="background-color: var(--el-bg-color); width: 100%; height: 100%;">
    <div style="box-sizing: border-box; padding: 6px; background-color: var(--toolbar-bg-color); ">
      <el-button @click="handleCancel">取消</el-button>
      <el-button @click="handleConfirm" type="primary" plain>确定</el-button>
    </div>
    <div style="width: calc(100% - 12px); max-width: 800px; height: calc(100% - 32px - 12px); padding: 6px;">
      <el-scrollbar always>
        <el-form ref="formRef" :model="formData" label-width="100px" :label-position="formLabelPosition" status-icon style="width: 100%">
          <el-divider content-position="left">基本信息</el-divider>
          <el-form-item prop="fieldEnName" label="字段" required :rules="{ pattern: /^[a-zA-Z_][a-zA-Z0-9_]*$/, message: '必须以字母或下划线开头' }">
            <el-input v-model="formData.fieldEnName" />
          </el-form-item>
          <el-form-item prop="fieldCnName" label="标签" required>
            <el-input v-model="formData.fieldCnName" />
          </el-form-item>
          <el-form-item prop="ffieldRemark" label="说明">
            <el-input v-model="formData.ffieldRemark" />
          </el-form-item>
          <el-form-item prop="fieldWidth" label="宽度" required>
            <el-input-number v-model="formData.fieldWidth" :min="1" :controls="false" style="width: 100%" />
          </el-form-item>
          <el-form-item prop="fieldType" label="类型" required>
            <el-select v-model="formData.fieldType" @change="v => formData.scheme.type = v" style="width: 100%">
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
          <component :form-data="formData" :is="schemeConfigComponentMap[formData.fieldType]"/>

        </el-form>
      </el-scrollbar>
    </div>

  </div>
</template>

<script lang="ts" setup>
import { ElForm, ElFormItem, ElButton, ElInput, ElInputNumber, ElSelect, ElOption, ElScrollbar, ElDivider } from "element-plus";
import { markRaw, ref } from "vue";
import type { Component } from "vue";
import NumberSchemeConfig from "./form/NumberSchemeConfig.vue";
import TextSchemeConfig from "./form/TextSchemeConfig.vue";
import OptionSchemeConfig from "./form/OptionSchemeConfig.vue";
import UserSchemeConfig from "./form/UserSchemeConfig.vue";
import DeptSchemeConfig from "./form/DeptSchemeConfig.vue";
import DateSchemeConfig from "./form/DateSchemeConfig.vue";
import DateRangeSchemeConfig from "./form/DateRangeSchemeConfig.vue";
import {addField} from '@/api/business/field.js'
import {useFieldStore} from "@/store/field-config";
import { formLabelPosition } from "@/store/layout";

interface Emits {
  (e: 'close'): void
  (e: 'success'): void
}

const emits = defineEmits<Emits>()

const store = useFieldStore()

// @ts-ignore
const formData = ref<ModelingFieldAddParam>({
  mkey: store.mkey,
  fieldEnName: '',
  fieldCnName: '',
  ffieldRemark: '',
  fieldWidth: 16,
  fieldType: 'number',
  scope: store.scope,
  scheme: {
    type: 'number'
  }
})

const schemeConfigComponentMap: Record<FieldType, Component> = {
  number: markRaw(NumberSchemeConfig),
  text: markRaw(TextSchemeConfig),
  option: markRaw(OptionSchemeConfig),
  user: markRaw(UserSchemeConfig),
  dept: markRaw(DeptSchemeConfig),
  date: markRaw(DateSchemeConfig),
  daterange: markRaw(DateRangeSchemeConfig),
}


function handleCancel() {
  emits('close')
}

const loading = ref(false)

const formRef = ref<InstanceType<typeof ElForm>>()
async function handleConfirm() {
  try {
    await formRef.value?.validate()
  } catch (e) {
    console.error(e);
    return
  }

  formData.value.scope = store.scope
  const result = await addField(formData.value)
  if (result.code ==200) {
    //清空form
    resetForm();
    emits('close')
    emits('success')
  }
}
function resetForm(){
  formData.value.mkey=store.mkey;
  formData.value.fieldEnName= '';
  formData.value.fieldCnName= '';
  formData.value.ffieldRemark= '';
  formData.value.fieldWidth= 16;
  formData.value.fieldType= 'number';
  formData.value.scope= store.scope;
  formData.value.scheme= {
      type: 'number'
  }
}
</script>

<style scoped>
:deep(.el-input-number .el-input__inner) {
  text-align: left;
}
</style>
