const characterData = {
    jane: 880,
    burnice: 863,
    yanagi: 872,
    grace: 825,
    piper: 758,
};

const engineData = {
    gemini: {
        baseAtk: 594,
        stacks: 4,
        atkValuePerStack: null,
        anomalyValuePerStack: [0, 30, 34, 38, 42, 46],
    },
    roaring: {
        baseAtk: 624,
        stacks: 1,
        atkValuePerStack: [0, 8, 9.2, 10.4, 11.6, 12.8],
        anomalyValuePerStack: [0, 40, 46, 52, 58, 64],
    },
    rainforest: {
        baseAtk: 594,
        stacks: 10,
        atkValuePerStack: [0, 2.5, 2.8, 3.2, 3.6, 4],
        anomalyValuePerStack: null,
    },
    lipgloss: {
        baseAtk: 594,
        stacks: 1,
        atkValuePerStack: [0, 10, 11.5, 13, 14.5, 16],
        anomalyValuePerStack: null,
    },
    timeweaver: {
        baseAtk: 714,
        stacks: 1,
        atkValuePerStack: null,
        anomalyValuePerStack: [0, 75 / 85 / 95 / 105 / 115],
    },
    stinger: {
        baseAtk: 713,
        stacks: null,
        atkValuePerStack: null,
        anomalyValuePerStack: null,
    },
    fusion: {
        baseAtk: 684,
        stacks: 3,
        atkValuePerStack: [0, 12, 15, 18, 21, 24],
        anomalyValuePerStack: [0, 25, 31, 37, 43, 50],
    },
    flamemaker: {
        baseAtk: 713,
        stacks: 1,
        atkValuePerStack: null,
        anomalyValuePerStack: [0, 50, 62, 75, 87, 100],
    },
};

const buffs = {
    seth: {
        anomaly: 100,
        attack: 0,
    },
    caesar: {
        anomaly: 0,
        attack: 1000,
    },
    lucy: {
        anomaly: 0,
        attack: 600,
    },
    soukaku: {
        anomaly: 0,
        attack: 500,
    },
    vortex: {
        anomaly: 0,
        attack: 1000,
    },
    jane: {
        anomaly: 0,
        attack: 600,
    },
};