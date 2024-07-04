import {SOUNDS} from "../constants/moduleConstants";

export function animateFlying(token) {
    new Sequence()
        .sound(SOUNDS.FlappingWings)
        .effect()
        .atLocation(token)
        .belowTokens(true)
        .scale(0.5)
        .file("jb2a.impact.boulder.02")
        .play();    
}

export function animateLanding(token) {
    const delay = token.document.elevation * 2 * 7;
    new Sequence()
        .sound(SOUNDS.Landing)
        .effect()
        .delay(delay)
        .scale(0.5)
        .atLocation(token)
        .belowTokens(true)
        .file("jb2a.impact.ground_crack.white.03")
        .play();    
}