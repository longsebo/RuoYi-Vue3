<template>
  <div class="app-container">
    <div style="box-sizing: border-box; padding: 6px 0; ">
      <el-button type="primary" plain :icon="Plus" @click="handleAdd">新增</el-button>
      <span style="color: red; font-weight: bold; margin-left: 10px;">右键编辑字段</span>
    </div>
    <el-tabs v-model="activieTable" type="border-card" style="width: 100%; height:95vh;" >
      <el-tab-pane name="ENTITY_DEFAULT" label="实体默认字段">
        <field-table @edit="row => handleEditField('ENTITY_DEFAULT', row)" @delete="row => handleDeleteField('ENTITY_DEFAULT', row)" :loading="loading" :data="defaultEntityFields" />
      </el-tab-pane>
      <el-tab-pane name="WORKFLOW_DEFAULT" label="流程默认字段">
        <field-table @edit="row => handleEditField('WORKFLOW_DEFAULT', row)" @delete="row => handleDeleteField('WORKFLOW_DEFAULT', row)" :loading="loading" :data="defaultWorkflowFields" />
      </el-tab-pane>
      <el-tab-pane name="GLOBAL" label="全局字段">
        <field-table @edit="row => handleEditField('GLOBAL', row)" @delete="row => handleDeleteField('GLOBAL', row)" :loading="loading" :data="globalFields" />
        <div id="field-container"></div>
      </el-tab-pane>
    </el-tabs>


      <el-dialog title="新增字段" v-model="visible" width="70%"  height="95vh" append-to-body>
      <FieldAddPanel @close="visible = false" @success="loadFields" />
      </el-dialog>
      <el-dialog title="修改字段" v-model="updatePanelVisible" width="70%"  height="95vh" append-to-body>
        <field-update-panel :scope="activieTable" :field="sourceField" @close="updatePanelVisible = false" @success="loadFields" />
      </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { ElTabs, ElTabPane, ElButton, ElMessage } from "element-plus";
import { onBeforeMount, ref } from "vue";
import FieldTable from "./FieldTable.vue";
import { Plus } from "@element-plus/icons-vue";
import MaskWindow from "@/components/dialog/MaskWindow.vue";
import FieldAddPanel from "./FieldAddPanel.vue";
import FieldUpdatePanel from "./FieldUpdatePanel.vue";
import {listAllField,delField} from '@/api/business/field.js'
import {useFieldStore} from "@/store/field-config";

const store = useFieldStore()

const loading = ref(false)
const defaultEntityFields=ref([])
const defaultWorkflowFields =ref([])
const globalFields = ref([])
const activieTable =ref('ENTITY_DEFAULT')

onBeforeMount(loadFields)
async function loadFields() {
  let searchParam={
    scope:'ENTITY_DEFAULT'
  }
  loading.value = true;
  let resp={};
  resp = await listAllField(searchParam)
  defaultEntityFields.value = resp.data;
  console.log('defaultEntityFields:'+JSON.stringify(defaultEntityFields.value))
  searchParam.scope = "WORKFLOW_DEFAULT";
  resp =  await listAllField(searchParam)
  defaultWorkflowFields.value = resp.data
  console.log('defaultWorkflowFields:'+JSON.stringify(defaultWorkflowFields.value))
  searchParam.scope="GLOBAL"
  resp = await listAllField(searchParam)
  globalFields.value = resp.data
  console.log('globalFields:'+JSON.stringify(globalFields.value))
  loading.value = false;
}

const visible = ref(false)
function handleAdd() {
  store.scope = activieTable.value;
  console.log('activieTable:'+activieTable.value+',store.scope:'+store.scope)
  visible.value = true
}


const updatePanelVisible = ref(false)
const sourceField = ref<ModelingFieldDefView>()
async function handleEditField(scope: FieldScope, row: ModelingFieldDefView) {
  // if (scope === 'GLOBAL') {
    sourceField.value = row
    updatePanelVisible.value = true
  // }
  // else if (['ENTITY_DEFAULT', 'WORKFLOW_DEFAULT'].includes(scope)) {
  //   ElMessage.warning('默认字段无法编辑')
  // }
}

async function handleDeleteField(scope: FieldScope, row: ModelingFieldDefView) {
  // if (scope === 'GLOBAL') {
    const result = await delField(row.id)
    if (result.code ==200) {
      let searchParam:{
        scope:'GLOBAL'
      }
      let resp = [];
      resp = await listAllField(searchParam)
      if(scope==='GLOBAL') {
        globalFields.value = resp.data
      }else if(scope==='ENTITY_DEFAULT'){
        defaultEntityFields.value = resp.data
      }else if(scope ==='WORKFLOW_DEFAULT'){
        defaultWorkflowFields.value = resp.data
      }
    }
  // }
  // else if (['ENTITY_DEFAULT', 'WORKFLOW_DEFAULT'].includes(scope)) {
  //   ElMessage.warning('默认字段无法删除')
  // }

}

</script>

<style scoped>
:deep(.el-tabs__content) {
  height: calc(100% - 69px);
}

:deep(.el-tab-pane) {
  height: calc(100%);
}
</style>
