
export const MODULE_NAME = "phoenix-modules-flight";

export const MODULE_DATA = {
    imagesFolder: `/modules/${MODULE_NAME}/assets/images`,
    soundsFolder: `/modules/${MODULE_NAME}/assets/sounds`,
    featurePack: "flight-features",
    macroPack: "flight-macros"
}

export const SETTINGS = {
    FlightHeightKey: "maxFlightHeight",
    IncrementKey: "heightIncrement",
    AcAdjustmentKey: "acAdjustment",
    ActionCostKey: "costsAction",
    TokenScaleKey: "scaleToken"
}

export const IMAGES = {
    ModuleBanner: `${MODULE_DATA.imagesFolder}/Module Banner.png`,
    Flying: `${MODULE_DATA.imagesFolder}/Skill_Fly.png`,
    Land: `${MODULE_DATA.imagesFolder}/Skill_Land.png`,
    Raise: `${MODULE_DATA.imagesFolder}/Skill_Plus.png`,
    Lower: `${MODULE_DATA.imagesFolder}/Skill_Minus.png`
}

export const SOUNDS = {
    FlappingWings: `${MODULE_DATA.soundsFolder}/Flapping Wings.mp3`,
    Landing: `${MODULE_DATA.soundsFolder}/Winged Landing.mp3`,
}

export const FEATURES = {
    FlyingLabel: "Take Flight",
    FlyingImage: IMAGES.Flying,
    RaiseLabel: "Fly Higher",
    RaiseImage: IMAGES.Raise,
    LowerLabel: "Fly Lower",
    LowerImage: IMAGES.Lower,
    LandLabel: "Land",
    LandImage: IMAGES.Land
}