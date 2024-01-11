<template>
  <el-tabs type="border-card" class="modeling-tabs" style="height: 100%">
    <el-tab-pane label="基本信息">
      <EntityUpdatePanel @close="emits('close')" />
    </el-tab-pane>
    <el-tab-pane label="字段">
      <FieldPanel/>
      <div id="field-container"></div>
    </el-tab-pane>
  </el-tabs>

</template>

<script lang="ts" setup>
import { ElTabs, ElTabPane } from "element-plus";
import EntityUpdatePanel from "./EntityUpdatePanel.vue";
import FieldPanel from "@/views/business/field/FieldPanel.vue";
import { inject } from "vue";
//import { modelingEntityKey } from "./keys";
import {useFieldStore} from "@/store/field-config";
import {modelingEntityKey} from "../../modeling/keys";

interface Emits {
  (e: 'close'): void
}

const emits = defineEmits<Emits>()


const entityRow = inject(modelingEntityKey)

const store = useFieldStore()

</script>

<style scoped>
.el-tabs.modeling-tabs>:deep(.el-tabs__content) {
  /* header = 39px; padding = 15 * 2 = 30px */
  height: calc(100% - 69px);
}

:deep(.el-tab-pane) {
  height: 100%;
}

</style>
