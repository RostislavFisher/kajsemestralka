import './assets/main.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

import { createApp } from 'vue';
import App from './App.vue';
import router from "@/router/index.js";
import ModuleInformative from "../classes/ModuleInformative.js";
import ModuleInteractive from "../classes/ModuleInteractive.js";

// Create Vue app
const app = createApp(App);
app.use(router);
app.mount('#app');

// Initialize sound effects
const toggleSound = new Audio('/src/assets/sounds/minecraft_click.mp3');
const upSound = new Audio('/src/assets/sounds/up.mp3');
const downSound = new Audio('/src/assets/sounds/down.mp3');


// Function to load modules from localStorage
function loadModulesFromStorage(key, ModuleClass) {
    try {
        const data = JSON.parse(localStorage.getItem(key)) || [];
        // Convert plain objects to class instances
        return data.map(moduleData => Object.assign(new ModuleClass(), moduleData));
    } catch {
        return []; // Return empty array if parsing fails
    }
}

// Load initial module states from localStorage
let previousActiveInteractiveModules = loadModulesFromStorage("activeInteractiveModules", ModuleInteractive);
const inactiveInteractiveModules = loadModulesFromStorage("inactiveInteractiveModules", ModuleInteractive);
const activeInformativeModules = loadModulesFromStorage("activeInformativeModules", ModuleInformative);
const inactiveInformativeModules = loadModulesFromStorage("inactiveInformativeModules", ModuleInformative);

// function saveModules() {
//     localStorage.setItem("activeInteractiveModules", JSON.stringify(previousActiveInteractiveModules));
//     localStorage.setItem("inactiveInteractiveModules", JSON.stringify(inactiveInteractiveModules));
//     localStorage.setItem("activeInformativeModules", JSON.stringify(activeInformativeModules));
//     localStorage.setItem("inactiveInformativeModules", JSON.stringify(inactiveInformativeModules));
// }

// Function to check if toggle states have changed
function checkForToggleChanges(oldModules, newModules) {
    // First check if array lengths differ
    if (oldModules.length !== newModules.length) return true;

    // Then check individual toggle states
    for (let i = 0; i < oldModules.length; i++) {
        if (oldModules[i].isToggled !== newModules[i].isToggled) {
            return true;
        }
    }
    return false;
}


// Function to update module states
function updateModules() {
    // Load current module states
    const activeInteractiveModules = loadModulesFromStorage("activeInteractiveModules", ModuleInteractive);
    const inactiveInteractiveModules = loadModulesFromStorage("inactiveInteractiveModules", ModuleInteractive);
    const activeInformativeModules = loadModulesFromStorage("activeInformativeModules", ModuleInformative);
    const inactiveInformativeModules = loadModulesFromStorage("inactiveInformativeModules", ModuleInformative);

    // Store previous values for comparison
    const previousValues = activeInformativeModules.map(module => module.value);

    // Initialize all modules
    const allModules = [...activeInteractiveModules, ...inactiveInteractiveModules, ...activeInformativeModules, ...inactiveInformativeModules];

    allModules.forEach(module => {
        if (module instanceof ModuleInformative) {
            // 10% chance to change informative module value
            if (Math.random() < 0.1) {
                module.value += Math.random() < 0.5 ? -1 : 1; // Randomly increment/decrement
            }
        }
        if (module instanceof ModuleInteractive) {
            // 10% chance to toggle interactive module
            if (Math.random() < 0.1) {
                module.isToggled = !module.isToggled;
            }
        }
    });

    // Play sound effects for value changes
    activeInformativeModules.forEach((module, index) => {
        const previousValue = previousValues[index];
        if (module.value > previousValue) {
            upSound.play().catch(e => console.log("Audio play failed:", e));
        } else if (module.value < previousValue) {
            downSound.play().catch(e => console.log("Audio play failed:", e));
        }
    });

    // Check for toggle changes and play sound if detected
    const currentActiveInteractiveModules = loadModulesFromStorage("activeInteractiveModules", ModuleInteractive);
    if (checkForToggleChanges(previousActiveInteractiveModules, currentActiveInteractiveModules)) {
        toggleSound.play().catch(e => console.log("Audio play failed:", e));
    }
    previousActiveInteractiveModules = JSON.parse(JSON.stringify(currentActiveInteractiveModules));

    // Save updated modules to localStorage
    localStorage.setItem("activeInteractiveModules", JSON.stringify(activeInteractiveModules));
    localStorage.setItem("inactiveInteractiveModules", JSON.stringify(inactiveInteractiveModules));
    localStorage.setItem("activeInformativeModules", JSON.stringify(activeInformativeModules));
    localStorage.setItem("inactiveInformativeModules", JSON.stringify(inactiveInformativeModules));
}

// Set up periodic module updates (every second)
setInterval(updateModules, 1000);