import ModuleInterface from "./ModuleInterface.js";

class ModuleInteractive extends ModuleInterface {
    constructor() {
        super();
        this.isToggled = false;
    }
}

export default ModuleInteractive;