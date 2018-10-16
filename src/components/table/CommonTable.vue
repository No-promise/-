<template>
  <div>
    <slot></slot>
    <slot name="functions"></slot>
    <el-table-column
      v-for="(item, index) in propData"
      :prop="item.prop"
      :label="item.label"
      :key="index"
      :formatter="item.formatter"
      :width="item.width"
      align="center">
    </el-table-column>
    <slot name="status"></slot>
  </div>
</template>

<script>
export default {
  name: 'CommonTable',
  data () {
    return {
    }
  },
  props: {
    propData: Array
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
