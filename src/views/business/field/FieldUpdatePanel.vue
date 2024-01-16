<template>
  <div v-loading="loading" style="background-color: var(--el-bg-color); width: 100%; height: 100%;">
    <div style="box-sizing: border-box; padding: 6px;background-color: var(--toolbar-bg-color); ">
      <el-button @click="handleCancel">取消</el-button>
      <el-button @click="handleConfirm" type="primary" plain>确定</el-button>
    </div>
    <div style="width: calc(100% - 12px); max-width: 800px; height: calc(100% - 32px - 12px); padding: 6px;">
      <el-scrollbar always>
        <el-form ref="formRef" :model="formData" label-width="100px" :label-position="formLabelPosition" status-icon style="width: 100%">
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
          <el-form-item prop="fieldType" label="类型">
            <el-select v-model="formData.fieldType" @change="v => formData.scheme.type = v" >
              <el-option label="数字" value="number" />
              <el-option label="文本" value="text" />
              <el-option label="选项" value="option" />
              <el-option label="用户" value="user" />
              <el-option label="部门" value="dept" />
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
import { ElForm, ElFormItem, ElButton, ElInput, ElInputNumber, ElScrollbar, ElSelect, ElOption } from "element-plus";
import {inject, ref, markRaw, watch} from "vue";
import {updateField} from '@/api/business/field.js'
import NumberSchemeConfig from "./form/NumberSchemeConfig.vue";
import TextSchemeConfig from "./form/TextSchemeConfig.vue";
import OptionSchemeConfig from "./form/OptionSchemeConfig.vue";
import UserSchemeConfig from "./form/UserSchemeConfig.vue";
import DeptSchemeConfig from "./form/DeptSchemeConfig.vue";
import { formLabelPosition } from "@/store/layout";

const schemeConfigComponentMap = {
  number: markRaw(NumberSchemeConfig),
  text: markRaw(TextSchemeConfig),
  option: markRaw(OptionSchemeConfig),
  user: markRaw(UserSchemeConfig),
  dept: markRaw(DeptSchemeConfig),
}

interface Props {
  field: ModelingFieldDefView
}

const props = defineProps<Props>()

interface Emits {
  (e: 'close'): void
  (e: 'success'): void
}

const emits = defineEmits<Emits>()

const formData = ref<ModelingFieldUpdateParam>({
  id: props.field.id,
  ffieldRemark: props.field.ffieldRemark,
  fieldWidth: props.field.fieldWidth,
  fieldType:props.field.fieldType,
  scheme: props.field.scheme,
  fieldEnName:props.field.fieldEnName,
  fieldCnName:props.field.fieldCnName,
})
watch(() => props.field, val => {
  // debugger;
  formData.value = {
    id: val.id,
    ffieldRemark: val.ffieldRemark,
    fieldWidth: val.fieldWidth,
    fieldType:val.fieldType,
    scheme: val.scheme,
    fieldEnName:val.fieldEnName,
    fieldCnName:val.fieldCnName,
  }
  // console.log('val:'+JSON.stringify(val))
  // console.log('formData:'+JSON.stringify(formData.value))
});
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
  const result = await updateField(formData.value)
  if (result.code==200) {
    emits('close')
    emits('success')
  }
}
</script>

<style scoped>
:deep(.el-input-number .el-input__inner) {
  text-align: left;
}
</style>
