<script>
import Module from "@/components/Module.vue";
import ModuleInteractive from "../../classes/ModuleInteractive.js";
import ModuleInformative from "../../classes/ModuleInformative.js";

export default {
  name: "Main",
  computed: {
    ModuleInformative() {
      return ModuleInformative
    },
    ModuleInteractive() {
      return ModuleInteractive
    }
  },
  components: {Module}
}
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
      <div class="activeModules">
        <div class="row">
          <div class="col">
            <Module :module="new ModuleInteractive()"></Module>
          </div>
        </div>
      </div>
      <div class="activeModules">
        <div class="row">
          <div class="col">
            <Module :module="new ModuleInformative()"></Module>
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
.module{

}

</style>