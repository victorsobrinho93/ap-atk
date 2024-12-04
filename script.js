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
            state.engineAttackIncrease = 0;
            state.engineAnomalyIncrease = 0;
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

        //todo: add uptime count

        const sLabel = document.createElement("label");
        sLabel.textContent = "Stacks";
        sLabel.htmlFor = "engine-s";
        sLabel.classList.add("es-component");

        const selectStacks = document.createElement("select");
        selectStacks.id = "engine-s";
        selectStacks.name = "engine-s";
        selectStacks.classList.add("es-component");

        const maximumStacks = engineData[selectedEngine].stacks;

        for (let i = 0; i <= maximumStacks; i++) {
            const stacks = document.createElement("option");
            if (maximumStacks === 1) {
                stacks.value = i;
                stacks.textContent = i === 0 ? "Inactive" : "Active";
            } else {
                stacks.value = i;
                stacks.textContent = i;
                if (i === Math.ceil(maximumStacks / 2))
                    stacks.setAttribute("selected", "selected");
            }
            selectStacks.appendChild(stacks);
        }

        const uLabel = document.createElement("label");
        uLabel.textContent = "Uptime";
        uLabel.htmlFor = "engine-upt";
        uLabel.classList.add("es-component");

        const setUptime = document.createElement("select");
        setUptime.id = "engine-upt";
        setUptime.name = "engine-upt";
        setUptime.classList.add("es-component");
        setUptime.addEventListener("change", () => {
            state.enginePassiveBonusUptime = +setUptime.value / 100;
        });

        for (let i = 0; i <= 100; i += 25) {
            const uptime = document.createElement("option");
            uptime.value = i / 100;
            uptime.textContent = `${i}%`;
            if (i === 50) {
                uptime.setAttribute("selected", "selected");
            }
            setUptime.appendChild(uptime);
        }

        engineForm.appendChild(rLabel);
        engineForm.appendChild(rSelect);
        if (maximumStacks > 1) {
            engineForm.appendChild(sLabel);
            engineForm.appendChild(selectStacks);
        } else {
            engineForm.appendChild(uLabel);
            engineForm.appendChild(setUptime);
        }

        document.querySelectorAll(".es-component").forEach((e) => {
            e.addEventListener("change", () => {
                const rank = document.getElementById("engine-r");
                const stacks =
                    document.getElementById("engine-s") ??
                    document.getElementById("engine-upt");
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
                console.log(stacks.value);
                // calculateStatValue();
            });
        });
    },
    refresh() {
        const settingsElements = document.querySelectorAll(
            ".es-component, .es-component-uptime"
        );
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
    const { type, mod } = anomalyElement[character.value];

    results.innerHTML = `

        <h2 style="color:${
            type === "Shock" ? "blue" : type === "Burn" ? "red" : "goldenrod"
        }"><span id="dmg-calc">Base</span> ${type} DMG: ${(
        (mod * calculateTotalAttack(0) * calculateTotalAnomaly()) /
        100
    ).toFixed(0)}</h2>

    <table>
        <tr>
            <th colspan="6">Anomaly DMG increase</th>
        </tr>
        <tr>
            <th></th>
            <th>-</th>
            <th>+1</th>
            <th>+2</th>
            <th>+3</th>
            <th>+4</th>
        </tr>
        <tr>
            <th>ATK</th>
            <td id="atk-cell-0">${calculateAttackIncrease(1)}%</td>
            <td id="atk-cell-1">${calculateAttackIncrease(2)}%</td>
            <td id="atk-cell-2">${calculateAttackIncrease(3)}%</td>
            <td id="atk-cell-3">${calculateAttackIncrease(4)}%</td>
            <td id="atk-cell-4">${calculateAttackIncrease(5)}%</td>
        </tr>
        <tr>
            <th>AP</th>
            <td id="ap-cell-0">${calculateAnomalyIncrease(1)}%</td>
            <td id="ap-cell-1">${calculateAnomalyIncrease(2)}%</td>
            <td id="ap-cell-2">${calculateAnomalyIncrease(3)}%</td>
            <td id="ap-cell-3">${calculateAnomalyIncrease(4)}%</td>
            <td id="ap-cell-4">${calculateAnomalyIncrease(5)}%</td>
        </tr>
    </table>
    `;

    document.getElementById(
        "disclaimer"
    ).innerHTML = `<p>* Base: Does not account for other multipliers, including those from W-Engine passives. ATK and AP only.</p>`;
}

function calculateTotalAttack(substatValue) {
    let attack =
        state.baseAttack *
            (1 + (state.attackIncreasePercentage + 3 * substatValue) / 100) *
            (1 + state.engineAttackIncrease / 100) +
        state.attackBuffIncrease;
    if (character.value === "jane") {
        const ap = calculateTotalAnomaly();
        if (ap > 120) {
            let increase = (ap - 120) * 2;
            increase > 600 ? (attack += 600) : (attack += increase);
        }
    }
    console.log(attack);
    return attack;
}

function calculateAttackIncrease(substatValue) {
    return (
        100 -
        (calculateTotalAttack(0) / calculateTotalAttack(substatValue)) * 100
    ).toFixed(2);
}

function calculateTotalAnomaly() {
    return (
        state.anomalyProficiency +
        state.anomalyBuffIncrease +
        state.engineAnomalyIncrease
    );
}

function calculateAnomalyIncrease(substatValue) {
    return (((9 * substatValue) / calculateTotalAnomaly()) * 100).toFixed(2);
}

//     let totalAttack =
//         state.baseAttack *
//             (1 + state.attackIncreasePercentage / 100) *
//             (1 + state.engineAttackIncrease / 100) +
//         state.attackBuffIncrease;
//     let plusThree =
//         state.baseAttack *
//             (1 + (state.attackIncreasePercentage + 3) / 100) *
//             (1 + state.engineAttackIncrease / 100) +
//         state.attackBuffIncrease;
//     if (character.value === "jane") {
//         totalAttack += 600;
//         plusThree += 600;
//     }
//     const attackIncrease = (100 - (totalAttack / plusThree) * 100).toFixed(2);
// }

/* <h2>3% ATK: +${
                        attackIncrease > 3.0 ? "3" : attackIncrease
                    }% Anomaly DMG
                    <h2>9 AP: +${
                        apIncrease > 900 ? "?" : apIncrease
                    }% Anomaly DMG
                    */

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

function baseAnomalyDamage() {
    const selectedCharacter = character.value;
}
