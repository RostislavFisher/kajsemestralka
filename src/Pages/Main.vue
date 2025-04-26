<script>
import Module from "@/components/Module.vue";
import Weather from "../../classes/Weather.js";

export default {
  name: "Main",
  components: { Module },
  data() {
    return {
      activeInteractiveModules: [],
      activeInformativeModules: [],
      currentTime: '',
      currentDate: '',
      city: localStorage.getItem("city") || "Prague",
      cityTemp: localStorage.getItem("cityTemp") || "",
      citySunrise: parseInt(localStorage.getItem("citySunrise")) || 0,
      citySunset: parseInt(localStorage.getItem("citySunset")) || 0,
      stars: [],
      weatherAPIKey: localStorage.getItem("weatherAPIKey") || ""
    };
  },
  computed: {
    formattedLocation() {
      return `${this.city}`;
    },
    celestialBody() {
      const now = Date.now();
      const sunrise = this.citySunrise * 1000;
      const sunset = this.citySunset * 1000;
      const isDaytime = now >= sunrise && now <= sunset;
      const totalDayDuration = sunset - sunrise;

      if (isDaytime) {
        const progress = (now - sunrise) / totalDayDuration;
        const angle = progress * Math.PI;
        const x = 20 + progress * 160;
        const y = 80 - Math.sin(angle) * 70;

        const red = 255;
        const green = Math.floor(220 - Math.abs(progress - 0.5) * 100);
        const blue = Math.floor(50 + Math.abs(progress - 0.5) * 100);

        return {
          x,
          y,
          radius: 10,
          color: `rgb(${red}, ${green}, ${blue})`,
          type: "sun"
        };
      }
      else {
        const nextSunrise = sunrise + 24 * 3600 * 1000;
        const nightProgress = now < sunrise
            ? (now + 24 * 3600 * 1000 - sunset) / (nextSunrise - sunset)
            : (now - sunset) / (nextSunrise - sunset);

        const angle = nightProgress * Math.PI;
        const x = 20 + nightProgress * 160;
        const y = 80 - Math.sin(angle) * 70;

        return {
          x,
          y,
          radius: 8,
          color: "#ddd",
          type: "moon"
        };
      }
    },
    skyColor() {
      const now = Date.now();
      const sunrise = this.citySunrise * 1000;
      const sunset = this.citySunset * 1000;

      if (now < sunrise - 3600000) {
        return "#0b0e23";
      } else if (now >= sunrise - 3600000 && now < sunrise) {
        const progress = (now - (sunrise - 3600000)) / 3600000;
        return this.interpolateColor("#0b0e23", "#1a3a6a", progress);
      } else if (now >= sunrise && now < sunrise + 1800000) {
        const progress = (now - sunrise) / 1800000;
        return this.interpolateColor("#1a3a6a", "#87CEEB", progress);
      } else if (now >= sunrise + 1800000 && now < sunset - 1800000) {
        return "#87CEEB";
      } else if (now >= sunset - 1800000 && now < sunset) {
        const progress = (now - (sunset - 1800000)) / 1800000;
        return this.interpolateColor("#87CEEB", "#1a3a6a", progress);
      } else if (now >= sunset && now < sunset + 3600000) {
        const progress = (now - sunset) / 3600000;
        return this.interpolateColor("#1a3a6a", "#0b0e23", progress);
      } else {
        return "#0b0e23";
      }
    },
    isSunVisible() {
      return this.celestialBody.type === "sun";
    },
    isSunrise() {
      const now = Date.now();
      const sunrise = this.citySunrise * 1000;
      return now >= sunrise && now < sunrise + 1800000;
    },
    isSunset() {
      const now = Date.now();
      const sunset = this.citySunset * 1000;
      return now >= sunset - 1800000 && now < sunset;
    },
    isNight() {
      const now = Date.now();
      const sunrise = this.citySunrise * 1000;
      const sunset = this.citySunset * 1000;
      return now < sunrise || now > sunset;
    },
    sunRays() {
      const rays = [];
      for (let i = 0; i < 8; i++) {
        rays.push(i);
      }
      return rays;
    },
  },
  mounted() {
    this.loadModules();
    this.updateTime();
    this.interval = setInterval(() => {
      this.updateTime();
    }, 100);
    this.weatherInterval = setInterval(this.fetchWeather, 600000);
    this.modulesInterval = setInterval(this.loadModules, 500);
    this.generateStars();
    this.fetchWeather();
  },
  beforeUnmount() {
    clearInterval(this.interval);
    clearInterval(this.weatherInterval);
    clearInterval(this.modulesInterval);
  },
  methods: {
    loadModules() {
      try {
        this.activeInteractiveModules = JSON.parse(localStorage.getItem("activeInteractiveModules")) || [];
        this.activeInformativeModules = JSON.parse(localStorage.getItem("activeInformativeModules")) || [];
      } catch {
        this.activeInteractiveModules = [];
        this.activeInformativeModules = [];
      }
    },
    toggleModuleState(module) {
      module.isToggled = !module.isToggled;
      localStorage.setItem("activeInteractiveModules", JSON.stringify(this.activeInteractiveModules));
    },
    updateTime() {
      const now = new Date();
      this.currentTime = now.toLocaleTimeString("en-GB");
      this.currentDate = now.toLocaleDateString("en-GB");
    },
    async fetchWeather() {
      try {
        const weather = new Weather({
          city: this.city,
          weatherAPIKey: this.weatherAPIKey
        });

        const data = await weather.getWeather();
        this.cityTemp = `${Math.round(data.main.temp)}°C`;
        this.citySunrise = data.sys.sunrise;
        this.citySunset = data.sys.sunset;

        localStorage.setItem('city', this.city);
        localStorage.setItem('cityTemp', this.cityTemp);
        localStorage.setItem('citySunrise', this.citySunrise);
        localStorage.setItem('citySunset', this.citySunset);

        console.log('Weather data updated:', data);
      } catch (error) {
        console.error('Error fetching weather:', error);
        this.cityTemp = "Error";
      }
    },
    generateStars() {
      const stars = [];
      for (let i = 0; i < 50; i++) {
        stars.push({
          x: Math.random() * 100,
          y: Math.random() * 60,
          r: Math.random() * 1.2,
          opacity: 0.5 + Math.random() * 0.5
        });
      }
      this.stars = stars;
    },
    interpolateColor(color1, color2, factor) {
      const hex = color => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
        return result ? [
          parseInt(result[1], 16),
          parseInt(result[2], 16),
          parseInt(result[3], 16)
        ] : null;
      };

      const rgb1 = hex(color1) || [0, 0, 0];
      const rgb2 = hex(color2) || [0, 0, 0];

      const result = rgb1.map((channel, i) => {
        return Math.round(channel + factor * (rgb2[i] - channel));
      });

      return `rgb(${result.join(',')})`;
    },
    refreshWeather() {
      this.fetchWeather();
    },
    formatTime(timestamp) {
      return new Date(timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }
  },
};
</script>

