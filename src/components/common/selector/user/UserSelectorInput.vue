<template>
  <div class="user-selector-input">
    <el-select
      :key="selectKey"
      v-model="selectedElems"
      remote
      filterable
      clearable
      collapse-tags
      collapse-tags-tooltip
      fit-input-width
      multiple
      :multiple-limit="props.multiple ? 0 : 1"
      @dblclick="handleDblClick"
      :remote-method="handleSearch"
      :loading="loading"
      tag-type="success"
      :placeholder="props.placeholder"
      value-key="id"
      :disabled="props.disabled"
      ref="selectRef"
      style="width: 100%"
    >
      <el-option
        v-for="item in options"
        :key="item.userId"
        :label="item.nickName"
        :value="item"
      />
    </el-select>
    <user-selector-modal
      v-model:visible="modalVisible"
      v-model="selectedElems"
      :multiple="props.multiple"
      @confirm="handleConfirm"
    />
  </div>
</template>

<script lang="ts" setup>
import { ElSelect, ElOption, ElMessage } from "element-plus";
import { computed, inject, ref, toRaw, watch } from "vue";
import UserSelectorModal from "./UserSelectorModal.vue";
import {listAll} from "@/api/system/user";
import { useUserMap } from "@/config/app.hooks";

interface Props {
  multiple?: boolean
  placeholder?: string
  modelValue?: string | string[] | null
  varOptions?: UserView[] // 变量选项: 本人, 本部门, 下级部门
  disabled?: boolean
}

interface Emits {
  (e: 'update:modelValue', val: string | string[]): void
  (e: 'change', val: string | string[]): void
}

const selectRef = ref<InstanceType<typeof ElSelect>>()
const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  multiple: false,
  placeholder: '输入用户搜索或双击弹框',
})
const emits = defineEmits<Emits>()

const userMap = useUserMap()

const selectedElems = computed<UserView[]>({
  get: () => {
    if (!props.modelValue || !props.modelValue) {
      return []
    }
    if (props.multiple) {
      if(!(props.modelValue as string[]).every(it => userMap.has(it))) {
        console.warn('cannot find userInfo struct in userMap')
      }
      if(props.modelValue) {
        let temp = (props.modelValue as string[]).map(it => userMap?.get(it)!)
        if(temp!=null){
          return temp;
        }else{
          return [];
        }
      }else{
         return [];
      }
    } else {
      if (props.modelValue && !userMap.has(props.modelValue as string)) {
        console.warn('cannot find userInfo struct in userMap')
      }
      if(props.modelValue) {
        let temp =  props.modelValue ? [userMap.get(props.modelValue as string)!] : []
        if(temp!=null){
          return temp;
        }else{
          return [];
        }
      }else{
        return [];
      }
    }

  },
  set: v => {
    v.forEach(it => userMap?.set(it.userId.toString(), it))
    if (props.multiple) {
      let t = v?.length ? v.map(it => it.userId) : [];
      console.log('t:'+JSON.stringify(t));
      emits('update:modelValue', v?.length ? v.map(it => it.userId) : [])
      emits('change', v?.length ? v.map(it => it.userId) : [])
    } else {
      emits('update:modelValue', v?.length ? v[0].userId : '')
      emits('change', v?.length ? v[0].userId : '')
    }

  }
})

const options = ref<UserView[]>([])

watch(() => [selectedElems.value, options.value], () => {
  //console.log('watch selectedElems and options', (selectedElems.value), (options.value));

  if (!options.value.length && props.varOptions?.length) {
    options.value = [...props.varOptions]
    return
  }

  // 选项列表
  const optionIdMap = new Set<string>(options.value.map(it => it.userId))
  // 已选列表
  // console.log('selectedElems:'+JSON.stringify(selectedElems.value));

  const selectedElemMap = new Map<string, UserView>(selectedElems.value.map(it => [it.userId, it]))

  // 已选列表中存在一部分选项 不存在与选项列表中
  if(selectedElems!=null && selectedElems.value!=null) {
    if (!selectedElems.value.map(it => it.userId).every(it => optionIdMap.has(it))) {
      //
      const candidateElems = selectedElems.value.map(it => it.userId) // 转成id 列表
          .filter(it => !optionIdMap.has(it)) // 过滤出 选项列表中不存在的选项id
          .map(it => selectedElemMap.get(it)!) // 把不存在的选项id 转成选项列表

      options.value = [...options.value, ...candidateElems]
    }
  }
}, { immediate: true })

const selectKey = ref<number>(Math.random())
const loading = ref<boolean>(false)
const tableData = ref([]);

function handleDblClick() {
  !props.disabled && (modalVisible.value = true)
}


async function handleSearch(keyword: string) {
  if (!keyword) {
    return
  }
  try {
    let queryParamer = {
      nickName:keyword,
    }
    tableData.value = await listAll(queryParamer)
    const varOps = props.varOptions || []
    const varUserIds = new Set<string>(varOps.map(it => it.userId))
    const selectedUserIds = new Set<string>(toRaw(selectedElems.value).map(it => it.userId))
    options.value = [
      ...varOps,
      ...toRaw(selectedElems.value).filter(it => !varUserIds.has(it.userId)),
      ...toRaw(tableData.value).filter(it => !selectedUserIds.has(it.userId))
    ]
    // nextTick(() => selectRef.value?.focus())
  } catch (e) {
    ElMessage.error((e as Error)?.message || '搜索失败')
  }
}

function handleConfirm() {
  const varOps = props.varOptions || []
  const varUserIds = new Set<string>(varOps.map(it => it.userId))
  console.log('selectedElems', toRaw(selectedElems.value));

  options.value = [
    ...varOps,
    ...selectedElems.value.filter(it => !varUserIds.has(it.userId)),
  ]
}

const modalVisible = ref<boolean>(false)

</script>
