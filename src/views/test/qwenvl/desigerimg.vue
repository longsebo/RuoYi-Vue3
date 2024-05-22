<template>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column prop="role" label="角色" width="180"></el-table-column>
    <el-table-column prop="permissions" label="权限字节" width="180"></el-table-column>
    <el-table-column prop="limit" label="限制字符"></el-table-column>
    <el-table-column prop="value" label="数值"></el-table-column>
  </el-table>
  <div style="display: flex; justify-content: space-between; margin-top: 20px;">
    <div>
      <span style="margin-right: 10px;">2022-12-29 创建时间</span>
      <span style="margin-right: 10px;">修改日期</span>
    </div>
    <div>
      <el-button type="primary">创建</el-button>
      <el-button>保存</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        { role: '', permissions: '', limit: '', value: '' },
        { role: '编辑器/管理员', permissions: 'admin', limit: '', value: '8653,67' },
        // 更多行数据...
      ]
    };
  }
};
</script>
