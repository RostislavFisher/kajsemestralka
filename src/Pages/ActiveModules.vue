<script>
import Module from "@/components/Module.vue";
import ModuleInteractive from "../../classes/ModuleInteractive.js";
import ModuleInformative from "../../classes/ModuleInformative.js";

export default {
  name: "ActiveModules",
  components: { Module },
  data() {
    return {
      activeInteractiveModules: this.getModules("activeInteractiveModules"),
      inactiveInteractiveModules: this.getModules("inactiveInteractiveModules"),
      activeInformativeModules: this.getModules("activeInformativeModules"),
      inactiveInformativeModules: this.getModules("inactiveInformativeModules")
    };
  },
  methods: {
    addInteractiveModule() {
      this.activeInteractiveModules.push(new ModuleInteractive());
      this.saveModules();
    },
    addInformativeModule() {
      this.activeInformativeModules.push(new ModuleInformative());
      this.saveModules();
    },
    getModules(key) {
      try {
        return JSON.parse(localStorage.getItem(key)) || [];
      } catch {
        return [];
      }
    },
    saveModules() {
      localStorage.setItem("activeInteractiveModules", JSON.stringify(this.activeInteractiveModules));
      localStorage.setItem("inactiveInteractiveModules", JSON.stringify(this.inactiveInteractiveModules));
      localStorage.setItem("activeInformativeModules", JSON.stringify(this.activeInformativeModules));
      localStorage.setItem("inactiveInformativeModules", JSON.stringify(this.inactiveInformativeModules));
    },
    onDragStart(event, module, fromList) {
      event.dataTransfer.setData("module", JSON.stringify(module));
      event.dataTransfer.setData("fromList", fromList);
    },
    onDrop(event, toList) {
      const module = JSON.parse(event.dataTransfer.getData("module"));
      const fromList = event.dataTransfer.getData("fromList");

      const isInteractive = fromList.includes("Interactive");
      const isInformative = fromList.includes("Informative");

      if (
          (isInteractive && !toList.includes("Interactive")) ||
          (isInformative && !toList.includes("Informative"))
      ) {
        return;
      }

      const findAndRemove = (list) => {
        const index = this[list].findIndex(m => m.id === module.id);
        if (index !== -1) {
          this[list].splice(index, 1);
        }
      };

      findAndRemove(fromList);
      this[toList].push(module);

      this.saveModules();
    }


  }
};
</script>

<template>
  <div class="container">
    <p>Active Interactive Modules</p>
    <div class="module-container" @dragover.prevent @drop="onDrop($event, 'activeInteractiveModules')">
      <div v-for="module in activeInteractiveModules" :key="module.id" draggable="true" @dragstart="onDragStart($event, module, 'activeInteractiveModules')">
        <Module :module="module" />
      </div>
    </div>
    <p>Inactive Interactive Modules</p>
    <div class="module-container" @dragover.prevent @drop="onDrop($event, 'inactiveInteractiveModules')">
      <div v-for="module in inactiveInteractiveModules" :key="module.id" draggable="true" @dragstart="onDragStart($event, module, 'inactiveInteractiveModules')">
        <Module :module="module" />
      </div>
    </div>
    <button @click="addInteractiveModule">Add new interactive module</button>

    <p>Active Informative Modules</p>
    <div class="module-container" @dragover.prevent @drop="onDrop($event, 'activeInformativeModules')">
      <div v-for="module in activeInformativeModules" :key="module.id" draggable="true" @dragstart="onDragStart($event, module, 'activeInformativeModules')">
        <Module :module="module" />
      </div>
    </div>
    <p>Inactive Informative Modules</p>
    <div class="module-container" @dragover.prevent @drop="onDrop($event, 'inactiveInformativeModules')">
      <div v-for="module in inactiveInformativeModules" :key="module.id" draggable="true" @dragstart="onDragStart($event, module, 'inactiveInformativeModules')">
        <Module :module="module" />
      </div>
    </div>
    <button @click="addInformativeModule">Add new informative module</button>
  </div>
</template>

<style scoped>
.module-container {
  min-height: 50px;
  border: 2px dashed #ccc;
  padding: 10px;
  margin: 10px 0;
}
</style>
