<template>
  <el-dialog
    v-model="visible"
    :fullscreen="fullScreen"
    class="v-dialog"
    :class="dialogClazz"
    :draggable="props.draggable"
    :show-close="false"
    v-bind="$attrs"
  >
    <template #header>
      <slot name="header">
        <div style="height: 24px; display: flex; justify-content: center; align-items: center; box-sizing: border-box; font-weight: bold; color: rgb(118 131 164); position: relative">
          <div v-text="props.title"></div>
          <div style="display: flex; flex-direction: row; justify-content: center; position: absolute; right: 0">
            <el-button v-if="props.showFullScreen" :icon="fullScreen ? FullScreenMinimize : FullScreenMaximize" link @click="requestFullScreen" class="header-btn"></el-button>
            <el-button :icon="Close" link @click="handleCloseClick" class="header-btn" style="margin-left: 0"></el-button>
          </div>
        </div>
      </slot>
    </template>
    <template v-if="useBodyScrolling">
      <el-scrollbar :max-height="bodyHeight" always>
        <slot name="default"></slot>
      </el-scrollbar>
    </template>
    <template v-else>
      <slot name="default"></slot>
    </template>

    <template #footer>
      <slot name="footer" v-if="!props.hiddenFooter">
        <div style="display: flex; justify-content: center">
          <el-button :loading="props.loading" type="primary" @click="handleConfirm">{{ props.confirmText }}</el-button>
          <el-button :loading="props.loading" @click="handleCancel">{{ cancelText }}</el-button>
        </div>
      </slot>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
//import { ElDialog, ElButton, ElScrollbar } from "element-plus"
import { DialogEmits } from './dialog'
import { Close } from '@element-plus/icons-vue'
import { useIcon } from "@/components/common/util";
const FullScreenMaximize = useIcon('FullScreenMaximize')
const FullScreenMinimize = useIcon('FullScreenMinimize')
// export interface DialogProps {
//   /**
//    * 标题
//    */
//   title: string
//   /**
//    * 显隐
//    */
//   modelValue: boolean
//
//   /**
//    * 初始化全屏状态
//    */
//   initFullScreen?: boolean | undefined
//
//   /**
//    * 展示全屏按钮
//    */
//   showFullScreen?: boolean
//
//   /**
//    * 全屏
//    */
//   fullScreen?: boolean | undefined
//   confirmText?: string
//   cancelText?: string
//   loading?: boolean
//   /**
//    * 使用el-scrollbar包裹对话框body
//    */
//   useBodyScrolling?: boolean
//   /**
//    * 固定对话框body高度
//    */
//   fixedBodyHeight?: boolean
//
//   draggable?: boolean
//
//   hiddenFooter?: boolean
//
// }
const props = defineProps({
  title: {
    type:String,
  },
  modelValue:{
    type:Boolean
  } ,
  initFullScreen:{
    type:Boolean
  },
  showFullScreen:{
    type:Boolean
  },
  fullScreen: undefined,
  confirmText: {
    type:String,
    default:'确定',
  },
  cancelText: {
    type:String,
    default:'取消',
  },
  disableFooter: {
    type:Boolean,
    default:false,
  },
  useBodyScrolling: {
    type:Boolean,
    default:false,
  },
  fixedBodyHeight: {
    type:Boolean,
    default:true,
  },
  draggable: {
    type:Boolean,
    default:true,
  },
  loading: {
    type:Boolean,
    default:false,
  },
  hiddenFooter: {
    type:Boolean,
    default:false,
  },
})
const emits = defineEmits<DialogEmits>()

const visible = computed<boolean>({
  get: () => { return props.modelValue },
  set: v => emits('update:modelValue', v)
})

const fullScreenState = ref(!!props.initFullScreen)
const fullScreen = computed<boolean>({
  get: () => {
    console.log('fullScreen getter', props.fullScreen, fullScreenState.value);
    // 非受控模式，状态完全由组件内部控制
    if (props.fullScreen === undefined) {
      return fullScreenState.value
    } else {
      return props.fullScreen
    }
  },
  set: v => {
    fullScreenState.value = v
    console.log('fullScreen setter', v, props.fullScreen);
    // 受控模式，将状态更新到父组件
    if (props.fullScreen !== undefined) {
      emits('update:fullScreen', v)
    }
  }
})

// const fullScreen = ref<boolean>(false)
function requestFullScreen() {
  fullScreen.value = !fullScreen.value
}


const bodyHeight = computed(() => {
  const footerHeight = props.hiddenFooter ? '0' : '52px';
  if (props.fullScreen) {
    // footerHeight=52,headerHeight=44,padding=12
    return `calc(100dvh - ${footerHeight} - 44px)`
  } else {
    return `calc(70dvh - ${footerHeight} - 44px)`
  }
})

const dialogClazz = computed(() => {
  const classList: string[] = ['v-dialog']
  if (!props.fixedBodyHeight) {
    classList.push('flex-body')
  }
  if (props.hiddenFooter) {
    classList.push('hidden-footer')
  }
  return classList
})

function handleConfirm() {
  emits("confirm")
}

function handleCancel() {
  emits("cancel")
}


function handleCloseClick() {
  visible.value = false
}

</script>

<style scoped>
.header-btn :deep(.el-icon),
.header-btn :deep(.el-icon svg) {
  width: 24px;
  height: 24px;
}
</style>


