<script setup>
import { useRouter } from "vue-router";
import { onMounted, onBeforeUnmount } from 'vue';

const router = useRouter();

let connectivityCheckInterval;

function goBack() {
  if (window.history.length > 1) {
    router.go(-1);
  } else {
    router.push('/');
  }
}

function goToSettings() {
  router.push('/settings');
}

function checkConnectivity() {
  if (!navigator.onLine) {
    alert('You are currently offline. Return as long as connection is up!');
  }
}

onMounted(() => {
  checkConnectivity();
  connectivityCheckInterval = setInterval(checkConnectivity, 1000);
  window.addEventListener('online', checkConnectivity);
  window.addEventListener('offline', checkConnectivity);
});

onBeforeUnmount(() => {
  clearInterval(connectivityCheckInterval);
  window.removeEventListener('online', checkConnectivity);
  window.removeEventListener('offline', checkConnectivity);
});

const backgroundImage = localStorage.getItem("backgroundImage");
</script>

<template>

  <div class="page" :style="{ backgroundImage: 'url(' + backgroundImage + ')', backgroundSize: 'cover',}">
    <RouterView />
  </div>
  <div class="linkingPanel">
    <div class="linkingPanelContent">
      <button @click="goBack">&laquo; Back</button>
      <button @click="goToSettings">Settings</button>
    </div>
  </div>
</template>

<style scoped>
.page {
  flex: 1;
  overflow-y: auto;
  background-position: center;
  background-repeat: no-repeat;
}

.linkingPanel {
  height: 60px;
  background: #f0f0f0;
  display: flex;
  //align-items: center;
  //justify-content: center;
}

.linkingPanelContent {
  display: flex;
  gap: 10px;
}
</style>
