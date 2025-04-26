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
  <section>
    <header>
      <h1>Settings</h1>
    </header>

    <article>
      <label for="city">City:</label>
      <input id="city" v-model="city" placeholder="City">

      <label for="weatherAPIKey">Weather API Key:</label>
      <input id="weatherAPIKey" v-model="weatherAPIKey" placeholder="Weather API Key">

      <label for="backgroundImageUpload">Upload Background Image:</label>
      <input id="backgroundImageUpload" type="file" accept="image/*" @change="onImageUpload">
    </article>

    <aside v-if="backgroundImage" style="margin-top: 10px;">
      <p>Background preview:</p>
      <img :src="backgroundImage" style="max-width: 300px; max-height: 200px; object-fit: cover;">
    </aside>

    <nav style="margin-top: 20px;">
      <button @click="reset">Reset</button>
      <button @click="save">Save</button>
    </nav>
  </section>
</template>

<style scoped>
</style>
