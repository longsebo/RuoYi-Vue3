<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
            :icon="Plus"
            plain
            type="primary"
            @click="handleAdd"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            :icon="Delete"
            :disabled="!multiple"
            plain
            type="danger"
            @click="handleDelete"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            plain
            :icon="SaveIcon"
            type="danger"
            @click="handleSave"
        >保存
        </el-button>
      </el-col>
    </el-row>
    <ag-grid-vue ref="agGrid" :columnDefs="columnDefs1"
                 :rowData="rowDatas"
                 class="ag-theme-balham"
                 style="height: 300px; width: 100%;"
                 @selection-changed="handleSelectionChange"
                 @grid-ready="onGridReady"
                 :rowSelection="rowSelection"
                 :defaultColDef="defaultColDef"
    ></ag-grid-vue>
  </div>
</template>

<script>
import {defineComponent, ref, watch} from "vue";
import {getCurrentInstance} from 'vue';
import {Plus, Delete} from "@element-plus/icons-vue";
import {useIcon} from "@/components/common/util";

import {AgGridVue} from "ag-grid-vue3";
import {ElRow, ElCol, ElButton} from 'element-plus';
import AgGridSelect from "./cell/AgGridSelect.vue";
import NestedDragItem from '@/components/form/designer/NestedDragItem.vue';

