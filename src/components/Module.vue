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
    <h2>{{ module.name }}</h2>
    <p v-if="module.isToggled !== undefined"><strong>Active:</strong> {{ module.isToggled ? 'Yes' : 'No' }}</p>
    <p v-if="module.value !== undefined"><strong>Value:</strong> {{ module.value }}</p>
  </div>
</template>

<style scoped>
div {
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 5px;
  width: 200px;
  background-color: #f9f9f9;
}
</style>
