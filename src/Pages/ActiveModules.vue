<script>
import Module from "@/components/Module.vue";
import ModuleInteractive from "../../classes/ModuleInteractive.js";
import ModuleInformative from "../../classes/ModuleInformative.js";

export default {
  name: "ActiveModules",
  components: { Module },
  data() {
    return {
      activeInteractiveModules: [],
      inactiveInteractiveModules: [],
      activeInformativeModules: [],
      inactiveInformativeModules: [],
      interval: null
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
    // Add a new interactive module
    addInteractiveModule() {
      this.activeInteractiveModules.push(new ModuleInteractive());
      this.saveModules(); // Persist changes
    },
    // Add a new informative module
    addInformativeModule() {
      this.activeInformativeModules.push(new ModuleInformative());
      this.saveModules(); // Persist changes
    },
    // Helper method to safely get modules from localStorage
    getModules(key) {
      try {
        return JSON.parse(localStorage.getItem(key)) || [];
      } catch {
        return []; // Return empty array if parsing fails
      }
    },
    // Load all module states from localStorage
    loadModules() {
      this.activeInteractiveModules = this.getModules("activeInteractiveModules");
      this.inactiveInteractiveModules = this.getModules("inactiveInteractiveModules");
      this.activeInformativeModules = this.getModules("activeInformativeModules");
      this.inactiveInformativeModules = this.getModules("inactiveInformativeModules");
    },
    // Save all module states to localStorage
    saveModules() {
      localStorage.setItem("activeInteractiveModules", JSON.stringify(this.activeInteractiveModules));
      localStorage.setItem("inactiveInteractiveModules", JSON.stringify(this.inactiveInteractiveModules));
      localStorage.setItem("activeInformativeModules", JSON.stringify(this.activeInformativeModules));
      localStorage.setItem("inactiveInformativeModules", JSON.stringify(this.inactiveInformativeModules));
    },
    // Handle drag start event for module reordering
    onDragStart(event, module, fromList) {
      // Store module data and source list in drag event
      event.dataTransfer.setData("module", JSON.stringify(module));
      event.dataTransfer.setData("fromList", fromList);
    },
    // Handle drop event for module reordering
    onDrop(event, toList) {
      // Retrieve module data and source list from drag event
      const module = JSON.parse(event.dataTransfer.getData("module"));
      const fromList = event.dataTransfer.getData("fromList");

      // Check module type compatibility
      const isInteractive = fromList.includes("Interactive");
      const isInformative = fromList.includes("Informative");

      // Prevent mixing module types (interactive vs informative)
      if (
          (isInteractive && !toList.includes("Interactive")) ||
          (isInformative && !toList.includes("Informative"))
      ) {
        return;
      }

      // Helper function to find and remove module from source list
      const findAndRemove = (list) => {
        const index = this[list].findIndex(m => m.id === module.id);
        if (index !== -1) {
          this[list].splice(index, 1);
        }
      };

      // Remove from source and add to target list
      findAndRemove(fromList);
      this[toList].push(module);

      this.saveModules(); // Persist changes
    }


  }
};
</script>

<template>
  <div class="container">
    <!-- Active Interactive Modules Section -->
    <div class="module-dropzone">
      <span class="module-type-label">Active Interactive Modules</span>
      <div class="module-container" @dragover.prevent @drop="onDrop($event, 'activeInteractiveModules')">
        <Module :module="module" v-for="module in activeInteractiveModules" :key="module.id" draggable="true" @dragstart="onDragStart($event, module, 'activeInteractiveModules')"/>
      </div>
    </div>

    <!-- Inactive Interactive Modules Section -->
    <div class="module-dropzone">
      <span class="module-type-label">Inactive Interactive Modules</span>
      <div class="module-container" @dragover.prevent @drop="onDrop($event, 'inactiveInteractiveModules')">
        <Module :module="module" v-for="module in inactiveInteractiveModules" :key="module.id" draggable="true" @dragstart="onDragStart($event, module, 'inactiveInteractiveModules')"/>
      </div>
    </div>
    <button @click="addInteractiveModule">Add new interactive module</button>

    <!-- Active Informative Modules Section -->
    <div class="module-dropzone">
      <span class="module-type-label">Active Informative Modules</span>
      <div class="module-container" @dragover.prevent @drop="onDrop($event, 'activeInformativeModules')">
        <Module :module="module" v-for="module in activeInformativeModules" :key="module.id" draggable="true" @dragstart="onDragStart($event, module, 'activeInformativeModules')" />
      </div>
    </div>

    <!-- Inactive Informative Modules Section -->
    <div class="module-dropzone">
      <span class="module-type-label">Inactive Informative Modules</span>
      <div class="module-container" @dragover.prevent @drop="onDrop($event, 'inactiveInformativeModules')">
        <Module :module="module" v-for="module in inactiveInformativeModules" :key="module.id" draggable="true" @dragstart="onDragStart($event, module, 'inactiveInformativeModules')" />
      </div>
    </div>
    <button @click="addInformativeModule">Add new informative module</button>
  </div>
</template>

<style scoped>
.container {
  padding: 10px;
  max-width: 100%;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

.module-dropzone {
  position: relative;
  margin: 20px 0;
}

.module-type-label {
  position: absolute;
  top: -10px;
  right: 10px;
  background-color: #f0f0f0;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: bold;
  -webkit-box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  z-index: 1;
}

.module-container {
  min-height: 200px;
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 15px 10px 10px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-flex-wrap: wrap;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  background-color: #f9f9f9;
  gap: 10px;
}

.module-container > div {
  -webkit-box-flex: 1;
  -webkit-flex: 1 1 calc(50% - 10px);
  -ms-flex: 1 1 calc(50% - 10px);
  flex: 1 1 calc(50% - 10px);
  min-width: 120px;
  max-width: 100%;
}

button {
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  -webkit-transition: background-color 0.3s;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #45a049;
}

@media (max-width: 480px) {
  .module-container > div {
    -webkit-box-flex: 1;
    -webkit-flex: 1 1 100%;
    -ms-flex: 1 1 100%;
    flex: 1 1 100%;
  }

  .module-type-label {
    font-size: 0.8rem;
    top: -8px;
  }

  button {
    padding: 10px;
    font-size: 0.9rem;
  }
}
</style>
