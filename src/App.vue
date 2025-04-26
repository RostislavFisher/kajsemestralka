<script setup>
import {createRouter as $router} from "vue-router/dist/vue-router.esm-browser.js";

function hasHistory() {
  return window.history.length > 1;
}

const backgroundImage = localStorage.getItem("backgroundImage");
</script>

<template>

  <div class="page" :style="{ backgroundImage: 'url(' + backgroundImage + ')', backgroundSize: 'cover',}">
    <RouterView />
  </div>
  <div class="linkingPanel">
    <div class="linkingPanelContent">
      <RouterLink to="/">
        <button
            type="button"
            @click="hasHistory() ? $router.go(-1) : $router.push('/')">&laquo;
          Back
        </button>

      </RouterLink>
      <RouterLink to="/settings">
        <button>
          Settings
        </button>
      </RouterLink>
    </div>
  </div>

</template>

<style scoped>
</style>
