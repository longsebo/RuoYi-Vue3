<template>
  <ElTabs type="border-card" style="width: 100%; height: 100%;" v-model="activePane">
    <el-tab-pane label="组件属性" name="component" style="width: 100%; height: 100%;">
      <el-scrollbar always>
        <el-collapse v-model="openedItems" style="padding: 0 6px">
          <el-collapse-item name="form-item" title="FormItem配置" v-show="vFormSelectElem?.category === 'form-item'">
            <el-form
              v-if="vFormSelectElem?.formItemAttrs"
              :model="vFormSelectElem?.formItemAttrs"
              label-position="left"
              label-width="120px"
              style="padding: 5px;"
            >
              <el-form-item prop="id" label="字段名">
                <el-input type="text" v-model="vFormSelectElem.id"></el-input>
              </el-form-item>
              <el-form-item prop="label" label="标签文本" required>
                <el-input v-model="vFormSelectElem.formItemAttrs.label"></el-input>
              </el-form-item>
              <el-form-item prop="hiddenLabel" label="隐藏标签">
                <el-radio-group v-model="vFormSelectElem.formItemAttrs.hiddenLabel">
                  <el-radio-button :value="true">是</el-radio-button>
                  <el-radio-button :value="false">否</el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-divider content-position="left">数据校验</el-divider>
              <el-form-item prop="required" label="是否必填">
                <el-radio-group v-model="vFormSelectElem.formItemAttrs.required">
                  <el-radio-button :value="true">是</el-radio-button>
                  <el-radio-button :value="false">否</el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item v-if="vFormSelectElem.formItemAttrs.required" prop="requiredMessage" label="未填提示">
                <el-input v-model="vFormSelectElem.formItemAttrs.requiredMessage" />
              </el-form-item>

            </el-form>
          </el-collapse-item>
          <el-collapse-item name="component" title="组件配置">
            <component :is="configMap[vFormSelectElem?.component]" />
          </el-collapse-item>
        </el-collapse>
      </el-scrollbar>
    </el-tab-pane>
    <el-tab-pane label="表单属性" name="form" style="width: 100%; height: 100%;">
      <el-scrollbar always>
        <form-config/>
      </el-scrollbar>
    </el-tab-pane>
  </ElTabs>
</template>

<script lang="ts" setup>
import {
  ElScrollbar, ElTabs, ElTabPane, ElCollapse, ElRadioGroup, ElRadioButton,
  ElCollapseItem, ElForm, ElFormItem, ElInput, ElDivider,
} from 'element-plus'
import { inject, markRaw, ref } from "vue";
import { vFormActiveElementKey } from "@/components/form/state.key";
import NumberInputConfig from "@/components/form/designer/config/NumberInputConfig.vue";
import TextInputConfig from "@/components/form/designer/config/TextInputConfig.vue";
import SingleSelectConfig from "@/components/form/designer/config/SingleSelectConfig.vue";
import MultiSelectConfig from "@/components/form/designer/config/MultiSelectConfig.vue";
import RowConfig from "@/components/form/designer/config/RowConfig.vue";
import ColConfig from "@/components/form/designer/config/ColConfig.vue";
import DateConfig from "@/components/form/designer/config/DateConfig.vue";
import DateRangeConfig from "@/components/form/designer/config/DateRangeConfig.vue";
import UserSelectorInputConfig from "@/components/form/designer/config/UserSelectorInputConfig.vue";
import DeptSelectorInputConfig from "@/components/form/designer/config/DeptSelectorInputConfig.vue";
import FormConfig from "@/components/form/designer/config/FormConfig.vue";
import LabelField from "@/components/form/components/display/LabelField.vue";
import LabelFieldConfig from "@/components/form/designer/config/LabelFieldConfig.vue";
import NormalButtonConfig from "@/components/form/designer/config/NormalButtonConfig.vue";
import DropdownSelectConfig from "@/components/form/designer/config/DropdownSelectionConfig.vue";
import AgGridConfig from  "@/components/form/designer/config/AgGridConfig.vue";
import SearchButtonConfig from "@/components/form/designer/config/SearchButtonConfig.vue";

import ResetButtonConfig from "@/components/form/designer/config/ResetButtonConfig.vue";
import AddButtonConfig from "@/components/form/designer/config/AddButtonConfig.vue";
import EditButtonConfig from "@/components/form/designer/config/EditButtonConfig.vue";
import CommitButtonConfig from "@/components/form/designer/config/CommitButtonConfig.vue";
import DeleteButtonConfig from "@/components/form/designer/config/DeleteButtonConfig.vue";

const vFormSelectElem = inject(vFormActiveElementKey)

const activePane = ref<string>('component')
const openedItems = ref<string[]>(['form-item', 'component'])

const configMap = {
  'date-picker': markRaw(DateConfig),
  'date-range-picker': markRaw(DateRangeConfig),
  'number-input': markRaw(NumberInputConfig),
  'text-input': markRaw(TextInputConfig),
  'single-select': markRaw(SingleSelectConfig),
  'multi-select': markRaw(MultiSelectConfig),
  'user-select': markRaw(UserSelectorInputConfig),
  'dept-select': markRaw(DeptSelectorInputConfig),
  'el-row': markRaw(RowConfig),
  'el-col': markRaw(ColConfig),
  'label-field': markRaw(LabelFieldConfig),
  'normal-button':markRaw(NormalButtonConfig),
  'ruoyi-el-select':markRaw(DropdownSelectConfig),
  'ruoyi-ag-grid':markRaw(AgGridConfig),
  'search-form':markRaw(FormConfig),
  'search-design-button':markRaw(SearchButtonConfig),
  'add-design-button':markRaw(AddButtonConfig),
  'commit-design-button':markRaw(CommitButtonConfig),
  'edit-design-button':markRaw(EditButtonConfig),
  'delete-design-button':markRaw(DeleteButtonConfig),
  'reset-design-button':markRaw(ResetButtonConfig),
}

</script>

<style scoped>


</style>