<template>
  <div class="container">
    <div class="row justify-content-between">
      <div class="col-4 clock">
        <div>
          <p class="clockTime">{{ currentTime }}</p>
          <p class="clockDate">{{ currentDate }}</p>
        </div>
      </div>
      <div class="col-4 weather-widget">
        <div class="weather-container">
          <div class="weather-header" @click="refreshWeather">
            <h2 class="location">{{ formattedLocation }}</h2>
            <div class="temperature">{{ cityTemp }}</div>
          </div>

          <div class="sky-display" :style="{ backgroundColor: skyColor }">

            <div
                class="celestial-body"
                :class="[celestialBody.type, {
                'sunrise-effect': isSunrise,
                'sunset-effect': isSunset
              }]"
                :style="{
                left: `${celestialBody.x}px`,
                top: `${celestialBody.y}px`,
                width: `${celestialBody.radius * 2}px`,
                height: `${celestialBody.radius * 2}px`,
                backgroundColor: celestialBody.color,
                boxShadow: isSunVisible ? `0 0 20px ${celestialBody.color}` : 'none'
              }"
            ></div>

            <div
                v-if="isNight"
                class="stars"
            >
              <div
                  v-for="(star, index) in stars"
                  :key="'star'+index"
                  class="star"
                  :style="{
                  left: `${star.x}%`,
                  top: `${star.y}%`,
                  width: `${star.r}px`,
                  height: `${star.r}px`,
                  opacity: star.opacity
                }"
              ></div>
            </div>
          </div>

          <div class="weather-footer">
            <div v-if="isNight" class="celestial-info">
              🌙 Next sunrise: {{ formatTime(citySunrise * 1000) }}
            </div>
            <div v-else-if="isSunset" class="celestial-info">
              🌅 Sunset: {{ formatTime(citySunset * 1000) }}
            </div>
            <div v-else-if="isSunrise" class="celestial-info">
              🌄 Sunrise: {{ formatTime(citySunrise * 1000) }}
            </div>
            <div v-else class="celestial-info">
              ☀️ Daytime: {{ formatTime(citySunrise * 1000) }} - {{ formatTime(citySunset * 1000) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row justify-content-between">
      <div class="col-12">
        <router-link to="/activemodules">
          <button>Active Modules</button>
        </router-link>

        <div class="activeModules">
          <h3>Active Interactive Modules</h3>
          <div v-if="activeInteractiveModules.length === 0">No active interactive modules</div>
          <div class="row">
            <div
                class="col-md-3 interactiveModule"
                v-for="module in activeInteractiveModules"
                :key="module.id"
                @click="toggleModuleState(module)"
            >
              <Module :module="module" />
            </div>
          </div>
        </div>

        <div class="activeModules">
          <h3>Active Informative Modules</h3>
          <div v-if="activeInformativeModules.length === 0">No active informative modules</div>
          <div class="row">
            <div class="col-md-3" v-for="module in activeInformativeModules" :key="module.id">
              <Module :module="module" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  overflow-x: hidden;
  max-width: 100vw;
}

.row {
  margin-left: 0;
  margin-right: 0;
}

.clock {
  border: 1px solid #e0e0e0;
  padding: 20px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.clockTime {
  font-size: 3rem;
  margin-bottom: 0;
  font-weight: 600;
  color: #333;
}

.clockDate {
  font-size: 1.5rem;
  color: #666;
}

.weather-widget {
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 15px;
  transition: all 0.3s ease;
}

.weather-widget:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.weather-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.weather-header {
  text-align: center;
  margin-bottom: 10px;
  cursor: pointer;
}

.location {
  font-size: 1.4rem;
  margin: 0;
  color: #333;
}

.temperature {
  font-size: 2.5rem;
  font-weight: bold;
  margin: 5px 0;
  color: #222;
}

.sky-display {
  position: relative;
  width: 100%;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
  margin: 10px 0;
}

.celestial-body {
  position: absolute;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: all 0.5s ease;
}

.celestial-body.sun {
  background: radial-gradient(circle, #ffde00, #ff8c00);
}

.celestial-body.moon {
  background: radial-gradient(circle, #f5f5f5, #d0d0d0);
}

.sun-rays {
  position: absolute;
  width: 0;
  height: 0;
  transform: translate(-50%, -50%);
}

.ray {
  position: absolute;
  width: 2px;
  background: rgba(255, 165, 0, 0.6);
  transform-origin: bottom center;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
}

.stars {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 40px;
}

.star {
  position: absolute;
  background-color: white;
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

.weather-footer {
  text-align: center;
  font-size: 0.9rem;
  color: #555;
  margin-top: 5px;
}

.celestial-info {
  font-size: 0.9em;
}

.activeModules {
  margin-top: 30px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.interactiveModule {
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 6px;
}

.interactiveModule:hover {
  background-color: #f8f9fa;
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .container {
    padding-left: 10px;
    padding-right: 10px;
  }

  .row.justify-content-between {
    flex-direction: column;
    align-items: center;
  }

  .clock, .weather-widget {
    padding: 15px !important;
    margin-left: 0;
    margin-right: 0;
    width: 100% !important;
    max-width: none !important;
  }


  .clockTime {
    font-size: 2rem;
  }

  .clockDate {
    font-size: 1.2rem;
  }

  .temperature {
    font-size: 2rem;
  }

  .sky-display {
    height: 100px;
    margin: 10px auto;
  }

  .celestial-body {
    width: 16px !important;
    height: 16px !important;
  }

  .activeModules {
    padding: 10px;
    margin-top: 15px;
    text-align: center;
  }

  .activeModules .row {
    flex-direction: column;
    align-items: center;
  }

  .activeModules .col-md-3 {
    width: 100%;
    max-width: 300px;
    margin: 0 auto 10px;
  }

  .weather-footer .celestial-info {
    font-size: 0.8rem;
    text-align: center;
  }

  button {
    width: 100%;
    max-width: 280px;
    padding: 10px;
    margin: 0 auto 15px;
    display: block;
  }

  .interactiveModule {
    padding: 10px;
    margin: 0 auto 10px;
    max-width: 300px;
  }

  .interactiveModule:hover {
    transform: none;
  }

  .sun-rays .ray {
    height: 8px !important;
  }

  .weather-container {
    text-align: center;
  }

  .weather-header, .weather-footer {
    text-align: center;
  }
}
</style>