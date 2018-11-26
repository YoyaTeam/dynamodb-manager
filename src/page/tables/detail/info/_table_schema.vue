<template>
  <div id="table-schema">
    <vue-json-pretty :data="tableJsonSchema" :showLength="false">
    </vue-json-pretty>
  </div>
</template>

<script>
import VueJsonPretty from 'vue-json-pretty'
export default {
  components: {
    VueJsonPretty
  },
  props: {
    tableJsonSchema: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

<style>
#table-schema {
  height: 100%;
}
.vjs__tree .vjs__tree__content {
  padding-left: 2em;
  font-size: 12px;
}
.vjs__tree .vjs__value__string {
  color: #009688;
}
.vjs__tree {
  font-family: 'Avenir', Helvetica, Arial, sans-serif !important;
  font-size: 12px;
}
</style>
