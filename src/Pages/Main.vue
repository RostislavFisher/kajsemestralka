<script>
import Module from "@/components/Module.vue";

export default {
  name: "Main",
  components: { Module },
  data() {
    return {
      activeInteractiveModules: [],
      activeInformativeModules: [],
      currentTime: '',
      currentDate: ''
    };
  },
  mounted() {
    this.loadModules();
    this.interval = setInterval(() => {
      this.loadModules();
      this.updateTime();
    }, 100); // Update every second
  },
  beforeUnmount() {
    clearInterval(this.interval);
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
      this.currentTime = now.toLocaleTimeString('en-GB'); // European format (24-hour)
      this.currentDate = now.toLocaleDateString('en-GB'); // Date in European format
    }
  }
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
      <div class="col-4 weather">
        <div>
          <p class="weatherCity">Praha</p>
          <p class="weatherTemp">16°C</p>
        </div>
      </div>
    </div>
    <div class="col-8">
      <router-link to="/activemodules">
        <button>Active Modules</button>
      </router-link>

      <div class="activeModules">
        <h3>Active Interactive Modules</h3>
        <div v-if="activeInteractiveModules.length === 0">No active interactive modules</div>
        <div class="row">
          <div
              class="col interactiveModule"
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
          <div class="col" v-for="module in activeInformativeModules" :key="module.id">
            <Module :module="module" />
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<style scoped>
.activeModules {
  margin-top: 20px;
}
.col.interactiveModule {
  cursor: pointer;
  transition: background-color 0.3s;
}
.col.interactiveModule:hover {
  background-color: #f0f0f0;
}

.clock {
  border: dashed 1px #ccc;
}
.clockTime {
  font-size: 3.5em;
}
.clockDate {
  font-size: 2em;
}
.weather {
  border: dashed 1px #ccc;
}
.weatherCity {
  font-size: 2em;
}
.weatherTemp {
  font-size: 3.5em;
}
</style>