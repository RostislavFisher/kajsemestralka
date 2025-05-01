<script>
import Module from "@/components/Module.vue";
import WeatherAPI from "../../classes/Weather/WeatherAPI.js";
import OpenWeatherMap from "../../classes/Weather/OpenWeatherMap.js";

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
      weatherData: {
        temperature: localStorage.getItem("cityTemp") || "",
        sunrise: parseInt(localStorage.getItem("citySunrise")) || 0,
        sunset: parseInt(localStorage.getItem("citySunset")) || 0,
        description: "",
        humidity: 0,
        windSpeed: 0
      },
      weatherAPIKey: localStorage.getItem("weatherAPIKey") || "",
      weatherProvider: localStorage.getItem("weatherProvider") || "OpenWeatherMap"
    };
  },
  computed: {
    formattedLocation() {
      return `${this.city}`;
    },
    cityTemp() {
      return this.weatherData.temperature ? `${Math.round(this.weatherData.temperature)}°C` : "";
    },
    citySunrise() {
      return this.weatherData.sunrise;
    },
    citySunset() {
      return this.weatherData.sunset;
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
  },
  mounted() {
    this.loadModules();
    this.updateTime();
    this.interval = setInterval(() => {
      this.updateTime();
    }, 100);
    this.weatherInterval = setInterval(this.fetchWeather, 600000);
    this.modulesInterval = setInterval(this.loadModules, 500);
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
        if (!this.weatherAPIKey || !this.weatherProvider) {
          console.error('Missing weather configuration - API Key or Provider');
          this.weatherData.temperature = "Configure";
          return;
        }

        const WeatherProviders = {
          OpenWeatherMap: OpenWeatherMap,
          WeatherAPI: WeatherAPI
        };
        const WeatherClass = WeatherProviders[this.weatherProvider];
        if (!WeatherClass) {
          console.error('Invalid weather provider:', this.weatherProvider);
          this.weatherData.temperature = "Error";
          return;
        }

        const weather = new WeatherClass({
          apiKey: this.weatherAPIKey,
          city: this.city
        });

        const data = await weather.getWeather();
        console.log('Raw weather data:', data);

        this.weatherData = {
          temperature: data.temperature || this.weatherData.temperature,
          sunrise: data.sunrise || this.weatherData.sunrise,
          sunset: data.sunset || this.weatherData.sunset,
          description: data.description || this.weatherData.description,
          humidity: data.humidity || this.weatherData.humidity,
          windSpeed: data.windSpeed || this.weatherData.windSpeed
        };

        localStorage.setItem('city', this.city);
        localStorage.setItem('cityTemp', this.weatherData.temperature);
        localStorage.setItem('citySunrise', this.weatherData.sunrise);
        localStorage.setItem('citySunset', this.weatherData.sunset);

      } catch (error) {
        console.error('Error fetching weather:', error);
        this.weatherData.temperature = "Error";
        this.weatherData.description = "Failed to load";
      }
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
  <main class="container">
    <section class="row justify-content-between">
      <div class="col-4 clock">
        <div>
          <p class="clockTime">{{ currentTime }}</p>
          <p class="clockDate">{{ currentDate }}</p>
        </div>
      </div>
      <div class="col-4 weather-widget">
        <div class="weather-container">
          <header class="weather-header" @click="refreshWeather">
            <h2 class="location">{{ formattedLocation }}</h2>
            <div class="temperature">{{ cityTemp }}</div>
          </header>

          <div class="sky-display">
            <svg :width="'100%'" :height="'100%'" :style="{ backgroundColor: skyColor }">
              <circle
                  :cx="celestialBody.x"
                  :cy="celestialBody.y"
                  :r="celestialBody.radius"
                  :fill="celestialBody.color"
                  :class="[celestialBody.type, {
                  'sunrise-effect': isSunrise,
                  'sunset-effect': isSunset
                }]"
                  :filter="isSunVisible ? 'url(#sun-glow)' : 'none'"
              />
              <defs>
                <filter id="sun-glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
            </svg>
          </div>

          <footer class="weather-footer">
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
          </footer>

        </div>
      </div>
    </section>

    <section class="row justify-content-between">
      <div class="col-12">

        <nav>
          <router-link to="/activemodules">
            <button type="button">Active Modules</button>
          </router-link>
        </nav>

        <section class="activeModules">
          <h3>Active Interactive Modules</h3>
          <div v-if="activeInteractiveModules.length === 0">
            No active interactive modules
          </div>
          <div class="row">
            <Module :module="module" class="col-md-3 interactiveModule"
                    v-for="module in activeInteractiveModules"
                    :key="module.id"
                    @click="toggleModuleState(module)"/>
          </div>
        </section>

        <section class="activeModules">
          <h3>Active Informative Modules</h3>
          <div v-if="activeInformativeModules.length === 0">
            No active informative modules
          </div>
          <div class="row">
            <Module :module="module" class="col-md-3"
                    v-for="module in activeInformativeModules"
                    :key="module.id"/>
          </div>
        </section>

      </div>
    </section>

  </main>
</template>

<style scoped>
.container {
  padding: 10px;
  max-width: 100%;
  box-sizing: border-box;
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
  -webkit-box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
  -webkit-box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 15px;
  -webkit-transition: all 0.3s ease;
  transition: all 0.3s ease;
}

.weather-widget:hover {
  -webkit-transform: translateY(-2px);
  transform: translateY(-2px);
  -webkit-box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.weather-container {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
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

.sky-display svg {
  display: block;
  width: 100%;
  height: 100%;
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
  -webkit-box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.interactiveModule {
  cursor: pointer;
  -webkit-transition: all 0.3s ease;
  transition: all 0.3s ease;
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 6px;
}

.interactiveModule:hover {
  background-color: #f8f9fa;
  -webkit-transform: translateY(-3px);
  transform: translateY(-3px);
  -webkit-box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .container {
    padding-left: 10px;
    padding-right: 10px;
  }

  .row.justify-content-between {
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    -webkit-box-align: center;
    -ms-flex-align: center;
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

  .activeModules {
    padding: 10px;
    margin-top: 15px;
    text-align: center;
  }

  .activeModules .row {
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    -webkit-box-align: center;
    -ms-flex-align: center;
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
    -webkit-transform: none;
    transform: none;
  }

  .weather-container {
    text-align: center;
  }

  .weather-header, .weather-footer {
    text-align: center;
  }
}
</style>