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

const anomalyElement = {
    jane: {
        type: "Assault",
        mod: 7.13,
    },
    piper: {
        type: "Assault",
        mod: 7.13,
    },
    burnice: {
        type: "Burn",
        mod: 0.5,
    },
    grace: {
        type: "Shock",
        mod: 1.25,
    },
    yanagi: {
        type: "Shock",
        mod: 1.25,
    },
};

const state = {
    baseCharacterAttack: 0,
    baseEngineAttack: 0,
    baseAttack: 0,
    attackInput: 0,
    attackIncreasePercentage: 0,
    anomalyProficiency: 0,
    anomalyIncrease: 0,
    attackIncrease: 0,
    attackBuffIncrease: 0,
    anomalyBuffIncrease: 0,
    engineAttackIncrease: 0,
    engineAnomalyIncrease: 0,
    enginePassiveBonusUptime: 0,
    resetBuffs: function () {
        this.attackBuffIncrease = 0;
        this.anomalyBuffIncrease = 0;
    },
    calculate: function () {
        const cAtk = characterData[document.getElementById("character").value];
        const eAtk =
            engineData[document.getElementById("w-engine").value]["baseAtk"];
        this.baseAttack = cAtk + eAtk;
        this.attackIncreasePercentage = +(
            100 *
            (this.attackInput / this.baseAttack - 1)
        ).toFixed(3);
    },
};
