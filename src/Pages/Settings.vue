<script>
export default {
  name: "Settings",
  data() {
    return {
      city: localStorage.getItem("city") || "Praha",
      weatherAPIKey: localStorage.getItem("weatherAPIKey") || ""
    }
  },
  methods: {
    save() {
      localStorage.setItem("city", this.city);
      localStorage.setItem("weatherAPIKey", this.weatherAPIKey);
      localStorage.setItem("cityTemp", "");
    },
    reset() {
      localStorage.clear();
    }
  }

}
</script>

<template>
<div>
<input v-model="city">
<input v-model="weatherAPIKey">
</div>
  <button v-on:click="reset">Reset</button>
  <button v-on:click="save">Save</button>
</template>

<style scoped>

</style>