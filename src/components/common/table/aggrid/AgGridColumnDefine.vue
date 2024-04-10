<template>
  <div class="my-grid">
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
    <ag-grid-vue ref="agGrid"
                 :grid-options="gridOptions"
                 class="ag-theme-balham"
                 style="height: 300px; width: 100%;"
    ></ag-grid-vue>
	<dropdown-menu
      ref="menuRef"
      v-click-outside="handleClickMenuOutside"
      :y="y"
      :x="x"
	  style="position:absolute;"
      :options="menuOptions"
      @item-click="handleMenuClick"
    />

     <el-dialog
        v-model="dialogVisible"
        title="提示"
        :fullscreen="true">
      <FormDesigner1 name="UPDATE" :pageInfo="pageInfo" :isPage="false" @updatedesigner="updatedesigner" />
    </el-dialog>
  </div>
</template>

<script setup  lang="ts">
import {defineComponent, ref, watch,onBeforeUnmount } from "vue";
import {getCurrentInstance} from 'vue';
import {Plus, Delete} from "@element-plus/icons-vue";
import {useIcon} from "@/components/common/util";
import FormDesigner1 from '@/views/modeling/form/designer.vue';
import {AgGridVue} from "ag-grid-vue3";
import {ElRow, ElCol, ElButton} from 'element-plus';
import AgGridSelect from "./cell/AgGridSelect.vue";
import NestedDragItem from '@/components/form/designer/NestedDragItem.vue';
import { CellContextMenuEvent, ColumnApi, GridApi, GridOptions, GridReadyEvent } from "ag-grid-community";
import { MenuOption } from "@/components/menu";
import DropdownMenu from "@/components/menu/DropdownMenu.vue";
import { genId } from "@/components/form/designer/util/common";
const cellRendererParams= ref([])
const menuRef = ref<any>()
const menuOptions = reactive<MenuOption[]>([
  { text: '设计', command: 'designer' }
])

