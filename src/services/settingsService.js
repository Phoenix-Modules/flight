import { MODULE_NAME, SETTINGS, FEATURES} from "../constants/moduleConstants";

export async function registerSettings() {
    game.settings.register(MODULE_NAME, SETTINGS.FlightHeightKey, {
        name: 'Max Flight Height',
        hint: 'The maximum height (in feet) that a character can fly.',
        scope: 'world', 
        config: true, 
        type: Number, 
        default: 100, 
        restricted: true, 
        onChange: value => {
            console.log(`Max flight height set to ${value}`);
        }
    });

    game.settings.register(MODULE_NAME, SETTINGS.IncrementKey, {
        name: 'Raise/Lower Increment',
        hint: `The increment (in feet) that a character moves when using the ${FEATURES.RaiseLabel}/${FEATURES.LowerLabel} feature.`,
        scope: 'world',
        config: true,
        type: Number,
        default: 5,
        restricted: true,
        onChange: value => {
            console.log(`Height increment set to ${value}`);
        }
    });

    game.settings.register(MODULE_NAME, SETTINGS.AcAdjustmentKey, {
        name: 'Adjust AC when flying',
        hint: 'How much AC (positive or negative) to adjust when in flying state',
        scope: 'world',
        config: true,
        type: Number,
        default: -5,
        restricted: true,
        onChange: value => {
            console.log(`AC adjustment set to ${value}`);
        }
    });

    game.settings.register(MODULE_NAME, SETTINGS.TokenScaleKey, {
        name: 'Scale Token with Height',
        hint: 'Scale the token bigger or smaller depending on height',
        scope: 'world',
        config: true,
        type: Boolean,
        default: true,
        restricted: true,
        onChange: value => {
            console.log(`AC adjustment set to ${value}`);
        }
    });
}


export function getMaxFlightHeightValue() {
    return game.settings.get(MODULE_NAME, SETTINGS.FlightHeightKey);
}


export function getIncrementValue() {
    return game.settings.get(MODULE_NAME, SETTINGS.IncrementKey);
}

export function getAcAdjustmentValue() {
    return game.settings.get(MODULE_NAME, SETTINGS.AcAdjustmentKey);
}

export function getTokenScaleValue() {
    return game.settings.get(MODULE_NAME, SETTINGS.TokenScaleKey);
}