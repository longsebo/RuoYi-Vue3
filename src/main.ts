import { createApp } from 'vue'

import Cookies from 'js-cookie'

import ElementPlus from 'element-plus'
import locale from 'element-plus/es/locale/lang/zh-cn' // 中文语言
import { varOptions } from '@/components/permission/components/condition'
import { ElLoading, ClickOutside } from 'element-plus';
import '@/assets/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import directive from './directive' // directive

// 注册指令
import plugins from './plugins' // plugins
import { download } from '@/utils/request'

// svg图标
import 'virtual:svg-icons-register'
import SvgIcon from '@/components/SvgIcon'
import elementIcons from '@/components/SvgIcon/svgicon'

import './permission' // permission control

import { useDict } from '@/utils/dict'
import { parseTime, resetForm, addDateRange, handleTree, selectDictLabel, selectDictLabels } from '@/utils/ruoyi'

// 分页组件
import Pagination from '@/components/Pagination'
// 自定义表格工具组件
import RightToolbar from '@/components/RightToolbar'
// 富文本组件
import Editor from "@/components/Editor"
// 文件上传组件
import FileUpload from "@/components/FileUpload"
// 图片上传组件
import ImageUpload from "@/components/ImageUpload"
// 图片预览组件
import ImagePreview from "@/components/ImagePreview"
// 自定义树选择组件
import TreeSelect from '@/components/TreeSelect'
// 字典标签组件
import DictTag from '@/components/DictTag'
import "@/config/ployfill"
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-balham.css';
import { menuOptionsKey, userInfoKey, userMapKey } from "./config/app.keys"

import TextFilter from '@/components/ag-grid/filter/components/TextFilter.vue'
import OptionFilter from '@/components/ag-grid/filter/components/OptionFilter.vue'
import UserFilter from '@/components/ag-grid/filter/components/UserFilter.vue'
import DeptFilter from '@/components/ag-grid/filter/components/DeptFilter.vue'
import DateFilter from '@/components/ag-grid/filter/components/DateFilter.vue'
import FieldConditionInput from "@/components/ag-grid/cell/components/FieldConditionInput.vue";
import FieldCheckboxInput from "@/components/ag-grid/cell/components/FieldCheckboxInput.vue";
import FieldNumberInput from "@/components/ag-grid/cell/components/FieldNumberInput.vue";
import AgGridNumberInput from "@/components/common/table/aggrid/cell/AgGridNumberInput.vue";
import AgGridDateSelect from "@/components/common/table/aggrid/cell/AgGridDateSelect.vue";
import AgGridSelect from "@/components/common/table/aggrid/cell/AgGridSelect.vue";
import InputEditor from "@/components/ag-grid/editor/InputEditor.vue";
import WrapNestedDragItem from  "@/components/common/draggable/WrapNestedDragItem.vue";
import WrapColumnDesignNestedDragItem from  "@/components/common/draggable/WrapColumnDesignNestedDragItem.vue";
async function startup() {
  try {
    const app = createApp(App)

    app.component('TextFilter', TextFilter)
    app.component('OptionFilter', OptionFilter)
    app.component('UserFilter', UserFilter)
    app.component('DeptFilter', DeptFilter)
    app.component('DateFilter', DateFilter)
    app.component('FieldConditionInput', FieldConditionInput)
    app.component('FieldCheckboxInput', FieldCheckboxInput)
    app.component('FieldNumberInput', FieldNumberInput)
    app.component('AgGridNumberInput', AgGridNumberInput)
    app.component('InputEditor',InputEditor)
    app.component('AgGridDateSelect',AgGridDateSelect)
    app.component('AgGridSelect',AgGridSelect)
    app.component('WrapNestedDragItem',WrapNestedDragItem)
	app.component('WrapColumnDesignNestedDragItem',WrapColumnDesignNestedDragItem)
    // 全局方法挂载
    app.config.globalProperties.useDict = useDict
    app.config.globalProperties.download = download
    app.config.globalProperties.parseTime = parseTime
    app.config.globalProperties.resetForm = resetForm
    app.config.globalProperties.handleTree = handleTree
    app.config.globalProperties.addDateRange = addDateRange
    app.config.globalProperties.selectDictLabel = selectDictLabel
    app.config.globalProperties.selectDictLabels = selectDictLabels

    // 全局组件挂载
    app.component('DictTag', DictTag)
    app.component('Pagination', Pagination)
    app.component('TreeSelect', TreeSelect)
    app.component('FileUpload', FileUpload)
    app.component('ImageUpload', ImageUpload)
    app.component('ImagePreview', ImagePreview)
    app.component('RightToolbar', RightToolbar)
    app.component('Editor', Editor)
    app.directive('click-outside', ClickOutside)
    app.use(router)
    app.use(store)
    app.use(plugins)
    app.use(elementIcons)
    app.component('svg-icon', SvgIcon)

    directive(app)

    // 使用element-plus 并且设置全局的大小
    app.use(ElementPlus, {
      locale: locale,
      // 支持 large、default、small
      size: Cookies.get('size') || 'default'
    })
    const map = new Map<string, UserView>();
    varOptions.forEach(it => map.set(it.id, it))
    app.provide(userMapKey, map)
    app.mount('#app')
  } catch (e) {
    console.log(e);
  }

}

startup()
