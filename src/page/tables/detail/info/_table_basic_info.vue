<template>
  <div id="table-basic-info">
    <el-table :data="data" style="width: 100%;margin:20px 0 30px;height:100%">
      <el-table-column prop="key" label="Configuration Item" width="300">
      </el-table-column>
      <el-table-column prop="value" label="Value">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style>
#table-basic-info {
  padding: 0 10px;
}
</style>
