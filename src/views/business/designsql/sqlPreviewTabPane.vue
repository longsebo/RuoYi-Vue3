<template>
  <el-container style="height: 100vh;">
    <el-header>
      <el-row>
        <el-col>
          <el-button type="primary" icon="Refresh" @click="reGengeralSql" />
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <el-input type="textarea" :rows="20" v-model="textarea" readonly>
      </el-input>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import {defineProps, ref, watch} from "vue"
import {generatesql} from "@/api/business/interface"
const textarea =ref('')
const props= defineProps({
  designModel: {
    type:Object,
    default: () => [{
      selectColumnTabModel: {
        type: Array,
        default: () => [{
          columAndExp: String,//列/表达式
          alias: String,//alias
          aggregation: String,//聚合
          group: Boolean,//是否分组
          chineseName: String,//中文名
          orgTableName: String,//原始表名
          tableAlias: String,//表别名
          fieldName: String,//字段名
          datasourceName:String,//数据源名称
        }]
      },
      distinct: {
        type: Boolean
      },
      conditionTreeModel: {
        type: Object,
        default: () => [{
          type: Number,
          conditionRelaType:String,//条件关系类型:All,Any,None,NotAll
          parentLevel: String,//父级层次
          currentLevel: Number,//当前级别
          childConditionTreeModels: Array,//子树模型
          left: String,//	左边操作列/表达式
          operator: String,//操作符
          right: String,// 右边操作列/表达式
          id:String,//行唯一标识=parentLevel+"."+currentLevel
        }]
      },
      groupConditionTreeModel: {
        type: Object
      },
      tablesModel: {
        type: Array,
        default: () => [{
          orgTableName: String,//原始表名
          tableAlias: String,//表别名
          tableCnName: String,//表中文名
          datasourceName: String,//数据源
          x: Number,
          y: Number,
          h: Number,
          w: Number,
          active: Boolean,
          columns: {
            type: Array,
            default: () => [{
              fieldName: String,//字段英文名
              fieldCnName: String,//字段中文名
            }]
          }
        }]
      },
      sortColumnModel: {
        type: Array,
        default: () => [{
          orgTableName: String,//原始表名
          tableAlias: String,//表别名
          columAndExp: String,//列/表达式
          alias: String,//列别名
          fieldName: String,//字段名
          descending: Boolean,//是否倒排
        }]
      },
      tableJoinModels: {
        type: Array,
        default: () => [{
          joinType: String,//表关联类型
          tableAlias: String,//表别名
          tableCnName: String,//表中文名
          dbColumnJoinModels: {
            type: Array,
            default: () => [{
              operatorSign: String,//操作符
              startColumnName: String,//开始列名
              endColumnName: String,//结束列名
              startPt: {
                type: Object,
                default: () => [{
                  x: Number,
                  y: Number
                }]
              },//开始点
              endPt: {
                type: Object,
                default: () => [{
                  x: Number,
                  y: Number
                }]
              },//结束点
              startIndex: Number,//开始索引
              endIndex: Number,//结束索引
              modelRect: {
                type: Object,
                default: () => [{
                  x: Number,
                  y: Number,
                  width: Number,
                  height: Number
                }]
              }
            }]
          }
        }]
      },
    }]
  }
})
watch(() => props,
    (newVal) =>{
      //调用生成sql接口
      console.log(newVal)
      generatesql(props.designModel).then(res => {
        console.log(res)
        textarea.value=res.data
      })
    },{deep: true,immediate: true}
)
function reGengeralSql(){
  generatesql(props.designModel).then(res => {
    console.log(res)
    textarea.value=res.data
  })
}
</script>

<style scoped>

</style>
