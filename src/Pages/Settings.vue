<script>
export default {
  name: "Settings",
  data() {
    return {
      city: localStorage.getItem("city") || "Praha",
      weatherAPIKey: localStorage.getItem("weatherAPIKey") || "",
      backgroundImage: localStorage.getItem("backgroundImage") || ""
    }
  },
  methods: {
    save() {
      localStorage.setItem("city", this.city);
      localStorage.setItem("weatherAPIKey", this.weatherAPIKey);
      localStorage.setItem("cityTemp", "");
      localStorage.setItem("backgroundImage", this.backgroundImage);
    },
    reset() {
      localStorage.clear();
      this.city = "Praha";
      this.weatherAPIKey = "";
      this.backgroundImage = "";
    },
    onImageUpload(event) {
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.backgroundImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
}
</script>

<template>
  <div>
    <input v-model="city" placeholder="City">
    <input v-model="weatherAPIKey" placeholder="Weather API Key">
    <input type="file" accept="image/*" @change="onImageUpload">

    <!-- Show the image preview if uploaded -->
    <div v-if="backgroundImage" style="margin-top: 10px;">
      <p>Background preview:</p>
      <img :src="backgroundImage" style="max-width: 300px; max-height: 200px; object-fit: cover;">
    </div>

    <button @click="reset">Reset</button>
    <button @click="save">Save</button>
  </div>
</template>

<style scoped>
</style>
