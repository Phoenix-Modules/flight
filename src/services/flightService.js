import {
    getActorFromChatMessage,
    getCurrentSceneTokenFromChatMessage,
    getItemFromChatMessage
} from "./chatMessageService";
import {addEffectIfMissing, deleteEffectIfExists, hasEffect} from "./actorService";
import {getAcAdjustmentValue, getIncrementValue, getMaxFlightHeightValue} from "./settingsService";
import Features from "../constants/features";
import {scaleToken} from "./tokenService";

const flightItems = ["Take Flight", "Land", "Fly Higher", "Fly Lower"];

export async function parseChatForFlight(chatMessage, messageText, chatData) {
    const itemUsed = await getItemFromChatMessage(chatMessage);
    if(!itemUsed) return;
    
    const command = flightItems.find(flightItem => itemUsed.name === flightItem);
    if(!command) return;
       
    const initiatingActorToken = await getCurrentSceneTokenFromChatMessage(chatMessage);
    const controlledToken = canvas.tokens.controlled[0];
    
    if(game.user.isGM) {
        if(!controlledToken) {
            ui.notifications.warn("Please select a token to initiate flight on.");
        }
        await handleFlightCommand(command, controlledToken.actor, controlledToken);
        return;
    }
    

    if(initiatingActorToken.actorId !== controlledToken.document.actorid) {
        ui.notifications.warn("Please select your token to use this action.");
        return;
    }
    
    await handleFlightCommand(command, controlledToken.actor, controlledToken);    
}

async function updateTokenElevation(token, elevation) {    
    if(token.document.elevation === elevation) return;
    await token.document.update({ elevation: elevation });
}

async function updateFlyingStatus(actor, status) {
    const acAdjustment = getAcAdjustmentValue();
    const effectData = {
        label: "Flying",
        icon: Features.FlyingImage,
        changes: [
            { key: "system.attributes.ac.bonus", mode: CONST.ACTIVE_EFFECT_MODES.ADD, value: acAdjustment }
        ],
        statuses: [
            "flying"
        ],
        origin: actor.uuid,
    };
    

    if (status) {
        await addEffectIfMissing(actor, effectData);
    } else {
        await deleteEffectIfExists(actor, effectData.label);
    }
}

async function handleFlightCommand(command, actor, token) {
    const incrementValue = getIncrementValue();
    const maxHeight = getMaxFlightHeightValue();
    const currentElevation = token.document.elevation;
    switch (command) {
        case "Take Flight":
            await updateFlyingStatus(actor, true);
            await updateTokenElevation(token, incrementValue);
            await scaleToken(token, incrementValue);
            break;
        case "Land":
            if(!await hasEffect(actor, "Flying")) return;
            await updateFlyingStatus(actor, false);
            await updateTokenElevation(token, 0);
            await scaleToken(token, 0);
            break;
        case "Fly Higher":
            if(!await hasEffect(actor, "Flying")) return;
            const newElevationUp = Math.min((currentElevation || 0) + incrementValue, maxHeight);
            await updateTokenElevation(token, newElevationUp);
            await scaleToken(token, newElevationUp);
            return false;
        case "Fly Lower":
            if(!await hasEffect(actor, "Flying")) return;
            const newElevationDown = Math.max((currentElevation || 0) - incrementValue, incrementValue);
            await updateTokenElevation(token, newElevationDown);
            await scaleToken(token, newElevationDown);
            return false;
        default:
            console.warn(`Unknown flight command: ${command}`);
    }
}