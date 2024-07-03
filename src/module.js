import { handleFlightFeatures } from './services/flightService.js';
import { addFlightFeaturesToCompendium } from "./services/dataService.js";
import {registerSettings} from "./services/settingsService";
import {SocketService} from "@phoenix-modules/common-library";
import {FEATURES, MODULE_NAME} from "./constants/moduleConstants";

Hooks.once("init", async () => {
    await registerSettings();
    console.log("Phoenix Modules - Flight is installed!");
});


Hooks.once('ready', async () => {
    await addFlightFeaturesToCompendium();
    new SocketService(MODULE_NAME);
});


Hooks.on("preCreateChatMessage", (chatMessage, messageText, chatData) => {
    handleFlightFeatures(chatMessage, messageText, chatData);
    const itemNamesToBlock = [FEATURES.RaiseLabel, FEATURES.LowerLabel];
    const item = itemNamesToBlock.find(item => chatMessage.content.includes(item));
    if (item) {
        return false;
    }
});