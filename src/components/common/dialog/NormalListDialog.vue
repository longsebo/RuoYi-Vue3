<template>
  <!-- 添加或修改应用定义对话框 -->
  <el-dialog :title="title" v-model="open" width="500px" append-to-body>
    <el-form ref="applicationRef" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="应用编码" prop="applicationCode">
        <el-input v-model="form.applicationCode" placeholder="请输入应用编码" />
      </el-form-item>
      <el-form-item label="应用名称" prop="applicationName">
        <el-input v-model="form.applicationName" placeholder="请输入应用名称" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark" placeholder="请输入备注" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <ConfirmButton title="确定"/>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import {onMounted, ref,onUnmounted} from "vue";
import { getCurrentInstance } from 'vue';
import { showDialogKey,validateFormKey,resetFormKey } from "@/config/app.keys";
import bus  from "@/event/bus";
import ConfirmButton  from "@/components/common/button/ConfirmButton.vue";
const { proxy } = getCurrentInstance();
const open = ref(false)
const form= ref({})
const title = ref('')
const rules= ref ({})
interface Props {
  id?:number//对话框本身id
}
const props = withDefaults(defineProps<Props>(), {
  id:0
})
 // 取消按钮
 function cancel() {
   open.value = false;
   reset();
 }
onMounted(() => {
  bus.on(props.id+"_"+showDialogKey, (data) => {
    title.value = data.title;
    form.value = data.form;
    open.value = data.show;
  })
  bus.on(props.id+"_"+validateFormKey,(callBackFun)=>{
    proxy.$refs["applicationRef"].validate(valid => {
      callBackFun(valid, form)
    })
  })
  bus.on(props.id+"_"+resetFormKey, () => {
    reset();
  })
})
onUnmounted(() => {
  bus.off(props.id+"_"+showDialogKey)
  bus.off(props.id+"_"+validateFormKey)
})
 // 表单重置
 function reset() {
   form.value = {
   };
   proxy.resetForm("applicationRef");
 }

</script>

<style scoped>

</style>
