<script>
import Module from "@/components/Module.vue";

export default {
  name: "Main",
  components: { Module },
  data() {
    return {
      activeInteractiveModules: [],
      activeInformativeModules: []
    };
  },
  mounted() {
    this.loadModules();
    this.interval = setInterval(() => {
      this.loadModules();
    }, 3000);
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
      // todo: reactivity issue
    }
  }
};
</script>

<template>
  <div class="container">
    <div class="row justify-content-between">
      <div class="col-4">
        <div>
          <p>11:50</p>
          <p>26.02.2025, WED</p>
        </div>
      </div>
      <div class="col-4">
        <div>
          <p>Praha</p>
          <p>16C</p>
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
              class="col"
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
.col {
  cursor: pointer;
  transition: background-color 0.3s;
}
.col:hover {
  background-color: #f0f0f0;
}
</style>