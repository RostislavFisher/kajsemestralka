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
  <div class="container">
    <div class="settings-section">
      <h2>Settings</h2>
      <div class="input-group">
        <label for="city">City:</label>
        <input id="city" v-model="city" placeholder="City">
      </div>

      <div class="input-group">
        <label for="weatherAPIKey">Weather API Key:</label>
        <input id="weatherAPIKey" v-model="weatherAPIKey" placeholder="Weather API Key">
      </div>

      <div class="input-group">
        <label for="backgroundImageUpload">Upload Background Image:</label>
        <input id="backgroundImageUpload" type="file" accept="image/*" @change="onImageUpload">
      </div>
    </div>

    <div class="preview-section" v-if="backgroundImage">
      <span class="preview-label">Background preview:</span>
      <div class="preview-container">
        <img :src="backgroundImage" alt="Background preview">
      </div>
    </div>

    <div class="button-group">
      <button class="save-btn" @click="save">Save</button>
    </div>
  </div>
</template>

<style scoped>
.container {
  padding: 15px;
  max-width: 100%;
  box-sizing: border-box;
}

header {
  margin-bottom: 20px;
}

header h1 {
  margin: 0;
  font-size: 1.5rem;
  color: #333;
}

.settings-section {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.input-group {
  margin-bottom: 15px;
}

.input-group:last-child {
  margin-bottom: 0;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
}

input[type="text"],
input[type="file"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  box-sizing: border-box;
}

.preview-section {
  position: relative;
  margin: 20px 0;
}

.preview-label {
  position: absolute;
  top: -10px;
  right: 10px;
  background-color: #f0f0f0;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  z-index: 1;
}

.preview-container {
  min-height: 100px;
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 15px 10px 10px;
  background-color: #f9f9f9;
  text-align: center;
}

.preview-container img {
  max-width: 100%;
  max-height: 200px;
  object-fit: cover;
  border-radius: 4px;
}

.button-group {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

button {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.reset-btn {
  background-color: #f44336;
  color: white;
}

.reset-btn:hover {
  background-color: #d32f2f;
}

.save-btn {
  background-color: #4CAF50;
  color: white;
}

.save-btn:hover {
  background-color: #45a049;
}

@media (max-width: 480px) {
  header h1 {
    font-size: 1.3rem;
  }

  .button-group {
    flex-direction: column;
    gap: 8px;
  }

  button {
    padding: 10px;
    font-size: 0.9rem;
  }
}
</style>