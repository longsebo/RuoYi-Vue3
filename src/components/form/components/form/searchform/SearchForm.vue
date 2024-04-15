<template>
  <el-form
      :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px"
  >
    <template v-if="cMode === 'design'">
    <!-- 若(nested-drag-item).height + padding*2 > designerContainerHeight 则会出现滚动条  -->
    <nested-drag-item
        style="width: 100%; height: 100%;min-height: 80px; background-color: #fff; "
        :children="children"
        group="component"
    >
    </nested-drag-item>
    </template>
    <template v-else-if="cMode === 'edit'">
      <v-form-render  style="width: 100%; height: 100%;min-height: 80px; background-color: #fff; "
                      :scheme="scheme"
                      :form-data="queryParams"></v-form-render>
    </template>
    <template v-else-if="cMode === 'edit'">
      <v-form-render  style="width: 100%; height: 100%;min-height: 80px; background-color: #fff; "
                      :scheme="scheme"
                      :form-data="queryParams"></v-form-render>
    </template>
    <template v-else-if="cMode === 'read'">
      <v-form-render  style="width: 100%; height: 100%;min-height: 80px; background-color: #fff; "
                      :scheme="scheme"
                      :form-data="queryParams"></v-form-render>
    </template>
    <template v-else-if="cMode === 'hidden' ">
      <v-form-render  style="width: 100%; height: 100%;min-height: 80px; background-color: #fff; "
                      :scheme="scheme"
                      :form-data="queryParams"></v-form-render>
    </template>
  </el-form>
</template>

<script lang="ts" setup>
console.log('enter searchForm')
import {
  queryParamKey,resetQueryFormKey,showSearchKey
} from "@/config/app.keys";
import bus from '@/event/bus'
import {onMounted, ref, watch, onUnmounted, computed, getCurrentInstance, inject} from "vue";
import NestedDragItem from "@/components/form/designer/NestedDragItem.vue"
import VFormRender  from "@/components/form/designer/VFormRender.vue"
import { formModeKey } from "@/components/form/state.key";
const { proxy } = getCurrentInstance();
const queryParams = ref({
      pageNum: 1,
      pageSize: 10
})

watch(() => queryParams, () => {
  console.log('bus.emit：'+JSON.stringify(queryParams))
  bus.emit(queryParamKey, queryParams)
},{immediate: true,deep: true})



interface Props {
  modelValue:object,
  mode?: FormFieldMode
}
const showSearch = ref(true)
const props = defineProps<Props>()


const emit = defineEmits(['update:modelValue'])

const children = ref([])
const scheme = ref({})
const formMode = inject(formModeKey)
const cMode = computed<FormFieldMode>(() => {
  if (props.mode) {
    return props.mode
  }
  if (formMode?.value) {
    return formMode.value
  }
  return "edit"
})
watch(() => props, (newVal) =>{
  debugger;
  console.log('cMode:'+cMode.value)
  if(props.modelValue.children && cMode.value =='design'){
    if(props.modelValue.children!=JSON.stringify(children.value)) {
      children.value = JSON.parse(props.modelValue.children);
    }
  }else{
    if(props.modelValue.children!=JSON.stringify(scheme.value.children)) {
      scheme.value.children = JSON.parse(props.modelValue.children);
    }
  }
},{immediate: true,deep: true})

watch(()=> children,(newVal)=>{

  let tempJson = {children:JSON.stringify(children.value)}
  console.log('emit change children:'+JSON.stringify(tempJson))
  if(props.modelValue.children!=JSON.stringify(children.value)) {
    emit('update:modelValue', tempJson)
  }
},{immediate: true,deep: true})

onMounted(() => {
  console.log('cMode:'+cMode)
  bus.on(resetQueryFormKey,() => {
    proxy.resetForm("queryRef");
  })
  bus.on(showSearchKey,(data: boolean) => {
    showSearch.value = data
  })
})
onUnmounted(() =>{
  bus.off(resetQueryFormKey)
  bus.off(showSearchKey)
})

</script>

<style scoped>

</style>
