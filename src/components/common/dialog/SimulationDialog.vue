<template>
  <div class="dialog resizable" id="simulationdlg">
    <div class="dialog-header">
      <div class="dialog-title">{{title}}</div>
      <button aria-label="Close this dialog" class="el-dialog__headerbtn" type="button">
        <i class="el-icon el-dialog__close"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><path fill="currentColor" d="M764.288 214.592 512 466.88 259.712 214.592a31.936 31.936 0 0 0-45.12 45.12L466.752 512 214.528 764.224a31.936 31.936 0 1 0 45.12 45.184L512 557.184l252.288 252.288a31.936 31.936 0 0 0 45.12-45.12L557.12 512.064l252.288-252.352a31.936 31.936 0 1 0-45.12-45.184z"></path></svg></i>
      </button>
    </div>
    <el-form  class="dialog-content"  :inline="true"  label-width="68px"   >
        <!-- 若(nested-drag-item).height + padding*2 > designerContainerHeight 则会出现滚动条  -->
        <nested-drag-item
            style="width: 100%; height: 100%;min-height: 80px; background-color: #fff; "
            :children="children"
            group="component"
        >
        </nested-drag-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch,  computed,  inject} from "vue";
import NestedDragItem from "@/components/form/designer/NestedDragItem.vue"
interface Props {
  modelValue:object,
  mode?: FormFieldMode,
  id?:string,
  title:string,
  width:string,
  height:string,
  top:string,//dialog CSS 中的 margin-top 值，默认为 15vh
  fullscreen:boolean,//是否全屏
  showClose:boolean,//是否显示关闭按钮
  modal:boolean,//是否显示遮罩层
  lockScroll:boolean,//是否锁定滚动条
  closeOnClickModal:boolean,//是否可以通过点击 modal 关闭 Dialog
  closeOnPressEscape:boolean,//是否可以通过按下 ESC 关闭 Dialog
  openDelay:number,//延迟打开的时间，单位毫秒。
  closeDelay:number,//延迟关闭的时间，单位毫秒。
  draggable:boolean,//是否可拖拽
  overflow:boolean,//是否拖动范围可以超出可视区
  center:boolean,//是否让 Dialog 的 header 和 footer 部分居中排列
  alignCenter:boolean,//是否让 Dialog 的 body 部分居中排列
}
const props = defineProps<Props>()

import { formModeKey } from "@/components/form/state.key";
const { proxy } = getCurrentInstance();
const emit = defineEmits(['update:modelValue'])

const children = ref([])
const scheme = ref({})
const formMode = inject(formModeKey)
const title = ref('')
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
  console.log('id:'+props.id)
  if(props.modelValue.children!=JSON.stringify(children.value)) {
    children.value = JSON.parse(props.modelValue.children);
  }
  if(props.modelValue.children!=JSON.stringify(scheme.value.children)) {
    scheme.value.children = JSON.parse(props.modelValue.children);
  }
  if(props.title!=title.value){
    title.value = props.title;
  }
},{immediate: true,deep: true})

watch(()=> children,(newVal)=>{

  let tempJson = {children:JSON.stringify(children.value)}
  console.log('emit change children:'+JSON.stringify(tempJson))
  if(props.modelValue.children!=JSON.stringify(children.value)) {
    emit('update:modelValue', tempJson)
  }
},{immediate: true,deep: true})
</script>

<style scoped>
.dialog {
  width: 300px;
  position: absolute;
  background: #fff;
  border: 1px solid #ebeef5;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;
  z-index: 100;
}
.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
}
.dialog-title {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
  width: 100%;
}
.dialog-title:hover {
  cursor: move; /* 鼠标悬停时，鼠标变成移动形状 */
}
.dialog-header .close-button {
  cursor: pointer;
  font-size: 16px;
}
.dialog-content {
  padding: 10px 0;
}

.el-dialog__headerbtn .el-dialog__close {
  --el-color-info: #909399;
  color: var(--el-color-info);
  font-size: inherit;
}
.el-icon {
  --color: inherit;
  height: 1em;
  width: 1em;
  line-height: 1em;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  position: relative;
  fill: currentColor;
  color: var(--color);
  font-size: inherit;
}
.el-dialog__headerbtn {
  position: absolute;
  top: 0;
  right: 0;
  padding: 0;
  width: 48px;
  height: 48px;
  background: transparent;
  border: none;
  outline: none;
  cursor: pointer;
  font-size: var(--el-message-close-size, 16px);
}
.resizable {
  width: 200px;
  height: 200px;
  border: 1px solid #ebeef5;
  resize: both;
  overflow: hidden;
}
</style>
