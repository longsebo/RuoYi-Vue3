<template>
  <el-form
    v-if="vFormSelectElem?.attrs"
    :model="vFormSelectElem?.attrs"
    style="padding: 2px;"
  >
    <el-form-item prop="label" label="标题">
      <el-input v-model="vFormSelectElem.attrs.label"></el-input>
    </el-form-item>
    <el-form-item prop="size" label="按钮大小">
      <el-select v-model="vFormSelectElem.attrs.size">
        <el-option label="较大" value="large"></el-option>
        <el-option label="缺省" value="default"></el-option>
        <el-option label="较小" value="small"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item prop="type" label="按钮类型">
      <el-select v-model="vFormSelectElem.attrs.type">
        <el-option label="基本" value="primary"></el-option>
        <el-option label="成功" value="success"></el-option>
        <el-option label="警告" value="warning"></el-option>
        <el-option label="危险" value="danger"></el-option>
        <el-option label="信息" value="info"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item prop="plain" label="是否朴素按钮">
      <el-radio-group v-model="vFormSelectElem.attrs.plain">
        <el-radio-button :value="true">是</el-radio-button>
        <el-radio-button :value="false">否</el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item prop="text" label="是否文字按钮">
      <el-radio-group v-model="vFormSelectElem.attrs.text">
        <el-radio-button :value="true">是</el-radio-button>
        <el-radio-button :value="false">否</el-radio-button>
      </el-radio-group>
    </el-form-item>


    <el-form-item prop="bg" label="是否显示文字按钮背景颜色">
      <el-radio-group v-model="vFormSelectElem.attrs.bg"  >
        <el-radio-button :value="true">是</el-radio-button>
        <el-radio-button :value="false">否</el-radio-button>
      </el-radio-group>
    </el-form-item>

   <el-form-item prop="autofocus" label="自动获取焦点">
      <el-radio-group v-model="vFormSelectElem.attrs.autofocus">
        <el-radio-button :value="true">是</el-radio-button>
        <el-radio-button :value="false">否</el-radio-button>
      </el-radio-group>
    </el-form-item>

    <el-form-item prop="round" label="是否为圆角按钮">
      <el-radio-group v-model="vFormSelectElem.attrs.round">
        <el-radio-button :value="true">是</el-radio-button>
        <el-radio-button :value="false">否</el-radio-button>
      </el-radio-group>
    </el-form-item>

    <el-form-item prop="link" label="是否为链接按钮">
      <el-radio-group v-model="vFormSelectElem.attrs.link">
        <el-radio-button :value="true">是</el-radio-button>
        <el-radio-button :value="false">否</el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item prop="circle" label="是否为圆形按钮">
      <el-radio-group v-model="vFormSelectElem.attrs.circle">
        <el-radio-button :value="true">是</el-radio-button>
        <el-radio-button :value="false">否</el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item prop="loading" label="是否为加载中状态">
      <el-radio-group v-model="vFormSelectElem.attrs.loading">
        <el-radio-button :value="true">是</el-radio-button>
        <el-radio-button :value="false">否</el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item prop="disabled" label="是否为禁用状态">
      <el-radio-group v-model="vFormSelectElem.attrs.disabled">
        <el-radio-button :value="true">是</el-radio-button>
        <el-radio-button :value="false">否</el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item  label="操作设置" >
      <InterfaceSelect  :interfaceCode="vFormSelectElem.attrs.operationdata.interfaceCode" :interfaceType="searchInterfaceType"
                       :parameterList="vFormSelectElem.attrs.operationdata.parameterList" @change="updateInterfacceConfig"/>
    </el-form-item>
    <el-form-item prop="mode" label="模式">
      <el-checkbox-group v-model="mode" :min="0" :max="1">
        <el-checkbox-button value="design">设计</el-checkbox-button>
        <el-checkbox-button value="read">只读</el-checkbox-button>
        <el-checkbox-button value="edit">编辑</el-checkbox-button>
      </el-checkbox-group>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import {
  ElForm, ElFormItem, ElInput, ElCheckboxGroup, ElRadioGroup, ElRadioButton, ElCheckboxButton, ElSelect, ElOption, ElInputNumber,
} from 'element-plus'
import {computed, inject, ref} from "vue";
import { vFormActiveElementKey } from "@/components/form/state.key";
import InterfaceSelect from    "@/components/common/selector/interface/InterfaceSelect.vue";
const vFormSelectElem = inject(vFormActiveElementKey)
const searchInterfaceType = ref('delete')
//console.log('inject vFormSelectElem', JSON.stringify(vFormSelectElem.value.attrs.operationdata.parameterList));
const mode = computed({
  get: () => vFormSelectElem.value.attrs.mode ? [vFormSelectElem.value.attrs.mode] : [],
  set: v => {
    if (v?.length) {
      vFormSelectElem.value.attrs.mode = v[0]
    } else {
      vFormSelectElem.value.attrs.mode = undefined
    }
  }
})

/**
 * 更新接口配置
 * @param interfaceCode
 * @param parameterList
 */
function updateInterfacceConfig(interfaceCode,parameterList){
  vFormSelectElem.value.attrs.operationdata.interfaceCode = interfaceCode;
  vFormSelectElem.value.attrs.operationdata.parameterList = parameterList;
  console.log("vFormSelectElem:"+JSON.stringify(vFormSelectElem.value));

}

</script>

<style scoped>

</style>
