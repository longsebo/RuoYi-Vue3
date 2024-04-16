import { genId } from "@/components/form/designer/util/common";

export const DisplayComponents: CandidateComponentConfig[] = [
  {
    id: genId(),
    icon: 'TextField',
    component: 'label-field',
    category: 'display',
    title: "标签",
    attrs: {
      value: '111111111'
    },
  },
]

export const ButtonComponents: CandidateComponentConfig[] = [
  {
    id: genId(),
    icon: 'ali_button',
    component: 'normal-button',
    category: 'button',
    title: "普通按钮",
    attrs: {
      size:'default',
      type:'primary',
      plain:false,
      text:true,
      bg:false,
      link:false,
      round:false,
      circle:false,
      loading:false,
      disabled:false,
      autofocus:false,
      label:'按钮',
      operationtype:'api',//有效值:api,page
      //操作数据
      operationdata:{interfaceCode:'',
        pageCode:'',
        parameterList:[]}

    },
  },
  {
    id: genId(),
    icon: 'Search',
    component: 'search-design-button',
    category: 'button',
    title: "查询按钮",
    attrs: {
      size:'default',
      type:'primary',
      plain:false,
      text:true,
      bg:false,
      link:false,
      round:false,
      circle:false,
      loading:false,
      disabled:false,
      autofocus:false,
      label:'查询按钮',
      //操作数据
      operationdata:{
        interfaceCode:'',
        parameterList:[]
      }
    },
  },
]
export const InputComponents: CandidateComponentConfig[] = [
  {
    id: genId(),
    icon: 'NumberField',
    component: 'number-input',
    category: 'form-item',
    title: "数字",
    formItemAttrs: {
      label: "数字",
    },
    attrs: {
      placeholder: '输入数字',
      min: 1,
      max: 100,
      clearable: false,
      style: `width: 100%`
    },
    children: []
  },
  {
    id: genId(),
    icon: 'TextField',
    component: 'text-input',
    category: 'form-item',
    title: "文本框",
    formItemAttrs: {
      label: "文本框",
    },
    attrs: {
      placeholder: '输入字符串',
      clearable: false,
      showWordLimit: false,
      autofocus: false,
      validateEvent: false,
      style: `width: 100%`
    }
  },

  {
    id: genId(),
    icon: 'TimeField',
    component: 'date-picker',
    category: 'form-item',
    title: "日期",
    formItemAttrs: {
      label: "日期",
    },
    attrs: {
      dateType: 'date',
      placeholder: '输入日期',
      format: 'YYYY-MM-DD',
      valueFormat: 'YYYY-MM-DD',
      style: `width: 100%`
    },
    children: []
  },
  {
    id: genId(),
    icon: 'TimeField',
    component: 'date-range-picker',
    category: 'form-item',
    title: "日期范围",
    formItemAttrs: {
      label: "日期范围",
    },
    attrs: {
      dateRangeType: 'daterange',
      format: 'YYYY-MM-DD',
      valueFormat: 'YYYY-MM-DD',
      style: `width: 100%`
    },
    children: []
  },

  {
    id: genId(),
    icon: 'RadioButton',
    component: 'single-select',
    category: 'form-item',
    title: "单选框",
    formItemAttrs: {
      label: "单选框",
    },
    attrs: {
      placeholder: '选择一个选项',
      clearable: false,
      size: 'default',
      expand: false,
      buttonOption: false,
      renderAfterExpand: false,
      options: [
        {
          id: '1',
          name: 'Option1',
          disabled: false,
        },
        {
          id: '2',
          name: 'Option2',
          disabled: true,
        },
        {
          id: '3',
          name: 'Option3',
          disabled: false,
        },
      ],
      style: `width: 100%`
    }
  },
  {
    id: genId(),
    icon: 'CheckboxChecked',
    component: 'multi-select',
    category: 'form-item',
    title: "多选框",
    formItemAttrs: {
      label: "多选框",
      labelWidth: "120px",
      required: false,
    },
    attrs: {
      placeholder: '选择多个选项',
      clearable: false,
      size: 'default',
      expand: false,
      buttonOption: false,
      renderAfterExpand: false,
      options: [
        {
          id: '1',
          name: 'Option1',
          disabled: false,
        },
        {
          id: '2',
          name: 'Option2',
          disabled: true,
        },
        {
          id: '3',
          name: 'Option3',
          disabled: false,
        },
      ],
      style: `width: 100%`
    }
  },
  {
    id: genId(),
    icon: 'User',
    component: 'user-select',
    category: 'form-item',
    title: "用户单选框",
    formItemAttrs: {
      label: "用户单选框",
      labelWidth: "120px",
      required: false,
    },
    attrs: {
      multiple: false,
      placeholder: '',
      style: `width: 100%`
    }
  },
  {
    id: genId(),
    icon: 'User',
    component: 'user-select',
    category: 'form-item',
    title: "用户多选框",
    formItemAttrs: {
      label: "用户多选框",
      labelWidth: "120px",
      required: false,
    },
    attrs: {
      multiple: true,
      placeholder: '',
      style: `width: 100%`
    }
  },
  {
    id: genId(),
    icon: 'Department',
    component: 'dept-select',
    category: 'form-item',
    title: "部门单选框",
    formItemAttrs: {
      label: "部门单选框",
      labelWidth: "120px",
      required: false,
    },
    attrs: {
      multiple: false,
      placeholder: '',
      style: `width: 100%`
    }
  },
  {
    id: genId(),
    icon: 'Department',
    component: 'dept-select',
    category: 'form-item',
    title: "部门多选框",
    formItemAttrs: {
      label: "部门多选框",
      labelWidth: "120px",
      required: false,
    },
    attrs: {
      multiple: true,
      placeholder: '',
      style: `width: 100%`
    }
  },
  {
    id: genId(),
    icon: 'ali_dropdownselection',
    component: 'ruoyi-el-select',
    category: 'form-item',
    title: "下拉选择框",
    formItemAttrs: {
      label: "下拉选择框",
    },
    attrs: {
      placeholder: '请选择',
      clearable: false,
      size: 'default',//有效选项 ：large' | 'default' | 'small
      multiple:false,
      optionsSource:'input', //有效选择来源：input,dict
      options: [ // 每项内容是label,value
      ],
      style:'width:100%',
      dictType:'',//字段类型
      disabled:false,
      collapseTags:false,//多选是否折叠标签
      collapseTagsTooltip:false,//折叠标签提示
      maxCollapseTags:1,//需要显示的 Tag 的最大数量 只有当 collapse-tags 设置为 true 时才会生效。
      value:''
    }
  },
]
export const LayoutComponents: CandidateComponentConfig[] = [
  {
    id: genId(),
    component: 'el-row',
    category: 'layout',
    icon: 'Table',
    title: "栅格",
    attrs: {
      gutter: 4,
      justify: 'start',
      align: 'top',
      tag: 'div',
    },
    children: [
      {
        id: genId(),
        component: 'el-col',
        category: 'layout',
        title: "格子",
        attrs: {
          span: 12,
        },
        children: [],
      },

    ],
  },
  {
    id: genId(),
    component: 'table',
    category: 'layout',
    icon: 'Table',
    title: "表格",
    attrs: {  },
    children: [
      {
        id: genId(),
        component: 'tr',
        category: 'layout',
        title: "行",
        attrs: {
          colspan: 1,
        },
        children: [
          {
            id: genId(),
            component: 'td',
            category: 'layout',
            title: "列",
            attrs: {
              rowspan: 1,
            },
            children: [],
          },
          {
            id: genId(),
            component: 'td',
            category: 'layout',
            title: "列",
            attrs: {
              rowspan: 1,
            },
            children: [],
          },
          {
            id: genId(),
            component: 'td',
            category: 'layout',
            title: "列",
            attrs: {
              rowspan: 1,
            },
            children: [],
          },
        ],
      },
      {
        id: genId(),
        component: 'tr',
        category: 'layout',
        title: "行",
        attrs: {
          colspan: 1,
        },
        children: [
          {
            id: genId(),
            component: 'td',
            category: 'layout',
            title: "列",
            attrs: {
              rowspan: 1,
            },
            children: [],
          },
          {
            id: genId(),
            component: 'td',
            category: 'layout',
            title: "列",
            attrs: {
              rowspan: 1,
            },
            children: [],
          },
          {
            id: genId(),
            component: 'td',
            category: 'layout',
            title: "列",
            attrs: {
              rowspan: 1,
            },
            children: [],
          },
        ],
      },

    ],
  },
]
export const TableComponents: CandidateComponentConfig[] = [
  {
    id: genId(),
    icon: 'ali_table',
    component: 'ruoyi-ag-grid',
    category: 'table',
    title: "表格",
    formItemAttrs: {
      label: "",
    },
    attrs: {
      //表格全局配置
      checkboxSelection: false, //设置数据复选框
      headerCheckboxSelection: false,  //表头是否也显示复选框，用于全选反选用
      rowSelection: 'multiple', //设置多行选中 ，若是single
      rowHeight:"30",//行高
      width:"80",//列宽
      columnDefs: [ //表格列配置
        // {
        //   headerName: "列1",//显示的列名称
        //   field: "column1",//数据字段
        //   editable: true,//是否可编辑
        //   sortable: true,//是否可排序
        //   filter: true,//是否可筛选
        //   resizable: true,//是否可调整列大小
        //   checkboxSelection: true,//设置数据复选框
        //   headerCheckboxSelection: true,//表头是否也显示复选框，用于全选反选用
        //   headerCheckboxSelectionFilteredOnly: true,//标题复选框选择将只选择筛选的项目
        //   lockPinned: true,//是否冻结列
        //   pinned: true,//是否固定列 'left' | 'right',true相当于left
        //   lockPosition: true,//禁止拖动列的位置
        //   lockVisible: true,//禁用通过菜单更改可见性
        //   width: 100,//列宽
        //   minWidth: 100,//最小列宽
        //   maxWidth: 100,//
        //   cellEditor: '',//内置编辑器：文本编辑器（text）,选择框编辑器（select）,日期选择器（date）,数字编辑器（number）
        //                   //组合框编辑器（richSelect）,大组合框编辑器（largeSelect）,打开文本编辑器（bigSelect）
        //   cellEditorParams: {
        //   },//编辑器参数 select ,richSelect,largeSelect,bigSelect  格式为：values: ['Ireland', 'Spain', 'Germany']
        //   cellStyle: {
        //     'text-align': 'center',
        //   },
        //   // isCustomRenderer:false,//是否自定义单元格渲染器
        //   cellRenderer: null,//当自定义渲染组件时，固定为NestedDragItem可以拖拽嵌套组件，可以往拖拽其他组件
        //   cellRendererParams: {
        //   },//渲染器参数
        // }
      ],
      //style: "height: 300px; width: 400px;",
      tableHeight:'300px',
      tableWidth:'400px',
      dataSourceType:'input',//数据源类型：input(手工录入),bindcomponent(绑定组件)
      rowData:[],//行数据
      bindComponent:'',//绑定组件,通常为查询按钮，用于按钮查询数据后，通知表格更新数据
      rowSelectTriggerComponents:'',//行选择触发组件，通知组件进行处理
    }
  },
]

export const ContainerComponents: CandidateComponentConfig[] = [
  {
    id: genId(),
    icon: 'ali_search_form',
    component: 'search-form',
    category: 'container',
    title: "查询Form",
    formItemAttrs: {
      label: "",
      labelWidth: "120px",
      required: false,
    },
    attrs: {
      children:'[]'
    }
  }
]
