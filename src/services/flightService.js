import {getAcAdjustmentValue, getIncrementValue, getMaxFlightHeightValue, getTokenScaleValue} from "./settingsService";
import {FEATURES, MODULE_NAME} from "../constants/moduleConstants";
import { animateFlying, animateLanding } from "./animationService";
import {ChatMessageService, EffectService, PhxConst} from "@phoenix-modules/common-library";

const flightItems = ["Take Flight", "Land", "Fly Higher", "Fly Lower"];

export async function handleFlightFeatures(chatMessage, messageText, chatData) {
    const itemUsed = await ChatMessageService.GetItemFromChatMessage(chatMessage);
    if(!itemUsed) return;
    
    const command = flightItems.find(flightItem => itemUsed.name === flightItem);
    if(!command) return;
       
    const initiatingActorToken = await ChatMessageService.GetCurrentSceneTokenFromChatMessage(chatMessage);
    const controlledToken = canvas.tokens.controlled[0];
    
    if(game.user.isGM) {
        if(!controlledToken) {
            ui.notifications.warn("Please select a token to initiate flight on.");
            return;
        }
        await handleFlightCommand(command, controlledToken.actor, controlledToken);
        return;
    }
    

    if(initiatingActorToken.actorId !== controlledToken.document.actorId) {
        ui.notifications.warn("Please select your token to use this action.");
        return;
    }
    
    await handleFlightCommand(command, controlledToken.actor, controlledToken);    
}

async function updateFlyingStatus(actor, token, status) {
    const acAdjustment = getAcAdjustmentValue();
    const isJb2a = game.modules.get('jb2a_patreon')?.active;
    const isSequencer = game.modules.get('sequencer')?.active;
    
    const effectData = {
        label: "Flying",
        icon: FEATURES.FlyingImage,
        changes: [
            { key: "system.attributes.ac.bonus", mode: CONST.ACTIVE_EFFECT_MODES.ADD, value: acAdjustment }
        ],
        statuses: [
            "flying"
        ],
        origin: actor.uuid,
    };
    

    if (status) {
        if(isJb2a && isSequencer) {
            animateFlying(token);
        }
        await window.PhoenixSocketLib[MODULE_NAME].executeAsGM(PhxConst.SOCKET_METHOD_NAMES.ADD_EFFECT, actor, effectData);
    } else {
        if(isJb2a && isSequencer) {
            animateLanding(token);
        }
        await window.PhoenixSocketLib[MODULE_NAME].executeAsGM(PhxConst.SOCKET_METHOD_NAMES.REMOVE_EFFECT, actor, effectData.label);
    }
}

async function handleFlightCommand(command, actor, token) {
    const incrementValue = getIncrementValue();
    const maxHeight = getMaxFlightHeightValue();
    const shouldScaleToken = getTokenScaleValue();
    const currentElevation = token.document?.elevation;
        
    let updateFlightStatus = false;
    let flightStatus;
    let newElevation;
    
    switch (command) {
        case "Take Flight":
            if(EffectService.HasEffect(actor, "Flying")) return;
            updateFlightStatus = true;
            flightStatus = true;
            newElevation = incrementValue;
            break;
        case "Land":
            if(!EffectService.HasEffect(actor, "Flying")) return;
            updateFlightStatus = true;
            flightStatus = false;
            newElevation = 0;            
            break;
        case "Fly Higher":
            if(!EffectService.HasEffect(actor, "Flying")) return;
            updateFlightStatus = false;
            newElevation = Math.min((currentElevation || 0) + incrementValue, maxHeight);            
            break;
        case "Fly Lower":
            if(!EffectService.HasEffect(actor, "Flying")) return;
            updateFlightStatus = false;
            newElevation = Math.max((currentElevation || 0) - incrementValue, incrementValue);
            break;
        default:
            console.warn(`Unknown flight command: ${command}`);
    }

    if(updateFlightStatus) {
        await updateFlyingStatus(actor, token, flightStatus);        
    }
    if(shouldScaleToken) {
        await window.PhoenixSocketLib[MODULE_NAME].executeAsGM(PhxConst.SOCKET_METHOD_NAMES.SCALE_TOKEN, token, newElevation);
    }
    await window.PhoenixSocketLib[MODULE_NAME].executeAsGM(PhxConst.SOCKET_METHOD_NAMES.ELEVATE_TOKEN, token, newElevation);
}