<template>
  <el-container style="height: 100vh;">
    <el-header>
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5"><el-button link type="primary" icon="Plus" @click="handleAdd()" v-hasPermi="['business:interface:adddesignsql']">新增</el-button></el-col>
        <el-col :span="1.5"><el-button link type="primary" icon="Delete" @click="handleDelete()" v-hasPermi="['business:interface:removedesignsql']">删除</el-button></el-col>
      </el-row>
    </el-header>
    <el-main>
    </el-main>
    <el-footer>
      <div class="resizable" v-resize="onResize">
        <!-- 这里是你的底部内容 -->
        底部内容
      </div>
    </el-footer>
    <!--添加表 -->
    <el-dialog title="选择表" v-model="openSelectTab" width="500px" append-to-body>
      <el-form ref="tableFormRef" :model="form" :rules="tableFormRules" label-width="80px">
        <el-form-item label="选择表" prop="tableEnName">
          <el-tree-select
              v-model="form.modelDefId"
              :data="treeModelDef"
              :render-after-expand="false"
              style="width: 240px"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="selectTable">确 定</el-button>
          <el-button @click="openSelectTab=false">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </el-container>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import { tree,getDef,getAllField } from "@/api/business/def";
import { onMounted,Directive, DirectiveBinding, onBeforeUpdate,ref } from 'vue';

    const  form=ref({});
    const  tableFormRules=ref({
        tableEnName: [
          { required: true, message: "请选择表", trigger: "blur" }
        ],
      })
    const  treeModelDef=ref([])
    const  openSelectTab=ref(false)
    const  modelDefs=ref([])

    const Resize:Directive = {
        bind(el, binding) {
          const onResize = () => {
            let height = window.innerHeight - el.getBoundingClientRect().top;
            el.style.height = `${height}px`;
            binding.value && binding.value();
          };
          onResize();
          window.addEventListener('resize', onResize);

          el['onResize'] = onResize;
        },
        unbind(el) {
          window.removeEventListener('resize', el['onResize']);
        },
    };
    function  onResize() {
        // 这里可以添加你想要执行的代码，比如更新数据等
      }
    function  handleAdd() {
        openSelectTab.value = true
      }
    function  handleDelete(){

      }
    async function selectTable() {
      //检查目前是否有模型，有则提示，只能增加一个表;否则模型列表增加一个
      if (modelDefs.length > 0) {
        ElMessage('目前只支持一张表!请删除后再加入');
        return
      } else {
        //根据模型定义id查询模型
        let resp = await getDef(form.modelDefId)
        let modelDef = resp.data;
        //构造新模型加入模型列表
        let newModelDef={
          alias:'',
          cnName:'',
          enName:'',
          columns:[]
        }
        resp = await getAllField(modelDef);
        newModelDef.cnName = modelDef.cnName;
        newModelDef.enName = modelDef.enName;
        newModelDef.columns = resp.data;
        modelDefs.push(newModelDef);
      }
      openSelectTab.value = false;

    }
      /** 获取接口树列表 */
      function getTreeModelDef(){
      let tmp={};
      tree(tmp).then(response => {
        treeModelDef.value = response.data;
      });
     }


     onMounted(()=>{
       getTreeModelDef()
    })


</script>

<style>
.resizable {
  overflow: auto;
  resize: vertical;
  cursor: n-resize;
  /* 设置一个初始高度 */
  height: calc(100vh - 100px);
  /* 设置边框以便于拖拽 */
  border-top: 2px solid #000;
}

.resizable:hover {
  border-top-color: #333;
}
</style>
