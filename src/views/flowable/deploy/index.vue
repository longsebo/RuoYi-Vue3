<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="流程名称" prop="processName">
        <el-input
          v-model="queryParams.processName"
          placeholder="请输入流程名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="流程标识" prop="processKey">
        <el-input
          v-model="queryParams.processKey"
          placeholder="请输入流程标识"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="流程分类" prop="category">
      <el-select
          v-model="queryParams.category"
          placeholder="流程分类"
          clearable
          style="width: 240px"
      >
        <el-option
            v-for="item in flowCategory"
            :key="item.code"
            :label="item.name"
            :value="item.code"
        />
      </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <el-select v-model="state" size="small" clearable placeholder="请选择状态">
          <el-option :key="1" label="激活" value="active" />
          <el-option :key="2" label="挂起" value="suspended" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['flowable:deploy:remove']"
        >删除</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="deployList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="流程名称" align="center" :show-overflow-tooltip="true">
        <template #default="scope">
          <el-button link @click="handleProcessView(scope.row)" type="primary" key="primary" >
            <span>{{ scope.row.processName }}</span>
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="流程标识" align="center" prop="processKey" />
      <el-table-column label="流程分类" align="center" prop="category" :formatter="categoryFormat" />
      <el-table-column label="流程版本" align="center" prop="version" >
        <template #default="scope">
          <el-tag size="small" >version{{ scope.row.version }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="流程状态" align="center" prop="suspended" >
        <template #default="scope">
          <el-tag type="success" v-if="!scope.row.suspended">激活</el-tag>
          <el-tag type="warning" v-if="scope.row.suspended">挂起</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="部署时间" align="center" prop="deploymentTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.deploymentTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
              link
              size="small"
              :icon="suspendIcon"
              v-if="!scope.row.suspended"
              @click.native="handleChangeState(scope.row, 'suspended')"
              v-hasPermi="['flowable:deploy:status']"
          >挂起</el-button>
          <el-button
              link
              size="small"
              :icon="activeIcon"
              v-if="scope.row.suspended"
              @click.native="handleChangeState(scope.row, 'active')"
              v-hasPermi="['flowable:deploy:status']"
          >激活</el-button>
          <el-button
              link
              size="small"
              :icon="versionIcon"
              @click="handlePublish(scope.row)"
              v-hasPermi="['flowable:deploy:publishList']"
          >版本管理</el-button>
          <el-button
              link
              size="small"
              icon="Delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['flowable:deploy:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
    <!-- 流程查看界面-->
    <el-dialog :title="processView.title"  v-model="processView.open" width="80%" height="80%" :append-to-body="false">
      <WorkflowView  :bpmnXml="processView.bpmnXml" style="height: 90vh" />
    </el-dialog>
    <!-- 版本管理 -->
    <el-dialog title="版本管理" v-model="publish.open" width="80%" height="80%" :append-to-body="false" >
      <el-table  :data="publish.dataList" height="100%" style="width: 100%">
        <el-table-column label="流程名称" align="center" :show-overflow-tooltip="true">
          <template #default="scope">
            <el-button link="true" @click="handleProcessView(scope.row)" type="primary" key="primary" >
              {{ scope.row.processName }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="流程标识" align="center" prop="processKey" :show-overflow-tooltip="true" />
        <el-table-column label="流程版本" align="center">
          <template #default="scope">
            <el-tag size="small" >v{{ scope.row.version }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template #default="scope">
            <el-tag type="success" v-if="!scope.row.suspended">激活</el-tag>
            <el-tag type="warning" v-if="scope.row.suspended">挂起</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-button
                link
                size="small"
                :icon="suspendIcon"
                v-if="!scope.row.suspended"
                @click.native="handleChangeState(scope.row, 'suspended')"
                v-hasPermi="['workflow:deploy:status']"
            >挂起</el-button>
            <el-button
                link
                size="small"
                :icon="activeIcon"
                v-if="scope.row.suspended"
                @click.native="handleChangeState(scope.row, 'active')"
                v-hasPermi="['workflow:deploy:status']"
            >激活</el-button>
            <el-button
                link
                size="small"
                icon="Delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['workflow:deploy:remove']"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
          v-show="publishTotal > 0"
          :total="publishTotal"
          :page.sync="publishQueryParams.pageNum"
          :limit.sync="publishQueryParams.pageSize"
          @pagination="getPublishList"
      />
    </el-dialog>
  </div>
</template>

<script setup name="Deploy" lang="ts">
import { listDeploy,  delDeploy, publishList,changeState,getBpmnXml } from "@/api/flowable/deploy";
import { useIcon } from "@/components/common/util";
import WorkflowView from "@/components/Flowable/bpmn/view.vue";
import InitBPMNXml from '@/assets/bpmn/empty.bpmn20.xml?raw'
import {listCategory} from "@/api/flowable/category";
import {ref} from "vue";
const { proxy } = getCurrentInstance();

const deployList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const versionIcon = useIcon('ali_version')
const activeIcon = useIcon('ali_active')
const suspendIcon = useIcon('ali_suspend')
const flowCategory = ref([]);
const state = ref('');
const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    definitionId: null,
    processName: null,
    processKey: null,
    category: null,
    version: null,
    deploymentId: null,
    suspended: null,
    deploymentTime: null
  },
  rules: {
  },
  processView:{
    title: '',
    open:false,
    modelId:undefined,
    bpmnXml:''
  },
  publishQueryParams: {
    pageNum: 1,
    pageSize: 10,
    processKey: ""
  },
  publish: {
    open: false,
    loading: false,
    dataList: []
  },
  publishTotal: 0
});

