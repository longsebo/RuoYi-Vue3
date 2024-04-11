<template>
  <div class="app-container">
    <SearchForm/>
    <NormalListToolbar/>

<!--    <ElPlusTable/>-->
    <AgGridTable :columnDefs="columnDefs" />
    <NormalListDialog/>

  </div>
</template>

<script setup name="Application">
import SearchForm from "@/components/form/components/form/searchform/SearchForm.vue"
import ElPlusTable from '@/components/common/table/elplustable/ElPlusTable.vue';
import NormalListToolbar from '@/components/common/toolbar/NormalListToolbar.vue';
import NormalListDialog from   '@/components/common/dialog/NormalListDialog.vue';
import AgGridTable from '@/components/common/table/aggrid/AgGridTable.vue'
import bus  from "@/event/bus";
import {onMounted} from "vue";
import {executeQueryKey} from "../../../config/app.keys";
const columnDefs = [
  {headerName: 'id', field: 'id'}
    , {headerName: '应用编码', field: 'applicationCode'}
    , {headerName: '应用名称', field: 'applicationName'}
    , {headerName: '备注', field: 'remark'}
]

onMounted(() => {
  bus.emit(executeQueryKey)
})
</script>
