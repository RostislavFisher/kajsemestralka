<script setup>
import { useRouter } from "vue-router";
import { onMounted, onBeforeUnmount } from 'vue';

const router = useRouter();

// Variable to store the connectivity check interval
let connectivityCheckInterval;

// Function to navigate back in history or to home page
function goBack() {
  if (window.history.length > 1) {
    router.go(-1); // Go back one page if history exists
  } else {
    router.push('/'); // Otherwise go to home page
  }
}

// Function to navigate to settings page
function goToSettings() {
  router.push('/settings');
}

// Function to check online/offline status
function checkConnectivity() {
  if (!navigator.onLine) {
    alert('You are currently offline. Return as long as connection is up!');
  }
}

// Lifecycle hook - runs when component is mounted
onMounted(() => {
  checkConnectivity(); // Initial connectivity check
  // Set up periodic connectivity checks (every second)
  connectivityCheckInterval = setInterval(checkConnectivity, 1000);
  // Add event listeners for online/offline status changes
  window.addEventListener('online', checkConnectivity);
  window.addEventListener('offline', checkConnectivity);
});

// Lifecycle hook - runs before component is unmounted
onBeforeUnmount(() => {
  // Clean up interval and event listeners
  clearInterval(connectivityCheckInterval);
  window.removeEventListener('online', checkConnectivity);
  window.removeEventListener('offline', checkConnectivity);
});

// Get background image from localStorage if it exists
const backgroundImage = localStorage.getItem("backgroundImage");
</script>

<template>
  <!-- Main content area -->
  <main class="page" :style="backgroundImage ? { backgroundImage: 'url(' + backgroundImage + ')', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' } : {}">
    <!-- Router view for dynamic content -->
    <RouterView />
  </main>

  <!-- Navigation panel -->
  <nav class="linkingPanel" aria-label="Page navigation">
    <div class="linkingPanelContent">
      <!-- Back button -->
      <button type="button" @click="goBack">&laquo; Back</button>
      <!-- Settings button -->
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
