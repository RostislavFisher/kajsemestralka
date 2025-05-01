<script>
export default {
  name: "Module",
  props: {
    module: Object

  }
}
</script>

<template>
  <div class="module">
    <h2>{{ module.name }}</h2>
    <p v-if="module.isToggled !== undefined"><strong>Active:</strong> {{ module.isToggled ? 'Yes' : 'No' }}</p>
    <p v-if="module.value !== undefined"><strong>Value:</strong> {{ module.value }}</p>
  </div>
</template>

<style scoped>
.module {
  border: 1px solid #ccc;
  padding: 10px;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  border-radius: 5px;
  background-color: #f9f9f9;
  width:250px;
}
</style>
