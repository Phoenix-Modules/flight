import { flightFeatures } from '../compendium/flightFeatures.js';
import {MODULE_NAME, MODULE_DATA} from "../constants/moduleConstants";
import {CompendiumService, PhxConst} from "@phoenix-modules/common-library";

export async function addFlightFeaturesToCompendium() {
    if(!game.user.isGM) return;
    await CompendiumService.AddManyToCompendium(MODULE_NAME, MODULE_DATA.featurePack, flightFeatures, PhxConst.COMP_TYPES.Item);
}