const props=defineProps({
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
        cellRendererParams: String,
      }]
    }
  })
  interface Emits {
    (e: 'change', newColumnsDef: object): void
  }

	const emit = defineEmits<Emits>()
	const contextmenuRow = ref<any>()
	const currentRowId =ref<any>()
	const contextmenuColDef = ref<any>()
    const {proxy} = getCurrentInstance();
    const SaveIcon = useIcon('ali_save')
    const multiple = ref(false)
    const rowSelection = ref('multiple');
    const columnDefs1 = ref([])
    const rowDatas = ref([])
    const gridApi=ref(null)
    const  gridColumnApi=ref(null)
    const dialogVisible =ref(false)
	const x = ref(0)
    const y = ref(0)
    const defaultColDef = ref({
      // suppressEnterToBatchSort: true,
      singleClickEdit:true
    });

	const gridOptions: GridOptions<any> = {
	  rowHeight: 32,
	  headerHeight: 32,
	  preventDefaultOnContextMenu: true,
	  rowSelection:'multiple',
	  onGridReady(event) {
		  gridApi.value = event.api;
		  gridColumnApi.value = event.columnApi;
		  columnDefs1.value = makeColumnDefs()
		  event.api.setGridOption('columnDefs', columnDefs1.value)
		  event.api.setGridOption('rowData', rowDatas.value)
		  event.api.setGridOption('defaultColDef', defaultColDef.value)
		  // 添加事件监听
		  document.addEventListener('keydown', handleKeyDown);

	  },
	  onCellContextMenu(event: CellContextMenuEvent<any>) {
		console.log('event', event)
		//debugger;
		contextmenuRow.value = event.data
		currentRowId.value = event.data.id
		contextmenuColDef.value = event.colDef
		if(contextmenuColDef.value['field']==='cellRenderer' && contextmenuRow.value['cellRenderer']==='WrapColumnDesignNestedDragItem'){
			const ev = event.event as PointerEvent
			x.value = ev.clientX
			y.value = ev.clientY
			menuRef.value?.show()
		}
	  },
	  rowData: [],
	  getRowId: function(params) {
	      //debugger;
         return params.data.id;
      },
	  onSelectionChanged:function(event) {
       console.log('enter handleSelectionChange')
       let selectedRows = gridApi.value.getSelectedRows();
       multiple.value = (selectedRows.length >=1)
     },

	}


    const pageInfo = ref({ "mode": "design",
      "size": "default",
      "style": "",
      "children": [],
      "labelWidth": "120px",
      "labelPosition": "auto"})
    const currentRow = ref({})
    watch(() => props, (newVal) => {
      //将props的columnDefs转换为rowDatas
      rowDatas.value = props.columnDefs
	  //填充id
	  fillIdForRow(rowDatas.value)
     if(gridApi && gridApi.value) {
       gridApi.value.setRowData(rowDatas.value)
     }
      //循环将props的columnDefs转换为columnDefs
      //columnDefs1.value = makeColumnDefs()
      console.log('enter watch columnDefs.value:' + JSON.stringify(columnDefs1.value))
    }, {deep: true, immediate: true})

	function  handleKeyDown(event) {
	  //debugger;
      //if (event.key === 'Tab') {
      //  event.preventDefault(); // 阻止默认的Tab行为
      //  if (gridApi.value) {
      //      gridApi.value.setFocusedCell(gridApi.value.getFocusedCell().rowIndex + 1, gridApi.value.getFocusedCell().column);
       // }
      //}
    }
	onBeforeUnmount(() => {
       // 清理监听器
	   document.removeEventListener('keydown', handleKeyDown);
    });
	//填充id
	function fillIdForRow(rows){
	   //debugger;
	   let i=0;
	   for(i=0;i<rows.length;i++){
	     if(!rows[i].id){
		   rows[i].id = genId();
		 }
	   }
	   console.log('rows:'+JSON.stringify(rows));
	}
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
        //cellEditor:'InputEditor'
      }
      returnVal.push(columnDef)
      columnDef ={
        field: 'field',
        headerName: '字段名称',
        editable:true,
        //cellEditor:'InputEditor'
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
      let columnDef11 = {
        field: 'checkboxSelection',
        headerName:'是否设置数据复选框',
        editable:true,
        cellEditor: "agCheckboxCellEditor",
        cellRenderer: 'agCheckboxCellRenderer',
      }
      returnVal.push(columnDef11)
       columnDef11 = {
        field: 'headerCheckboxSelection',
        headerName:'表头是否显示复选框',
        editable:true,
        cellEditor: "agCheckboxCellEditor",
        cellRenderer: 'agCheckboxCellRenderer',
      }
      returnVal.push(columnDef11)
      columnDef11 = {
        field: 'headerCheckboxSelectionFilteredOnly',
        headerName:'是否过滤后可见行可选',
        editable:true,
        cellEditor: "agCheckboxCellEditor",
        cellRenderer: 'agCheckboxCellRenderer',
      }
      returnVal.push(columnDef11)
      columnDef11 = {
        field: 'lockPinned',
        headerName:'是否冻结列',
        editable:true,
        cellEditor: "agCheckboxCellEditor",
        cellRenderer: 'agCheckboxCellRenderer',
      }
      returnVal.push(columnDef11)
      let columnDef2 = {

        field: 'pinned',
        headerName:'是否固定列',
        editable:true,
        cellEditor: "agCheckboxCellEditor",
        cellRenderer: 'agCheckboxCellRenderer',
      }
      returnVal.push(columnDef2)
      columnDef11 = {
        field: 'lockPosition',
        headerName:'是否禁止拖动列',
        editable:true,
        cellEditor: "agCheckboxCellEditor",
        cellRenderer: 'agCheckboxCellRenderer',
      }
      returnVal.push(columnDef11)
      columnDef11 = {
        field: 'lockVisible',
        headerName:'是否禁用通过菜单更改可见性',
        editable:true,
        cellEditor: "agCheckboxCellEditor",
        cellRenderer: 'agCheckboxCellRenderer',
      }
      returnVal.push(columnDef11)
      let columnDef13 ={
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
      returnVal.push(columnDef13)
      columnDef13 ={
        field: 'maxWidth',
        headerName: '最大宽度',
        cellRenderer: 'AgGridNumberInput',
        cellRendererParams: {
          field: 'maxWidth'
        },
        cellStyle: {
          display: 'flex',
          alignItems: 'center'
        }
      }
      returnVal.push(columnDef13)
      columnDef13 ={
        field: 'minWidth',
        headerName: '最小宽度',
        cellRenderer: 'AgGridNumberInput',
        cellRendererParams: {
          field: 'minWidth'
        },
        cellStyle: {
          display: 'flex',
          alignItems: 'center'
        }
      }
      returnVal.push(columnDef13)
      let columnDef14 = {
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
      returnVal.push(columnDef14)
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
      let columnDef15 = {
        field: 'isCustomRenderer',
        headerName:'是否自定义单元格渲染器',
        editable:true,
        cellEditor: "agCheckboxCellEditor",
        cellRenderer: 'agCheckboxCellRenderer',
        valueSetter: function(params) {
          //debugger;
          // 设置值时的逻辑
          console.log('Cell ' + params.colDef.headerName + ' in row ' + (params.node.id + 1) + ' was changed to ' + params.newValue);
          //改变自定义渲染
          if(params.newValue){
            const rowNode = gridApi.value.getRowNode(params.node.id);
            // console.log('rowNode:'+JSON.stringify(rowNode))
            // 如果行存在，则可以访问它的数据
            if (rowNode) {
              rowNode.data['cellRenderer']='WrapColumnDesignNestedDragItem'
              //渲染参数为空数组
              rowNode.data['cellRendererParams']="[]";
            }else{
              console.log('rowNode不存在')
            }
          }else{
            console.log('清空自定义渲染器')
            const rowNode = gridApi.value.getRowNode(params.node.id);
            rowNode.data['cellRenderer']=null
            rowNode.data['cellRendererParams']= null
          }
          return params.newValue;
        },
		valueGetter: function(params) {
		   //debugger;
		   const rowNode = gridApi.value.getRowNode(params.node.id);
		   //console.log('rowNode:'+JSON.stringify(rowNode))
		   if(rowNode.data['cellRenderer']==='WrapColumnDesignNestedDragItem'){
		       return true;
		   }else{
			   return false;
		   }
		}
      }
      returnVal.push(columnDef15)
      columnDef ={
        field: 'cellRendererParams',
        headerName: '自定义渲染器参数',
        editable:true,
        cellEditor:'InputEditor'
      }
      returnVal.push(columnDef)
      let columnDef3 ={
        field: 'cellRenderer',
        headerName: '自定义渲染器组件(右键菜单设计)',
		    cellRenderer:'WrapColumnDesignNestedDragItem',
        onCellDoubleClicked: onCellDoubleClick
      }
      returnVal.push(columnDef3)
      return returnVal;

    }
    function makeNewRow(){
      let row={
		headerName: '',
		field: '',
		editable: false,
		cellEditor: '',
		cellEditorParams: '',
		cellStyle: '',
		isCustomRenderer: false,
		cellRendererParams:'',
		cellRenderer: null,
		sortable: false,
		resizable: true,
		filter: false,
		pinned: '',
		lockPinned: false,
		lockPosition: false,
		lockVisible: false,
		width: 100,
		maxWidth: 100,
		minWidth: 100,
		headerCheckboxSelection:false,
		checkboxSelection:false,
		headerCheckboxSelectionFilteredOnly:false,
		id:''
		};
	  row.id = genId();
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

function handleMenuClick(item: MenuOption, ev: PointerEvent) {
  if (item.command === 'designer') {

	// debugger;
	if(contextmenuRow.value['cellRenderer']==='WrapColumnDesignNestedDragItem'){
       console.log('handleMenuClick currentRowId:'+currentRowId.value)
		   const rowNode = gridApi.value.getRowNode(currentRowId.value);

		   if(rowNode){
			  console.log('handleMenuClick cellRendererParams:'+rowNode.data["cellRendererParams"]);
			  pageInfo.value.children = JSON.parse(rowNode.data.cellRendererParams)
			  cellRendererParams.value = pageInfo.value.children
			  dialogVisible.value = true
			  currentRow.value = contextmenuRow.value;
		   }
		}

	}

}
// 多选框选中数据
    function handleSelectionChange(event) {
      console.log('enter handleSelectionChange')
      let selectedRows = gridApi.value.getSelectedRows();
      multiple.value = (selectedRows.length >=1)
    }
    //双击自定义渲染器
    function onCellDoubleClick(event) {
      //CellDoubleClickedEvent 包含 column: Column<TValue>;
      // colDef: ColDef<TData, TValue>;
      // // The value for the cell if available otherwise undefined.
      // value: TValue | null | undefined;
      // // The user provided data for the row. Data is `undefined` for row groups.
      // data: TData | undefined;
      // currentRowIndex = event.
      //设置当前自定义参数
	  //debugger;

    }
    //回填组件设计
    function updatedesigner(formSchema){
      debugger;
      console.log('enter updatedesigner:'+formSchema)
      dialogVisible.value = false
      if(formSchema){
        //更新当前行的cellRendererParams
        contextmenuRow.value['cellRendererParams'] = formSchema


        //const res = gridApi.value.applyTransaction({ update: itemsToUpdate });
        console.log('updatedesigner currentRowId:'+currentRowId.value)
        const rowNode = gridApi.value.getRowNode(currentRowId.value);
        rowNode.data['cellRendererParams'] = formSchema;
        const itemsToUpdate = [rowNode.data];
        gridApi.value.applyTransaction({ update: itemsToUpdate });
        gridApi.value.redrawRows({ rowNodes: [rowNode] });
        const rowNode1 = gridApi.value.getRowNode(currentRowId.value);
        if(rowNode1.data['cellRendererParams']===formSchema){
           console.log('update success!');
        }else{
          console.log('update fail!');
        }
		//改变对应的行
		// for(let i=0;i<rowDatas.value.length;i++){
		//    if(rowDatas.value[i].id === contextmenuRow.value['id']){
		//       rowDatas.value[i].cellRendererParams = formSchema
		// 	  console.log('update rowDatas row id:'+rowDatas.value[i].id);
		// 	  break;
		//    }
		// }

      }
    }
	function handleClickMenuOutside() {
		menuRef.value?.hide()
	}
</script>

<style >
.my-grid .ag-body-viewport {
  overflow-x: auto;
}

.my-grid .ag-body-viewport::-webkit-scrollbar {
  width: 10px;  /* 水平滚动条的宽度 */
  height: 10px; /* 垂直滚动条的高度 */
}

.my-grid .ag-body-viewport::-webkit-scrollbar-thumb {
  background-color: darkgrey; /* 滚动条的颜色 */
  border-radius: 10px; /* 滚动条的圆角 */
}

.my-grid .ag-body-viewport::-webkit-scrollbar-track {
  background-color: lightgrey; /* 滚动条轨道的颜色 */
}

/* 兼容非Webkit浏览器的样式 */
.my-grid .ag-body-viewport {
  scrollbar-width: thin;
  scrollbar-color: darkgrey lightgrey;
}
</style>
