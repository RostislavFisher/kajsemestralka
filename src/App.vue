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
  <main class="page" :style="backgroundImage ? { backgroundImage: 'url(' + backgroundImage + ')', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' } : {}">
    <RouterView />
  </main>

  <nav class="linkingPanel" aria-label="Page navigation">
    <div class="linkingPanelContent">
      <button type="button" @click="goBack">&laquo; Back</button>
      <button type="button" @click="goToSettings">Settings</button>
    </div>
  </nav>
</template>

<style scoped>
.page {
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  overflow-y: auto;
}

.linkingPanel {
  height: 60px;
  background: #f0f0f0;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
}

.linkingPanelContent {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  gap: 10px;
}
</style>
