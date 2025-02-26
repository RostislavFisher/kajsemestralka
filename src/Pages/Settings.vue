<script>
export default {
  name: "Settings",
  data() {
    return {
      city: localStorage.getItem("city") || "Praha"
    }
  },
  methods: {
    save() {
      localStorage.setItem("city", this.city);
    }
  }

}
</script>

<template>
<div>
<input v-model="city">
</div>
  <button v-on:click="save">Save</button>
</template>

<style scoped>

</style>