<template>
  <div class="app-container">
    <SearchForm/>
    <NormalListToolbar/>

    <ElPlusTable/>
    <NormalListDialog/>

  </div>
</template>

<script setup name="Application">
import SearchForm from '@/components/common/form/searchform/SearchForm.vue';
import ElPlusTable from '@/components/common/table/ElPlusTable.vue';
import NormalListToolbar from '@/components/common/toolbar/NormalListToolbar.vue';
import NormalListDialog from   '@/components/common/dialog/NormalListDialog.vue';

import bus  from "@/event/bus";
import {onMounted} from "vue";
import {executeQueryKey} from "../../../config/app.keys";
onMounted(() => {
  bus.emit(executeQueryKey)
})
</script>
