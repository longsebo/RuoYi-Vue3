<template>
  <el-form-item :prop="optionTypeId" label="字典类型" required>
    <el-select
        v-model="optionTypeId"
        @change="v => changeDictType(v)"
        style="width: 100%;"
    >
      <el-option
          v-for="type in modelingOptionTypes"
          :key="type.dictType" :label="type.dictName"
          :value="type.dictType"
      />
    </el-select>
  </el-form-item>
  <el-form-item label="字典选项" required>
    <el-select
        style="width: 100%;"
    >
      <el-option
          v-for="item in modelingOptionItems"
          :key="item.dictCode" :label="item.dictLabel"
          :value="item.dictCode"
      />
    </el-select>
  </el-form-item>
</template>

<script lang="ts" setup>
import {onMounted, ref} from "vue";
import {getCurrentInstance} from 'vue';
import {optionselect} from "@/api/system/dict/type"
import {getDicts} from "@/api/system/dict/data"
const {proxy} = getCurrentInstance();
const modelingOptionTypes = ref([])
const modelingOptionItems = ref([])
const optionTypeId = ref('')
interface Props {
  optionTypeId: string
}
const props = defineProps<Props>()

interface Emits {
  (e: 'changeDictType', val: string): void
}
const emits = defineEmits<Emits>()

onMounted(() => {
  optionTypeId.value = props.optionTypeId;
  //查询字典类型
  optionselect().then(res => {
    modelingOptionTypes.value = res.data;
  })
})
const changeDictType = (dictType: string) => {
  getDicts(dictType).then(res => {
    modelingOptionItems.value = res.data;
  })
  // 通知父组件
  emits('changeDictType', dictType);
}
</script>

<style scoped>

</style>
