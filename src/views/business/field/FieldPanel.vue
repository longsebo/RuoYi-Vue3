<template>
  <div v-loading="loading" style="background-color: var(--el-bg-color); width: 100%; height: 100%; box-sizing: border-box;">
    <div style="background-color: var(--toolbar-bg-color); box-sizing: border-box; padding: 6px;">
        <span style="color: red; font-weight: bold; margin-left: 10px;">右键编辑字段</span>
    </div>
    <div style="width: 100%; height: calc(100% - 44px); ">
      <el-tabs  type="border-card" style="height:95vh;">
        <el-tab-pane label="私有字段">
          <el-button :icon="Plus" plain type="primary" @click="handleAddField">新增</el-button>
          <field-table @edit="handleEditField" @delete="handleDeleteField" :loading="loading" :data="privateFields" />
        </el-tab-pane>
        <el-tab-pane label="公共字段">
          <el-button :icon="Link" @click="handleRefField">引用</el-button>
          <field-table @edit="handleEditGlobalField" @delete="handleUnrefField" :loading="loading" :data="selectedGlobalFields" />
        </el-tab-pane>
        <el-tab-pane label="默认字段">
          <field-table @edit="ElMessage.warning('默认字段不允许编辑')" @delete="ElMessage.error('默认字段不允许删除')" :loading="loading" :data="defaultFields" />
        </el-tab-pane>
      </el-tabs>

        <mask-window v-model="refVisible" teleport-to="#field-container">
        <el-form ref="formRef" :model="formData" label-width="100px">
          <el-form-item prop="extModelFieldId" label="全局字段" required>
            <el-select v-model="formData.extModelFieldId">
              <el-option
                v-for="field in globalFields"
                :key="field.id"
                :label="field.fieldCnName"
                :value="field.id"
                :disabled="selectedGlobalFields.map(it => it.id).includes(field.id)"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
              <el-button @click="refVisible = false">取消</el-button>
              <el-button plain type="primary" @click="handleConfirmRef">确定</el-button>
          </el-form-item>
        </el-form>
        </mask-window>

    </div>

    <mask-window v-model="visible" teleport-to="#field-container">
      <field-add-panel v-bind="$props" @close="visible = false" @success="loadFields" />
    </mask-window>
    <mask-window v-model="updatePanelVisible" teleport-to="#field-container">
      <field-update-panel :field="sourceField" @close="updatePanelVisible = false" @success="loadFields" />
    </mask-window>
  </div>
</template>

<script lang="ts" setup>
import {computed, inject, onBeforeMount, ref} from 'vue';
import { ElButton, ElTabs, ElTabPane, ElSelect, ElOption, ElForm, ElFormItem, ElMessage } from "element-plus";
import { Plus, Link } from "@element-plus/icons-vue";
import MaskWindow from '@/components/dialog/MaskWindow.vue';
import FieldAddPanel from '@/views/business/field/FieldAddPanel.vue';
import FieldTable from './FieldTable.vue';
import FieldUpdatePanel from '@/views/business/field/FieldUpdatePanel.vue';
import {listModelField,listAllField,removeByExtModelField,delField} from "@/api/business/field.js"
import {addRef} from "@/api/business/ref.js"


const loading = ref<boolean>(false)
const visible = ref(false)
import {modelingEntityKey} from "../../modeling/keys";
import {useFieldStore} from "../../../store/field-config";
const entity = inject(modelingEntityKey)!
const modelingFields = ref([]);
const store = useFieldStore()
const globalFields = ref([]);


const defaultFields = computed(() => {
  if (entity.value.tableType=='02') {
    return modelingFields.value.filter(it => it.scope === 'WORKFLOW_DEFAULT')
  } else {
    return modelingFields.value.filter(it => it.scope === 'ENTITY_DEFAULT')
  }
})
const privateFields = computed(() => {
   return modelingFields.value.filter(it => it.scope === 'PRIVATE')
})

const selectedGlobalFields = computed(() => modelingFields.value.filter(it => it.scope === 'GLOBAL'))

onBeforeMount(loadFields)
async function loadFields() {
  loading.value = true;
  let parameter = {
    'datasourceName': entity.value.datasourceName,
    'enName': entity.value.enName
  }
  let temp = await listModelField(parameter);
  modelingFields.value = temp.data;
  loading.value = false;
}


function handleAddField() {
  visible.value = true
  store.scope = 'PRIVATE'
  store.enName = entity.value.enName
  store.datasourceName = entity.value.datasourceName
}

const refVisible = ref(false)
async function handleRefField() {
  let parameter={
    'scope':'GLOBAL'
  }
  let temp = await listAllField(parameter)
  globalFields.value = temp.data;
  refVisible.value = true
}

const formData = ref<ModelingFieldRefParam>({
  datasourceName:entity.value.datasourceName,
  enName:entity.value.enName,
  field_id: '',
})

const formRef = ref<InstanceType<typeof ElForm>>()
async function handleConfirmRef() {
  try {
    await formRef.value?.validate()
  } catch (e) {
    return
  }
  formData.value.scope='GLOBAL';
  const result = await addRef(formData.value)
  if (result.code==200) {
    await loadFields()
    formData.value.extModelFieldId = ''
    refVisible.value = false
  }

}


const updatePanelVisible = ref(false)
const sourceField = ref<ModelingFieldDefView>()
function handleEditField(row: ModelingFieldDefView) {
  sourceField.value = row
  console.log('update field', row)
  updatePanelVisible.value = true
}

async function handleDeleteField(row: ModelingFieldDefView) {
  await delField(row.id)
  loadFields()
}

async function handleUnrefField(row: ModelingFieldDefView) {
   let parameter={
     'datasourceName':entity.value.datasourceName,
     'enName':entity.value.enName,
     'id':row.id
   }
   await removeByExtModelField(parameter);
   loadFields()
}

function handleEditGlobalField() {
  ElMessage.warning('公共字段无法编辑')
}

</script>

<style scoped>
:deep(.el-tabs--border-card>.el-tabs__content) {
  box-sizing: border-box;
  height: calc(100% - 39px);
}
</style>
