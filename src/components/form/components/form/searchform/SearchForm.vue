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
  children?: string,
  mode?: FormFieldMode
}
const showSearch = ref(true)
const props = defineProps<Props>()

// const emits = defineEmits<Emits>()
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

  if(props.children && cMode =='design'){
    children.value = JSON.parse(props.children);
  }else{
    scheme.value.children = JSON.parse(props.children);
  }
},{immediate: true,deep: true})
onMounted(() => {
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
