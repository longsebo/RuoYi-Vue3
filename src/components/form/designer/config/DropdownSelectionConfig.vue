<template>
  <el-form
    v-if="vFormSelectElem?.attrs"
    :model="vFormSelectElem?.attrs"
    style="padding: 2px;"
  >

    <el-form-item prop="size" label="大小">
      <el-select v-model="vFormSelectElem.attrs.size">
        <el-option label="较大" value="large"></el-option>
        <el-option label="缺省" value="default"></el-option>
        <el-option label="较小" value="small"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item prop="multiple1" label="是否多选">
      <el-radio-group v-model="multiple1" @change="changeMultiple">
        <el-radio-button :label="true">是</el-radio-button>
        <el-radio-button :label="false">否</el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item prop="collapseTags" v-show="vFormSelectElem.attrs.multiple" label="是否折叠标签">
      <el-radio-group v-model="vFormSelectElem.attrs.collapseTags">
        <el-radio-button :label="true">是</el-radio-button>
        <el-radio-button :label="false">否</el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item prop="collapseTagsTooltip" v-show="vFormSelectElem.attrs.multiple" label="是否折叠标签提示">
      <el-radio-group v-model="vFormSelectElem.attrs.collapseTagsTooltip">
        <el-radio-button :label="true">是</el-radio-button>
        <el-radio-button :label="false">否</el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item prop="maxCollapseTags" v-show="vFormSelectElem.attrs.multiple" label="最大折叠标签数量">
      <el-input-number v-model="vFormSelectElem.attrs.maxCollapseTags" :min="1"  />
    </el-form-item>
    <el-form-item prop="optionsSource" label="选项来源">
      <el-radio-group v-model="vFormSelectElem.attrs.optionsSource">
        <el-radio-button label="input">手工录入</el-radio-button>
        <el-radio-button label="dict">系统字典</el-radio-button>
      </el-radio-group>
    </el-form-item>


    <el-form-item  label="" v-show="vFormSelectElem.attrs.optionsSource==='input'">
      <OptionTable  :options="vFormSelectElem.attrs.options"
                        @changeOptions="changeOptions"/>
    </el-form-item>
    <el-form-item  label="" v-show="vFormSelectElem.attrs.optionsSource==='dict'">
        <SelectDictType  :optionTypeId="vFormSelectElem.attrs.dictType"
                      @changeDictType="changeDictType"/>
    </el-form-item>
    <el-form-item prop="mode" label="模式">
      <el-checkbox-group v-model="mode" :min="0" :max="1">
        <el-checkbox-button label="design">设计</el-checkbox-button>
        <el-checkbox-button label="read">只读</el-checkbox-button>
        <el-checkbox-button label="edit">编辑</el-checkbox-button>
      </el-checkbox-group>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>

import {computed, inject, ref,onMounted} from "vue";
import { vFormActiveElementKey } from "@/components/form/state.key";
import OptionTable from    "@/components/common/table/optiontable/OptionTable.vue";
import SelectDictType from    "@/components/common/selector/dict/SelectDictType.vue";
const vFormSelectElem = inject(vFormActiveElementKey)
const multiple1 =ref(false)
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
onMounted(()=>{
  //console.log('vFormSelectElem:'+JSON.stringify(vFormSelectElem.value))
  multiple1.value = vFormSelectElem.value.attrs.multiple;
  console.log('multiple1.value:'+multiple1.value)
})
/**
 * 更新选项列表
 * @param interfaceCode
 */
function changeOptions(options){
  vFormSelectElem.value.attrs.options=options
}
/**
 * 更新字段类型
 * @param dictType
 */
function changeDictType(dictType){
  vFormSelectElem.value.attrs.dictType = dictType;
}
function changeMultiple(value) {
 vFormSelectElem.value.attrs.multiple = value;
}
</script>

<style scoped>

</style>
