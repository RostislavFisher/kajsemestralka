<script>
export default {
  name: "Module",
  props: {
    module: Object

  }
}
</script>

<template>
  <div>
    {{module.name}}
  </div>
</template>

<style scoped>

</style>