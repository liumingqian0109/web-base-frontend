<template>
  <div>
    <el-tree :data="tree" :props="props" show-checkbox @node-click="handleNodeClick"></el-tree>
  </div>
</template>
<script>
import { treeList } from '@/api/role'
export default {
  data() {
    return {
      props: {
        label: 'label',
        children: 'children'
      },
      tree: Array
    }
  },
  created() {
    this.treeRole()
  },
  methods: {
    handleNodeClick(data) {
      console.log(data)
    },
    treeRole() {
      treeList().then(response => {
        this.tree = response.data.treeRole
      })
    }
  }
}
</script>
