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

const character = document.getElementById("character");

character.addEventListener("change", () => {
    state.baseCharacterAttack = characterData[character.value];
    enableCalcButton();
});

const engine = document.getElementById("w-engine");

engine.addEventListener("change", () => {
    engineSettings.refresh();
    enableCalcButton();
    if (engine.value !== "") {
        state.baseEngineAttack = engineData[engine.value].baseAtk;
        engineSettings.render();
    }
});

function enableCalcButton() {
    if (character.value === "" || engine.value === "") {
        calculateButton.disabled = true;
    } else {
        calculateButton.disabled = false;
    }
}

const engineR = document.getElementById("engine-r");
const engineStacks = document.getElementById("engine-stacks");
const results = document.getElementById("results");

const engineForm = document.getElementById("engine-form");

engine.addEventListener("change", () => {});

const engineSettings = {
    render() {
        const selectedEngine = engine.value;
        if (
            engineData[selectedEngine].atkValuePerStack === null &&
            engineData[selectedEngine].anomalyValuePerStack === null
        ) {
            console.log("both are null??", selectedEngine);
            return false;
        }

        const rLabel = document.createElement("label");
        rLabel.textContent = "R";
        rLabel.htmlFor = "engine-r";
        rLabel.classList.add("es-component");

        const rSelect = document.createElement("select");
        rSelect.id = "engine-r";
        rSelect.name = "engine-r";
        rSelect.classList.add("es-component");

        for (let i = 1; i <= 5; i++) {
            const rOption = document.createElement("option");
            rOption.value = i;
            rOption.textContent = i;
            rSelect.appendChild(rOption);
        }

        const sLabel = document.createElement("label");
        sLabel.textContent = "Stacks";
        sLabel.htmlFor = "engine-s";
        sLabel.classList.add("es-component");

        const selectStacks = document.createElement("select");
        selectStacks.id = "engine-s";
        selectStacks.name = "engine-s";
        selectStacks.classList.add("es-component");

        for (let i = 0; i <= engineData[selectedEngine].stacks; i++) {
            const stacks = document.createElement("option");
            stacks.value = i;
            stacks.textContent = i;
            selectStacks.appendChild(stacks);
        }

        engineForm.appendChild(rLabel);
        engineForm.appendChild(rSelect);
        engineForm.appendChild(sLabel);
        engineForm.appendChild(selectStacks);

        document.querySelectorAll(".es-component").forEach((e) => {
            e.addEventListener("change", () => {
                const rank = document.getElementById("engine-r");
                const stacks = document.getElementById("engine-s");
                const data = engineData[selectedEngine];
                if (selectedEngine === "fusion") {
                    state.engineAttackIncrease =
                        data.atkValuePerStack[rank.value];
                } else {
                    state.engineAttackIncrease = data.atkValuePerStack
                        ? data.atkValuePerStack[rank.value] * stacks.value
                        : 0;
                }

                state.engineAnomalyIncrease = data.anomalyValuePerStack
                    ? data.anomalyValuePerStack[rank.value] * stacks.value
                    : 0;
                // calculateStatValue();
            });
        });
    },
    refresh() {
        const settingsElements = document.querySelectorAll(".es-component");
        settingsElements.forEach((e) => e.remove());
    },
};

const attackInput = document.getElementById("attack");
attackInput.addEventListener("input", () => {
    state.attackInput = +attackInput.value;
    // calculateStatValue();
});

const anomalyInput = document.getElementById("anomaly");
anomalyInput.addEventListener("input", () => {
    state.anomalyProficiency = +anomalyInput.value;
    // calculateStatValue();
});

const setBuffs = document.getElementById("buffs");

setBuffs.querySelectorAll('input[type="checkbox"]').forEach((e) => {
    e.addEventListener("change", () => {
        state.resetBuffs();
        setBuffs
            .querySelectorAll('input[type="checkbox"]:checked')
            .forEach((c) => {
                state.attackBuffIncrease += buffs[c.id].attack;
                state.anomalyBuffIncrease += buffs[c.id].anomaly;
            });
        // calculateStatValue();
    });
});

function calculateStatValue() {
    state.calculate();
    const results = document.getElementById("results");
    let totalAttack =
        state.baseAttack *
            (1 +
                (state.attackIncreasePercentage + state.engineAttackIncrease) /
                    100) +
        state.attackBuffIncrease;
    let plusThree =
        state.baseAttack *
            (1 +
                (state.attackIncreasePercentage +
                    3 +
                    state.engineAttackIncrease) /
                    100) +
        state.attackBuffIncrease;
    if (character.value === "jane") {
        totalAttack += 600;
        plusThree += 600;
    }
    const attackIncrease = (100 - (totalAttack / plusThree) * 100).toFixed(3);
    //* Anomaly
    const totalAnomaly =
        state.anomalyProficiency +
        state.anomalyBuffIncrease +
        state.engineAnomalyIncrease;
    const apIncrease = ((9 / totalAnomaly) * 100).toFixed(2);

    results.innerHTML = `
                    <h2>3% ATK: +${
                        attackIncrease > 3.0 ? "3" : attackIncrease
                    }% Anomaly DMG
                    <h2>9 AP: +${
                        apIncrease > 900 ? "?" : apIncrease
                    }% Anomaly DMG

    `;
}

const calculateButton = document.getElementById("calc-btn");

calculateButton.addEventListener("click", () => calculateStatValue());

window.onload = () => {
    document.querySelectorAll("form, input").forEach((f) => {
        try {
            f.reset();
        } catch {
            f.value = "";
        }
    });
};

document
    .getElementById("reset-btn")
    .addEventListener("click", () => window.location.reload());
