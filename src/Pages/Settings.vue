<script>
export default {
  name: "Settings",
  data() {
    return {
      city: localStorage.getItem("city") || "Praha",
      weatherAPIKey: localStorage.getItem("weatherAPIKey") || "",
      backgroundImage: localStorage.getItem("backgroundImage") || "",
      errors: {
        city: "",
        weatherAPIKey: ""
      }
    }
  },
  methods: {
    validate() {
      let isValid = true;

      this.errors = {
        city: "",
        weatherAPIKey: ""
      };

      if (!this.city.trim()) {
        this.errors.city = "City is required";
        isValid = false;
      } else if (!/^[a-zA-Z\u0080-\u024F\s\/\-\)\(\`\.\"\']+$/.test(this.city)) {
        this.errors.city = "City contains invalid characters";
        isValid = false;
      }

      if (!this.weatherAPIKey.trim()) {
        this.errors.weatherAPIKey = "API key is required";
        isValid = false;
      }

      return isValid;
    },
    save() {
      if (!this.validate()) {
        return;
      }
      localStorage.setItem("city", this.city);
      localStorage.setItem("weatherAPIKey", this.weatherAPIKey);
      localStorage.setItem("cityTemp", "");
      localStorage.setItem("backgroundImage", this.backgroundImage);
    },
    onImageUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      if (file.size > 5 * 1024 * 1024) {
        alert("Image must be smaller than 5MB");
        return;
      }

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
        <input id="city" v-model="city" type="text"
            placeholder="Enter your city (e.g., Praha)" :class="{ 'error': errors.city }"
            required autofocus>
        <span class="error-message" v-if="errors.city">{{ errors.city }}</span>
      </div>

      <div class="input-group">
        <label for="weatherAPIKey">Weather API Key:</label>
        <input id="weatherAPIKey" v-model="weatherAPIKey" type="password"
            placeholder="Enter your weather API key" :class="{ 'error': errors.weatherAPIKey }"
            required>
        <span class="error-message" v-if="errors.weatherAPIKey">{{ errors.weatherAPIKey }}</span>
      </div>

      <div class="input-group">
        <label for="backgroundImageUpload">Upload Background Image:</label>
        <input
            id="backgroundImageUpload"
            type="file"
            accept="image/*"
            @change="onImageUpload"
            placeholder="Select an image file">
        <span class="hint">(JPEG, PNG or GIF, max 5MB)</span>
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
input[type="password"],
input[type="file"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  box-sizing: border-box;
}

input.error {
  border-color: #f44336;
}

.error-message {
  color: #f44336;
  font-size: 0.8rem;
  display: block;
  margin-top: 5px;
}

.hint {
  color: #666;
  font-size: 0.8rem;
  display: block;
  margin-top: 5px;
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