<template>
  <template v-if="item.category === 'form-item'">
    <el-form-item
      v-bind="item.formItemAttrs"
      :key="item.id"
      :prop="item.id"
      :label-width="item.formItemAttrs?.hiddenLabel ? '0px' : ''"
      :label="item.formItemAttrs?.hiddenLabel ? '' : item.formItemAttrs?.label"
      :rules="getRules(item)"
    >
      <component :is="item.component" v-bind="item.attrs" v-model:value="formData[item.id]"></component>
    </el-form-item>
  </template>
  <template v-else-if="item.category === 'layout'">
    <template v-if="item.component === 'el-row'">
      <el-row v-bind="item.attrs" style="margin-left: 0; margin-right: 0">
        <el-col
          v-bind="col.attrs"
          v-for="col in item.children"
          :key="col.id"
        >
          <v-form-nested-item
            v-for="child in col.children"
            :key="child.id"
            :item="child"
            :form-data="formData"
            >

          </v-form-nested-item>
        </el-col>
      </el-row>
    </template>
    <template v-else-if="item.component === 'table'">
      <table v-bind="item.attrs">
        <tr
          v-for="tr in item.children"
          :key="tr.id"
          v-bind="tr.attrs"
        >
          <td
            v-for="td in tr.children"
            :key="td.id"
            v-bind="td.attrs"
          >
            <template v-for="it in td.children" :key="it.id">
              <VFormNestedItem :form-data="formData" :item="it"/>
            </template>
          </td>
        </tr>
      </table>
    </template>
    <template v-else-if="item.component === 'container'">
      <table v-bind="item.attrs">
        <tr
            v-for="tr in item.children"
            :key="tr.id"
            v-bind="tr.attrs"
        >
          <td
              v-for="td in tr.children"
              :key="td.id"
              v-bind="td.attrs"
          >
            <template v-for="it in td.children" :key="it.id">
              <VFormNestedItem :form-data="formData" :item="it"/>
            </template>
          </td>
        </tr>
      </table>
    </template>
  </template>
  <template v-else-if="item.category === 'display'">
    <component :is="item.component" v-bind="item.attrs"></component>
  </template>
  <template v-else-if="item.category === 'button'">
    <component :is="item.component" v-bind="item.attrs" v-model:formData="formData" :id="item.id"></component>
  </template>
  <template v-else-if="item.category === 'table'">
    <component :is="item.component" v-bind="item.attrs" v-model:formData="formData"></component>
  </template>
  <template v-else-if="item.category === 'container'">
    <component :is="item.component" v-model="item.attrs" v-model:formData="formData"></component>
</template>
</template>

<script lang="ts">
import { ElFormItem, ElSelect, ElOption, ElInput, ElRow, ElCol, FormItemRule,ElButton } from 'element-plus'
import { defineComponent, PropType } from "vue";
import UserSelectorInput from "@/components/common/selector/user/UserSelectorInput.vue";
import DeptSelectorInput from "@/components/common/selector/dept/DeptSelectorInput.vue";
import NumberInput from '@/components/form/components/input/NumberInput.vue'
import TextInput from '@/components/form/components/input/TextInput.vue'
import SingleSelect from "../components/select/SingleSelect.vue"
import MultiSelect from "../components/select/MultiSelect.vue"
import UserSelect from "../components/select/UserSelect.vue"
import DeptSelect from "../components/select/DeptSelect.vue"
import DatePicker from "../components/date/DatePicker.vue"
import DateRangePicker from "../components/date/DateRangePicker.vue"
import LabelField from "@/components/form/components/display/LabelField.vue";
import NormalButton from "../components/button/NormalButton.vue"
import RuoyiElSelect from "../components/select/RuoyiElSelect.vue";
import RuoyiAgGrid from "../components/table/RuoyiAgGrid.vue"
import SearchForm from "@/components/form/components/form/searchform/SearchForm.vue"
import SearchDesignButton from "../components/button/SearchDesignButton.vue"
import AddDesignButton from "../components/button/AddDesignButton.vue"
import CommitDesignButton from "../components/button/CommitDesignButton"
import DeleteDesignButton from "../components/button/DeleteDesignButton.vue"
import EditDesignButton from "../components/button/EditDesignButton.vue"
export default defineComponent({
  name: 'VFormNestedItem',
  components: {
    ElFormItem, ElSelect, ElOption, ElInput, ElRow, ElCol,ElButton, NumberInput, UserSelectorInput, DeptSelectorInput, TextInput,
    SingleSelect, MultiSelect, UserSelect, DeptSelect, DatePicker, DateRangePicker, LabelField,
    NormalButton,RuoyiElSelect,RuoyiAgGrid,SearchForm:defineAsyncComponent (()=> import('@/components/form/components/form/searchform/SearchForm.vue')),
    SearchDesignButton,AddDesignButton,
    CommitDesignButton,DeleteDesignButton,EditDesignButton
  },
  props: {
    item: {
      type: Object as PropType<ComponentConfig>,
      required: true
    },
    formData: {
      type: Object,
      required: true,
    }
  },
  setup(props, ctx) {
    function getRules(element: ComponentConfig) {
      const rules = []
      const requiredMessage = element?.formItemAttrs?.requiredMessage
      const label = element?.formItemAttrs?.label
      const field = element.id
      if (element?.formItemAttrs?.required) {
        const rule: FormItemRule = {
          required: true,
          message: requiredMessage || `${label}(${field})必填`
        }
        rules.push(rule)
      }

      return rules
    }

    return {
      getRules,
    }
  },
})


</script>

<style scoped>
:deep(.el-input-number .el-input__inner) {
  text-align: left;
}
</style>