const { queryParams, form, rules,processView,publishQueryParams,publish,publishTotal } = toRefs(data);

/** 查询流程部署列表 */
function getList() {
  loading.value = true;
  listDeploy(queryParams.value).then(response => {
    deployList.value = response.rows;
    total.value = response.total;
    loading.value = false;
    //恢复状态
    // if(typeof(queryParams.value.suspended)!="undefined") {
    //   if (!queryParams.value.suspended) {
    //     queryParams.value.suspended = 'active';
    //   } else {
    //     queryParams.value.suspended = 'suspended';
    //   }
    // }
  });
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    definitionId: null,
    processName: null,
    processKey: null,
    category: null,
    version: null,
    deploymentId: null,
    suspended: null,
    deploymentTime: null
  };
  proxy.resetForm("deployRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  //转换一下状态
  if(state.value) {
    if (state.value == 'active') {
      queryParams.value.suspended = false;
    } else if(state.value=='suspended'){
      queryParams.value.suspended = true;
    }else{
      queryParams.value.suspended = null;
    }
  }else {
    queryParams.value.suspended = null;
  }
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.deploymentId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}


/** 查看流程图 */
function handleProcessView(row) {
  let definitionId = row.definitionId;
  // 发送请求，获取xml
  getBpmnXml(definitionId).then(response => {
    let xml ='' ;
    if(response.data!='' && typeof(response.data)!="undefined") {
      xml = response.data.replaceAll('\\"','"')
          .replaceAll('\\n','')
    }else{
      xml = InitBPMNXml;
    }
    processView.value={
      modelId:definitionId,
      open:true,
      title:'流程图',
      bpmnXml:xml
    }
  })
  //this.processView.open = true;
}
function getPublishList() {
  //publish.loading = true;
  publishList(publishQueryParams).then(response => {
    publish.value={
      dataList: response.rows,
      open:true,
      loading:false
    }
    publishTotal.value = response.total;

  })
}
function handlePublish(row) {
   publishQueryParams.processKey = row.processKey;

   getPublishList();

}
/** 挂起/激活流程 */
function handleChangeState(row, state) {
  const params = {
    definitionId: row.definitionId,
    processKey:row.processKey,
    state: state
  }
  changeState(params).then(res => {
    proxy.$modal.msgSuccess(res.msg)
    publishQueryParams.processKey = row.processKey;
    getList();
    //刷新对话框
    publishQueryParams.processKey = row.processKey;
    if(data.publish.open) {
      publishList(publishQueryParams).then(response => {
        publish.value = {
          dataList: response.rows,
          open:data.publish.open,
          loading: false
        }
        publishTotal.value = response.total;
      })
    }
  });
}



/** 删除按钮操作 */
function handleDelete(row) {
  const _definitionIds = row.deploymentId || ids.value;
  proxy.$modal.confirm('是否确认删除流程部署编号为"' + row.processName + '"的部署？').then(function() {
    return delDeploy(_definitionIds);
  }).then(() => {
    getList();
    if(data.publish.open) {
      publishList(publishQueryParams).then(response => {
        publish.value = {
          dataList: response.rows,
          open:data.publish.open,
          loading: false
        }
        publishTotal.value = response.total;
      })
    }
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/**
 * 翻译分类编码
 * @param row
 * @param column
 * @returns {*|string}
 */
function  categoryFormat(row, column){
  return flowCategory.value.find(k => k.code === row.category)?.name ?? '';
}

/**
 * 获取流程分类
 */
function getFlowCategory(){
  listCategory().then(res=>{
    console.log(res)
    flowCategory.value = res.rows;
  });
}
getList();
getFlowCategory();
</script>