export default defineComponent({
  components: {
    AgGridVue,
    NestedDragItem,
    AgGridSelect,
    ElRow,
    ElCol,
    ElButton,
    Plus,
    Delete
  },

  props: {
    columnDefs: {
      type: Array,
      default: () => [{
        headerName: String,
        field: String,
        editable: Boolean,
        sortable: Boolean,
        filter: Boolean,
        resizable: Boolean,//是否可调整列大小
        checkboxSelection: Boolean,//设置数据复选框
        headerCheckboxSelection: Boolean,//表头是否也显示复选框，用于全选反选用
        headerCheckboxSelectionFilteredOnly: Boolean,//标题复选框选择将只选择筛选的项目
        lockPinned: Boolean,//是否冻结列
        pinned: Boolean,//是否固定列 'left' | 'right',true相当于left
        lockPosition: Boolean,//禁止拖动列的位置
        lockVisible: Boolean,//禁用通过菜单更改可见性
        width: Number,//列宽
        minWidth: Number,//最小列宽
        maxWidth: Number,//
        cellEditor: String,//内置编辑器：文本编辑器（text）,选择框编辑器（select）,日期选择器（date）,数字编辑器（Number）
        //组合框编辑器（richSelect）,大组合框编辑器（largeSelect）,打开文本编辑器（bigSelect）
        cellEditorParams: Object,
        cellStyle: Object,
        //isCustomRenderer:Boolean//是否自定义单元格渲染器
        cellRenderer: String,//当自定义渲染组件时，固定为NestedDragItem可以拖拽嵌套组件，可以往拖拽其他组件
        cellRendererParams: Object,
      }]
    }
  },
  emits: {
    change: (newColumnsDef) => true,
  },
  setup(props,{emit}) {
    const {proxy} = getCurrentInstance();
    const SaveIcon = useIcon('ali_save')
    const multiple = ref(false)
    const rowSelection = ref('multiple');
    const columnDefs1 = ref([])
    const rowDatas = ref([])
    const gridApi=ref(null)
    const  gridColumnApi=ref(null)
    const defaultColDef = ref({
      // suppressEnterToBatchSort: true,
      singleClickEdit:true
    });
    watch(() => props.columnDefs, (newVal) => {
      //将props的columnDefs转换为rowDatas
      rowDatas.value = props.columnDefs
      //循环将props的columnDefs转换为columnDefs
      columnDefs1.value = makeColumnDefs()
      console.log('columnDefs.value:' + JSON.stringify(columnDefs1.value))
    }, {deep: true, immediate: true})
    function onGridReady(params) {
      gridApi.value = params.api;
      gridColumnApi.value = params.columnApi;
    }
    function makeColumnDefs() {
      let returnVal = [];
      let columnDef ={
        field: 'headerName',
        headerName: '显示名称',
        editable:true,
        cellEditor:'InputEditor'
      }
      returnVal.push(columnDef)
      columnDef ={
        field: 'field',
        headerName: '字段名称',
        editable:true,
        cellEditor:'InputEditor'
      }
      returnVal.push(columnDef)
      let columnDef1 = {
        field: 'editable',
        headerName: '是否编辑',
        editable:true,
        cellEditor: "agCheckboxCellEditor",
      }
      returnVal.push(columnDef1)
      columnDef1 = {
        field: 'sortable',
        headerName:'是否排序',
        editable:true,
        cellEditor: "agCheckboxCellEditor",
      }
      returnVal.push(columnDef1)
      //----
      columnDef1 = {
        field: 'filter',
        headerName:'是否过滤',
        editable:true,
        cellEditor: "agCheckboxCellEditor",
      }
      returnVal.push(columnDef1)
      columnDef1 = {
        field: 'resizable',
        headerName:'是否调整大小',
        editable:true,
        cellEditor: "agCheckboxCellEditor",
      }
      returnVal.push(columnDef1)
      columnDef1 = {
        field: 'checkboxSelection',
        headerName:'是否设置数据复选框',
        editable:true,
        cellEditor: "agCheckboxCellEditor",
        cellRenderer: 'agCheckboxCellRenderer',
      }
      returnVal.push(columnDef1)
      columnDef1 = {
        field: 'headerCheckboxSelection',
        headerName:'表头是否显示复选框',
        editable:true,
        cellEditor: "agCheckboxCellEditor",
        cellRenderer: 'agCheckboxCellRenderer',
      }
      returnVal.push(columnDef1)
      columnDef1 = {
        field: 'headerCheckboxSelectionFilteredOnly',
        headerName:'是否过滤后可见行可选',
        editable:true,
        cellEditor: "agCheckboxCellEditor",
        cellRenderer: 'agCheckboxCellRenderer',
      }
      returnVal.push(columnDef1)
      columnDef1 = {
        field: 'lockPinned',
        headerName:'是否冻结列',
        editable:true,
        cellEditor: "agCheckboxCellEditor",
        cellRenderer: 'agCheckboxCellRenderer',
      }
      returnVal.push(columnDef1)
      let columnDef2 = {

        field: 'pinned',
        headerName:'是否固定列',
        editable:true,
        cellEditor: "agCheckboxCellEditor",
        cellRenderer: 'agCheckboxCellRenderer',
      }
      returnVal.push(columnDef2)
      columnDef1 = {
        field: 'lockPosition',
        headerName:'是否禁止拖动列',
        editable:true,
        cellEditor: "agCheckboxCellEditor",
        cellRenderer: 'agCheckboxCellRenderer',
      }
      returnVal.push(columnDef1)
      columnDef1 = {
        field: 'lockVisible',
        headerName:'是否禁用通过菜单更改可见性',
        editable:true,
        cellEditor: "agCheckboxCellEditor",
        cellRenderer: 'agCheckboxCellRenderer',
      }
      returnVal.push(columnDef1)
      columnDef ={
        field: 'width',
        headerName: '列宽',
        cellRenderer: 'AgGridNumberInput',
        cellRendererParams: {
          field: 'width'
        },
        cellStyle: {
          display: 'flex',
          alignItems: 'center'
        }
      }
      returnVal.push(columnDef)
      columnDef ={
        field: 'maxWidth',
        headerName: '最大宽度',
        cellRenderer: 'AgGridNumberInput',
        cellRendererParams: {
          field: 'width'
        },
        cellStyle: {
          display: 'flex',
          alignItems: 'center'
        }
      }
      returnVal.push(columnDef)
      columnDef ={
        field: 'minWidth',
        headerName: '最小宽度',
        cellRenderer: 'AgGridNumberInput',
        cellRendererParams: {
          field: 'width'
        },
        cellStyle: {
          display: 'flex',
          alignItems: 'center'
        }
      }
      returnVal.push(columnDef)
      columnDef2 = {
        field: 'cellEditor',
        headerName:'单元格编辑器',
        editable:true,
        cellRenderer:AgGridSelect,
        cellRendererParams: {
          field:'cellEditor',
          options:[{
            label:'文本编辑器',
            value:'InputEditor'
          },{ label:'选择框',
            value:'AgGridSelect'},
            {
              label:'日期选择器',
              value:'AgGridDateSelect'
            },
            {
              label:'数字编辑器',
              value:'AgGridNumberInput'
            }
            ]
        }
      }
      returnVal.push(columnDef2)
      columnDef ={
        field: 'cellEditorParams',
        headerName: '编辑框参数',
        editable:true,
        cellEditor:'InputEditor'
      }
      returnVal.push(columnDef)
      columnDef ={
        field: 'cellStyle',
        headerName: '单元格css风格',
        editable:true,
        cellEditor:'InputEditor'
      }
      returnVal.push(columnDef)
      columnDef1 = {
        field: 'isCustomRenderer',
        headerName:'是否自定义单元格渲染器',
        editable:true,
        cellEditor: "agCheckboxCellEditor",
        cellRenderer: 'agCheckboxCellRenderer',
        valueSetter: function(params) {
          debugger;
          // 设置值时的逻辑
          console.log('Cell ' + params.colDef.headerName + ' in row ' + (params.node.rowIndex + 1) + ' was changed to ' + params.newValue);
          //改变自定义渲染
          if(params.newValue){
            const rowNode = gridApi.value.getRowNode(params.node.rowIndex);
            // console.log('rowNode:'+JSON.stringify(rowNode))
            // 如果行存在，则可以访问它的数据
            if (rowNode) {
              rowNode.data['cellRenderer']='WrapNestedDragItem'
              //渲染参数为空数组
              rowNode.data['cellRendererParams']="{'field':'"+rowNode.data['headerName']+"',children:[]}";
            }else{
              console.log('rowNode不存在')
            }
          }else{
            console.log('清空自定义渲染器')
            rowNode.data['cellRenderer']=null
            rowNode.data['cellRendererParams']= null
          }
          return params.newValue;
        }
      }
      returnVal.push(columnDef1)
      columnDef ={
        field: 'cellRendererParams',
        headerName: '自定义渲染器参数',
        editable:true,
        cellEditor:'InputEditor'
      }
      returnVal.push(columnDef)
      let columnDef3 ={
        field: 'cellRenderer',
        headerName: '自定义渲染器组件名称',
        hide:true
      }
      returnVal.push(columnDef3)
      return returnVal;

    }
    window.makeNewRow = function makeNewRow() {
      let row = {
        headerName: '',
        field: '',
        editable: true,
        cellEditor: '',
        cellEditorParams: '',
        cellStyle: '',
        isCustomRenderer: false,
        cellRendererParams:'',
        cellRenderer: null,
        sortable: true,
        resizable: true,
        filter: true,
        pinned: '',
        lockPinned: false,
        lockPosition: false,
        lockVisible: false,
        width: 100,
        maxWidth: 100,
        minWidth: 100,
        headerCheckboxSelection:true,
        checkboxSelection:true,
        headerCheckboxSelectionFilteredOnly:true,
      }
      return row;
    }
    function handleAdd() {
      // console.log('rowDatas:'+JSON.stringify(rowDatas.value))

      const newItems = [
        makeNewRow()
      ];
      //gridApi.value.applyTransaction({ add:newItems,addIndex:1 });
      gridApi.value.applyTransaction({ add:newItems});

    }

    function handleDelete() {
      const selectedData = gridApi.value.getSelectedRows();
      console.log('selectedData:'+JSON.stringify(selectedData));
      gridApi.value.applyTransaction({ remove:selectedData });
    }

    function handleSave() {
      //保存操作
      let allRowData=[];
      gridApi.value.forEachNode((rowNode) => {
        allRowData.push(rowNode.data);
      });
      console.log('allRowData:'+JSON.stringify(allRowData));
      emit('change', allRowData)
    }


// 多选框选中数据
    function handleSelectionChange(event) {
      console.log('enter handleSelectionChange')
      let selectedRows = gridApi.value.getSelectedRows();
      multiple.value = (selectedRows.length >=1)
    }

    return {
      ...props,
      SaveIcon,
      handleAdd,
      handleSave,
      handleDelete,
      columnDefs1,
      rowDatas,
      handleSelectionChange,
      Plus,
      Delete,
      multiple,
      onGridReady,
      rowSelection,
      defaultColDef
    }
  }

});
</script>

<style scoped>

</style>
