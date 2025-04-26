import './assets/main.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

import { createApp } from 'vue';
import App from './App.vue';
import router from "@/router/index.js";
import ModuleInformative from "../classes/ModuleInformative.js";
import ModuleInteractive from "../classes/ModuleInteractive.js";

const app = createApp(App);
app.use(router);
app.mount('#app');

const toggleSound = new Audio('/src/assets/sounds/minecraft_click.mp3');

function loadModulesFromStorage(key, ModuleClass) {
    try {
        const data = JSON.parse(localStorage.getItem(key)) || [];
        return data.map(moduleData => Object.assign(new ModuleClass(), moduleData));
    } catch {
        return [];
    }
}

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

function checkForToggleChanges(oldModules, newModules) {
    if (oldModules.length !== newModules.length) return true;

    for (let i = 0; i < oldModules.length; i++) {
        if (oldModules[i].isToggled !== newModules[i].isToggled) {
            return true;
        }
    }
    return false;
}

function updateModules() {
    const activeInteractiveModules = loadModulesFromStorage("activeInteractiveModules", ModuleInteractive);
    const inactiveInteractiveModules = loadModulesFromStorage("inactiveInteractiveModules", ModuleInteractive);
    const activeInformativeModules = loadModulesFromStorage("activeInformativeModules", ModuleInformative);
    const inactiveInformativeModules = loadModulesFromStorage("inactiveInformativeModules", ModuleInformative);

    const allModules = [...activeInteractiveModules, ...inactiveInteractiveModules, ...activeInformativeModules, ...inactiveInformativeModules];

    allModules.forEach(module => {
        if (module instanceof ModuleInformative) {
            if (Math.random() < 0.1) {
                module.value += Math.random() < 0.5 ? -1 : 1;
            }
        }
        if (module instanceof ModuleInteractive) {
            if (Math.random() < 0.9) {
                module.isToggled = !module.isToggled;
            }
        }
    });

    const currentActiveInteractiveModules = loadModulesFromStorage("activeInteractiveModules", ModuleInteractive);
    if (checkForToggleChanges(previousActiveInteractiveModules, currentActiveInteractiveModules)) {
        toggleSound.play().catch(e => console.log("Audio play failed:", e));
    }
    previousActiveInteractiveModules = JSON.parse(JSON.stringify(currentActiveInteractiveModules));

    localStorage.setItem("activeInteractiveModules", JSON.stringify(activeInteractiveModules));
    localStorage.setItem("inactiveInteractiveModules", JSON.stringify(inactiveInteractiveModules));
    localStorage.setItem("activeInformativeModules", JSON.stringify(activeInformativeModules));
    localStorage.setItem("inactiveInformativeModules", JSON.stringify(inactiveInformativeModules));

    console.log("Modules updated:", { activeInteractiveModules, inactiveInteractiveModules, activeInformativeModules, inactiveInformativeModules });
}

setInterval(updateModules, 3000);